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
    <div className="flex min-h-screen bg-linear-to-br from-blue-200 to-blue-50 text-white p-15">
      <div className="flex w-screen shadow-xl/30 rounded-4xl bg-white">
        <div
          className="md:flex w-1/2 bg-linear-to-br from-purple-600 to-pink-500 text-white flex-col justify-center items-center rounded-4xl"
          style={{ border: "1px solid black" }}
        >
          <h1 className="text-4xl font-bold mb-4">Prime Seats 🎟️</h1>
          <p className="text-lg opacity-90">Your Gateway to Great Events</p>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <div
            className="bg-white rounded-4xl p-8 w-120 shadow-xl/20"
            style={{ border: "1px solid #929292" }}
          >
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
