import { useState } from "react";
// import { authService } from "../services/authService.ts";
import { useNavigate } from "react-router-dom";
import { Form, Input, message, Button } from "antd";
import type { FormInstance, FormProps } from "antd/es/form";
import { getUser, login } from "../../storeManager/slices/authSlice";
import { useAppDispatch } from "../../storeManager/hooks";
import { authService } from "../../services/authService";

type LoginFormProps = {
  loginForm: FormInstance;
  error: string | null;
  setError: (error: string | null) => void;
};

type FieldType = {
  username?: string;
  password?: string;
};

const Login: React.FC<LoginFormProps> = ({ loginForm, error, setError }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);

    try {
      await dispatch(
        login({
          username: values.username || "",
          password: values.password || "",
        }),
      ).unwrap();
      message.success("Login successful. Redirecting to the application !");
      loginForm.resetFields();
      setTimeout(() => {
        const userId = authService.getUserID();
        if (userId) {
          dispatch(getUser(userId));
        }
        navigate("/home");
      }, 2000);
    } catch (err: any) {
      const errorMessage = err || "Login failed. Please try again.";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      name="login"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      // style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      // autoComplete="off"
      form={loginForm}
      className="flex flex-col justify-center min-w-100 grow"
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[
          { required: true, message: "Please enter the username!" },
          { min: 3, message: "Username must be at least 3 characters!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[
          { required: true, message: "Please enter the password!" },
          { min: 6, message: "Password must be at least 6 characters!" },
        ]}
      >
        <Input.Password />
      </Form.Item>
      {error && <span style={{ color: "red" }}>Something went wrong!</span>}
      <Form.Item label={null}>
        <Button
          className="bg-purple-600! text-white! rounded-lg! hover:bg-purple-700! transition! cursor-pointer! mt-5"
          htmlType="submit"
          loading={loading}
          block
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
