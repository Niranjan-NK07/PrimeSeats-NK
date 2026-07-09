import { Button, Modal, Typography, type PopconfirmProps } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useState } from "react";

const Navbar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path ? "text-purple-600" : "text-white";
  };

  const confirm: PopconfirmProps["onConfirm"] = () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setIsModalOpen(false);
        authService.logout();
        navigate("/");
      }, 1000);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 bg-[#21002F] backdrop-blur-sm text-white z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/home" className="text-2xl font-bold">
            Prime Seats 🎟️
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/home"
              className={`hover:text-purple-600 transition-all ${isActive("/home")}`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`hover:text-purple-600 transition-all ${isActive("/events")}`}
            >
              Events
            </Link>
            <Link
              to="/my-tickets"
              className={`hover:text-purple-600 transition-all ${isActive("/my-tickets")}`}
            >
              My Tickets
            </Link>
            <Link
              to="/about-us"
              className={`hover:text-purple-600 transition-all ${isActive("/about-us")}`}
            >
              About Us
            </Link>
            <Link
              to="/profile"
              className={`hover:text-purple-600 transition-all ${isActive("/profile")}`}
            >
              Profile
            </Link>
            <Button
              className="bg-white rounded-sm! hover:text-purple-600! transition! cursor-pointer!"
              onClick={() => setIsModalOpen(true)}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <Modal
        title="Alert!"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button onClick={() => setIsModalOpen(false)} key="no">
            No
          </Button>,
          <Button
            key="yes"
            className="bg-purple-600! text-white! rounded-lg! hover:bg-purple-700! transition! cursor-pointer!"
            onClick={confirm}
            loading={loading}
          >
            Yes
          </Button>,
        ]}
      >
        <Typography.Text>Are you sure you want to logout?</Typography.Text>
      </Modal>
    </>
  );
};

export default Navbar;
