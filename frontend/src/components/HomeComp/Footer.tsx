import { Typography } from "antd";
import { HashLink } from "react-router-hash-link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-linear-to-br from-purple-700 to-95% to-orange-300 text-white py-6 mt-10">
      <div className="container mx-auto text-center">
        <div className="flex flex-col items-center rounded-2xl bg-linear-to-tl from-orange-50 to-orange-300 p-6 mx-40">
          <Typography.Title level={4} className="text-black! font-bold">
            Why Choose PrimeSeats?
          </Typography.Title>
          <div className="mt-2 text-black opacity-90">
            PrimeSeats offers a seamless event booking experience with a wide
            range of events, secure payments, and instant confirmations. Join us
            to discover and book amazing events effortlessly.
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-6">
          <HashLink
            smooth
            to="/about-us#about"
            className="text-white hover:text-purple-200 transition"
          >
            About Us
          </HashLink>
          <HashLink
            smooth
            to="/about-us#contact"
            className="text-white hover:text-purple-200 transition"
          >
            Contact
          </HashLink>
          <HashLink
            smooth
            to="/about-us#privacy"
            className="text-white hover:text-purple-200 transition"
          >
            Privacy Policy
          </HashLink>
        </div>
      </div>
      <div className="mt-6 text-center text-sm opacity-80">
        &copy; {new Date().getFullYear()} PrimeSeats. All rights reserved.
      </div>
    </footer>
  );
};
export default Footer;
