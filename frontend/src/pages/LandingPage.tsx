import { Form, Tabs, type TabsProps } from "antd";
import Register from "../components/Auth/Register";
import Login from "../components/Auth/Login";
import { useState } from "react";

const LandingPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [registerForm] = Form.useForm();
  const [loginForm] = Form.useForm();

  const items: TabsProps["items"] = [
    {
      key: "register",
      label: "Register",
      children: (
        <Register
          registerForm={registerForm}
          error={error}
          setError={setError}
        />
      ),
    },
    {
      key: "login",
      label: "Login",
      children: (
        <Login loginForm={loginForm} error={error} setError={setError} />
      ),
    },
  ];
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-200 to-blue-50 p-4 text-white sm:p-6 lg:p-10">
      <div className="flex w-full max-w-6xl flex-col overflow-hidden rounded-4xl bg-white shadow-xl/30 lg:flex-row min-w-0">
        <div
          className="flex w-full flex-col items-center justify-center rounded-b-4xl bg-linear-to-br from-purple-600 to-pink-500 px-6 py-10 text-center text-white lg:w-1/2 lg:rounded-none lg:rounded-l-4xl lg:px-10"
          style={{ border: "1px solid black" }}
        >
          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
            Prime Seats 🎟️
          </h1>
          <p className="text-base opacity-90 sm:text-lg">
            Your Gateway to Great Events
          </p>
        </div>
        <div className="flex w-full items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:w-1/2 lg:px-8 lg:py-10 min-w-0">
          <div className="w-full max-w-md rounded-4xl border border-[#929292] bg-white p-4 shadow-xl/20 sm:p-6 md:p-8 min-w-0">
            <Tabs
              items={items}
              centered
              onChange={() => {
                loginForm.resetFields();
                registerForm.resetFields();
                setError(null);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
