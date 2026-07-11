import {
  Card,
  Typography,
  Button,
  Tag,
  Modal,
  Popconfirm,
  message,
  Upload,
  type UploadProps,
  type GetProp,
} from "antd";
import { useAppDispatch, useAppSelector } from "../storeManager/hooks";
import { useEffect, useState } from "react";
import {
  getUser,
  getUsers,
  promoteOrDemote,
} from "../storeManager/slices/authSlice";
import { authService } from "../services/authService";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const Profile: React.FC = () => {
  const { user, users } = useAppSelector((state) => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const [fileList, setFileList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingForUpload, setLoadingForUpload] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const userId = authService.getUserID();
    if (userId && !user) {
      dispatch(getUser(userId));
    }
    dispatch(getUsers());
  }, []);

  // separate effect to update fileList when user changes
  useEffect(() => {
    if (user?.profileImage) {
      setFileList([
        {
          uid: "-1",
          name: "profile.png",
          status: "done",
          url: `http://localhost:5000${user.profileImage}`,
        },
      ]);
    }
  }, [user]);

  const capitaliseUsername = (name: string) => {
    return `${name?.slice(0, 1)?.toUpperCase()}${name?.slice(1)}`;
  };

  const getBase64 = (img: FileType, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      messageApi.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handlePromote = async (userId: string, role: string) => {
    try {
      setLoading(true);
      await dispatch(promoteOrDemote({ userId, role })).unwrap();
      message.success("User role updated successfully!");
      setLoading(false);
      setIsModalOpen(false);
    } catch (err) {
      message.error("Failed to update user role. Please try again.");
      console.log(err);
      setLoading(false);
    }
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setLoadingForUpload(false);
  };

  const uploadButton = (
    <button
      style={{ border: 0, background: "none" }}
      type="button"
      className="cursor-pointer"
    >
      {loadingForUpload ? (
        <LoadingOutlined />
      ) : (
        <PlusOutlined className="cursor-pointer" />
      )}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise<string>((resolve) => {
        getBase64(file.originFileObj, resolve);
      });
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const otherUsers = users?.filter((userA) => userA?._id !== user?._id);

  return (
    <div className="min-h-screen w-full bg-orange-50 py-10 px-4 sm:px-6 lg:px-10">
      {contextHolder}
      <div className="mx-auto w-full max-w-3xl">
        <Card className="w-full shadow-xl/40 flex flex-col justify-center gap-4 p-6 sm:p-8 border! border-gray-300!">
          <div className="flex flex-col justify-center items-center p-8 sm:p-10">
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              action="http://localhost:5000/auth/uploads"
              headers={{ Authorization: `Bearer ${authService.getToken()}` }} // ✅ token
              beforeUpload={beforeUpload}
              onChange={handleChange}
              onPreview={handlePreview}
              fileList={fileList}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </div>

          <Modal
            open={previewOpen}
            title="Preview"
            footer={null}
            onCancel={() => setPreviewOpen(false)}
          >
            <img
              alt="preview"
              style={{ width: "60vw", borderRadius: "50%", height: "60vh" }}
              src={previewImage}
            />
          </Modal>

          <div className="flex flex-col justify-between items-center border border-gray-300 p-4 rounded-lg shadow-lg gap-2">
            <div className="flex flex-col text-center">
              <Typography.Title level={3}>
                {capitaliseUsername(user?.username)}
              </Typography.Title>
              <Typography.Text type="secondary">{user?.email}</Typography.Text>
            </div>

            <div className="mt-4">
              <Tag color={user?.role === "organizer" ? "purple" : "blue"}>
                {user?.role?.toUpperCase()}
              </Tag>
            </div>

            {user?.role === "organizer" && (
              <Button
                className="bg-purple-600! text-white! rounded-lg! hover:bg-purple-700! transition! cursor-pointer! mt-5"
                onClick={() => {
                  dispatch(getUsers());
                  setIsModalOpen(true);
                }}
              >
                Manage Users
              </Button>
            )}
          </div>
        </Card>

        <Modal
          title="User Management"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <div className="max-h-80 overflow-y-auto!">
            <div className="flex flex-col gap-4">
              {(otherUsers ?? []).map((u) => (
                <div
                  key={u._id}
                  className="flex flex-col justify-center items-start border border-gray-200 p-4 rounded-lg shadow-md gap-4 sm:flex-row sm:items-center"
                >
                  <div className="flex items-center justify-start gap-4 w-full!">
                    <div>
                      <Typography.Text strong>{u.username}</Typography.Text>
                      <Typography.Text type="secondary" className="ml-2">
                        {u.email}
                      </Typography.Text>
                    </div>
                    <Tag
                      className="ml-2"
                      color={u.role === "organizer" ? "purple" : "blue"}
                    >
                      {u.role.toUpperCase()}
                    </Tag>
                  </div>
                  {u.role !== "organizer" && (
                    <Popconfirm
                      title="Are you sure you want to promote this user to Organizer?"
                      onConfirm={() => handlePromote(u._id, "organizer")}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="primary"
                        className="bg-purple-600! text-white! rounded-lg! hover:bg-purple-700! transition! cursor-pointer!"
                        loading={loading}
                      >
                        Promote to Organizer
                      </Button>
                    </Popconfirm>
                  )}
                  {u.role === "organizer" && (
                    <Popconfirm
                      title="Are you sure you want to demote this user?"
                      onConfirm={() => handlePromote(u._id, "attendee")}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>Demote</Button>
                    </Popconfirm>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
