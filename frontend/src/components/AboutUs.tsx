const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen px-10 py-10 bg-gray-200 flex flex-col gap-16">
      {/* About Us */}
      <section id="about" className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <p className="text-lg mb-4">
          Welcome to PrimeSeats, your ultimate destination for discovering and
          booking amazing events. We are passionate about connecting people with
          unforgettable experiences, whether it's a concert, conference,
          festival, or any other event that sparks joy and excitement.
        </p>
        <p className="text-lg mb-4">
          At PrimeSeats, we believe that attending events should be seamless and
          hassle-free. Our platform offers a wide range of events, secure
          payment options, and instant confirmations, ensuring that you can
          focus on enjoying the experience rather than worrying about logistics.
        </p>
        <p className="text-lg mb-4">
          Our mission is to create a vibrant community of event-goers and
          organizers, fostering connections and shared experiences. We are
          committed to providing exceptional customer service and continuously
          improving our platform to meet the evolving needs of our users.
        </p>
        <p className="text-lg">
          Thank you for choosing PrimeSeats. We look forward to helping you
          discover and book amazing events that create lasting memories.
        </p>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="max-w-4xl mx-auto text-center bg-white shadow-md rounded-lg p-8"
      >
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="text-lg mb-4">
          We'd love to hear from you! Whether you have questions, feedback, or
          need support, our team is here to help.
        </p>
        <p className="text-lg mb-2">
          📧 Email: <span className="font-medium">support@primeseats.com</span>
        </p>
        <p className="text-lg mb-2">
          📞 Phone: <span className="font-medium">+91 98765 43210</span>
        </p>
        <p className="text-lg">🏢 Address: PrimeSeats HQ, Bengaluru, India</p>
      </section>

      {/* Privacy Policy */}
      <section
        id="privacy"
        className="max-w-4xl mx-auto text-center bg-white shadow-md rounded-lg p-8"
      >
        <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
        <p className="text-lg mb-4">
          Your privacy is important to us. At PrimeSeats, we are committed to
          protecting your personal information and ensuring a safe and secure
          booking experience.
        </p>
        <p className="text-lg mb-4">
          We only collect information necessary to provide our services, such as
          your name, email, and payment details. This data is stored securely
          and never shared with third parties without your consent.
        </p>
        <p className="text-lg mb-4">
          Our platform uses industry-standard encryption to safeguard your
          transactions. You can trust that your information is handled with the
          highest level of care.
        </p>
        <p className="text-lg">
          By using PrimeSeats, you agree to our privacy practices. For detailed
          information, please review our full Privacy Policy or contact our
          support team.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
