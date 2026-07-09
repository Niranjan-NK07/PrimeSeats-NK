import CategorizedEvents from "../components/HomeComp/CategorFiles/CategorizedEvents";
import Footer from "../components/HomeComp/Footer";
import Hero from "../components/HomeComp/Hero";
import SearchBox from "../components/HomeComp/SearchBox";
import UpcomingEvents from "../components/HomeComp/UpcomingEvents";

const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <div className="h-25 py-4 border-b border-gray-400 flex justify-center items-center bg-gray-100">
        <SearchBox />
      </div>
      <div className="border-b border-gray-400">
        <UpcomingEvents />
      </div>
      <div className="bg-gray-100">
        <CategorizedEvents />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
