import React, { useState } from "react";
// import { authService } from "../services/authService.ts";
import { useNavigate } from "react-router-dom";
import { Form, Input, message, Button } from "antd";
import type { FormInstance, FormProps } from "antd/es/form";
import { useAppDispatch } from "../../storeManager/hooks";
import { getUser, register } from "../../storeManager/slices/authSlice";
import { authService } from "../../services/authService";

type LoginFormProps = {
  registerForm: FormInstance;
  error: string | null;
  setError: (error: string | null) => void;
};

type FieldType = {
  username?: string;
  password?: string;
  email?: string;
};

const Register: React.FC<LoginFormProps> = ({
  registerForm,
  error,
  setError,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);

    try {
      await dispatch(
        register({
          username: values.username || "",
          email: values.email || "",
          password: values.password || "",
        }),
      ).unwrap();
      message.success(
        "Registration successful. Redirecting to the application !",
      );
      registerForm.resetFields();
      setTimeout(() => {
        const userId = authService.getUserID();
        if (userId) {
          dispatch(getUser(userId));
        }
        navigate("/home");
      }, 2000);
    } catch (err: any) {
      console.log(err);
      const errorMessage = err || "Registration failed. Please try again.";
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
      name="register"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 30 }}
      //   style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={registerForm}
      className="flex flex-col justify-center min-w-100 grow"
    >
      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[
          { required: true, message: "Please enter the username!" },
          { min: 3, message: "Username must be at least 3 characters!" },
        ]}
        className="w-full"
      >
        <Input />
      </Form.Item>
      <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please enter the email!" },
          { type: "email", message: "Please enter a valid email!" },
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
      {/* <Form.Item<FieldType>
        name="remember"
        valuePropName="checked"
        label={null}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item> */}
      {error && <span style={{ color: "red" }}>{error}</span>}
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

export default Register;
