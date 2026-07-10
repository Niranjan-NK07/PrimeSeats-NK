import type React from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Upload,
} from "antd";
import { useNavigate } from "react-router-dom";
import { eventService } from "../services/eventServices";
import { authService } from "../services/authService";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../storeManager/hooks";
import { getEvents } from "../storeManager/slices/eventSlice";
import { UploadOutlined } from "@ant-design/icons";

const CreateEvent: React.FC = () => {
  const { categories } = useAppSelector((state) => state.events);
  const [loadingOnCreate, setLoadingOnCreate] = useState<boolean>(false);
  const [createForm] = useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onCreateEvent: any = async (values: any) => {
    const {
      title,
      description,
      venue,
      dateTime,
      totalSeats,
      category,
      pricePerSeat,
    } = values;
    const actDate = new Date(dateTime);
    const organizerId = authService.getUserID();
    const imageFile =
      values.image && values.image[0] && values.image[0].originFileObj;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description || "");
    formData.append("venue", venue);
    formData.append("dateTime", actDate.toISOString());
    formData.append("organizerId", organizerId || "");
    formData.append("category", category);
    formData.append("status", "upcoming");
    formData.append("totalSeats", totalSeats.toString());
    formData.append("pricePerSeat", pricePerSeat);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setLoadingOnCreate(true);
      await eventService.createEvent(formData);

      message.success("Event created successfully!");
      navigate("/events");
      dispatch(getEvents());
      setLoadingOnCreate(false);
      createForm.resetFields();
    } catch (err: any) {
      setLoadingOnCreate(false);
      console.log(err.message);
      if (err.message.includes("Forbidden: Insufficient role")) {
        message.error(
          "You are not authorized to create an event. Please log in as an organizer.",
        );
      }
    }
  };

  useEffect(() => {
    if (categories?.length === 0) {
      dispatch(getEvents());
    }
  }, []);

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  return (
    <div className="max-w-lg mx-auto bg-linear-to-bl from-purple-500 via-white via-80% to-orange-500 shadow-xl/40 rounded-xl p-8 my-5">
      <h2 className="text-2xl font-bold mb-6 text-center">Create New Event</h2>
      <Form layout="vertical" form={createForm} onFinish={onCreateEvent}>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input placeholder="Event title" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Event description" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true }]}
        >
          <Select
            showSearch={{ optionFilterProp: "label", onSearch }}
            placeholder="Select a category"
            onChange={onChange}
            options={categories}
          />
        </Form.Item>
        <Form.Item label="Venue" name="venue" rules={[{ required: true }]}>
          <Input placeholder="Event venue" />
        </Form.Item>
        <Form.Item
          label="Date & Time"
          name="dateTime"
          rules={[{ required: true }]}
        >
          <DatePicker showTime className="w-full" />
        </Form.Item>
        <Form.Item
          label="Total Seats"
          name="totalSeats"
          rules={[{ required: true }]}
        >
          <InputNumber
            className="w-full"
            min={1}
            max={30}
            placeholder="Min 1"
          />
        </Form.Item>
        <Form.Item
          label="Price Per Seat"
          name="pricePerSeat"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={1000} placeholder="in INR" />
        </Form.Item>
        <Form.Item
          label="Event Image"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload
            name="image"
            listType="picture-card"
            beforeUpload={() => false}
            className="ml-6!"
            maxCount={1}
            progress={{
              strokeColor: {
                "0%": "#108ee9",
                "100%": "#87d068",
              },
              strokeWidth: 3,
              format: (percent) =>
                percent && `${Number.parseFloat(percent.toFixed(2))}%`,
            }}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Button
          htmlType="submit"
          block
          className="bg-purple-600! text-white! rounded-lg! hover:bg-purple-700! transition! cursor-pointer! w-full"
          loading={loadingOnCreate}
        >
          Create Event
        </Button>
      </Form>
    </div>
  );
};

export default CreateEvent;
