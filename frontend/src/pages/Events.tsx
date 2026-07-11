import EventCard from "../components/EventCard";
import { Card, Skeleton } from "antd";
import { useLocation } from "react-router-dom";
import SearchBox from "../components/HomeComp/SearchBox";
import { useAppDispatch, useAppSelector } from "../storeManager/hooks";
import { useEffect, useState } from "react";
import { getEvents } from "../storeManager/slices/eventSlice";

const Events: React.FC = () => {
  const { events, loading } = useAppSelector((state) => state.events);
  const location = useLocation();
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const { eventId, category } =
    (location.state as { eventId?: string; category?: string }) || {};

  useEffect(() => {
    if (events?.length === 0) {
      dispatch(getEvents());
    }
  }, []);

  const filteredEvents = eventId
    ? events.filter((event) => event._id === eventId)
    : category
      ? events.filter((event) => event.category === category)
      : events;

  return (
    <div className="bg-gray-200 flex flex-col items-center py-6 px-4 sm:px-6">
      <Card
        style={{ width: "100%", margin: "2rem 0", maxWidth: 1200 }}
        className="bg-gray-50! shadow-xl/40"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Events</h2>
        {!eventId && !category && (
          <div className="flex justify-center items-center mb-6 mx-auto w-full max-w-3xl px-4 sm:px-0">
            <SearchBox />
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-6 mt-4">
          {loading ? (
            <Skeleton active />
          ) : (
            filteredEvents?.map((event: any) => (
              <EventCard
                key={event._id}
                eventId={event._id}
                title={event.title}
                description={event.description}
                date={new Date(event.dateTime).toLocaleString()}
                location={event.venue}
                image={
                  event.eventImage
                    ? `${import.meta.env.VITE_API_BASE_URL}${event.eventImage}`
                    : "/Event-PNG-Photo.png"
                }
                openBookNowModal={activeEventId === event._id}
                setOpenBookModal={(open: boolean) =>
                  setActiveEventId(open ? event._id : null)
                }
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Events;
