import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 text-white py-20 px-6 text-center">
      <h1 className="text-5xl font-bold mb-4">
        Discover & Book Amazing Events
      </h1>
      <p className="text-lg opacity-90 mb-8">
        Concerts, conferences, festivals — all in one place.
      </p>
      <div className="flex justify-center gap-4">
        <button
          className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate("/events")}
        >
          Explore Events
        </button>
        <button
          className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition cursor-pointer"
          onClick={() => navigate("/create")}
        >
          Create Event
        </button>
      </div>
    </section>
  );
};

export default Hero;
