import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 text-white py-16 px-4 text-center sm:px-6 lg:px-10">
      <h1 className="text-3xl font-bold mb-4 sm:text-5xl">
        Discover & Book Amazing Events
      </h1>
      <p className="text-base opacity-90 mb-8 sm:text-lg">
        Concerts, conferences, festivals — all in one place.
      </p>
      <div className="flex flex-col gap-3 justify-center sm:flex-row">
        <button
          className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer w-full sm:w-auto"
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
