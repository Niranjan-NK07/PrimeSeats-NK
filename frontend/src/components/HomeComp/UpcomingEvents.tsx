import { Button, Card, Modal, Skeleton, Typography } from "antd";
import type React from "react";
import { useAppDispatch, useAppSelector } from "../../storeManager/hooks";
import { useEffect, useState } from "react";
import { getEvents } from "../../storeManager/slices/eventSlice";
import { Link } from "react-router-dom";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const UpcomingEvents: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, error, searchLoading } = useAppSelector(
    (state) => state.events,
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  useEffect(() => {
    dispatch(getEvents());
  }, []);

  const navigate = useNavigate();

  const navigateToBookingPage = () => {
    setIsModalOpen(false);
    navigate("/events", { state: { eventId: selectedEvent?._id } });
  };

  if (error) {
    return (
      <Typography.Text type="danger">Something wnt wrong !</Typography.Text>
    );
  }

  return (
    <div className="px-4 py-5 sm:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <Typography.Title level={4}>Upcoming Events</Typography.Title>
        <Button type="link">
          <Link to={"/events"}>See All</Link>
        </Button>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {searchLoading ? (
          <Skeleton active />
        ) : (
          events?.slice(0, 4)?.map((event, i) => {
            return (
              <Card
                hoverable
                className="w-full sm:w-[48%] lg:w-[23%]"
                cover={
                  <img
                    draggable={false}
                    alt="event"
                    className="h-30 w-full object-cover"
                    src={
                      event.eventImage
                        ? `${import.meta.env.VITE_API_BASE_URL}${event.eventImage}`
                        : "/Event-PNG-Photo.png"
                    }
                  />
                }
                key={i}
                variant="outlined"
                // className="shadow-lg cursor-pointer transition-transform duration-200 ease-in-out hover:scale-104"
                onClick={() => {
                  setSelectedEvent(event);
                  setIsModalOpen(true);
                }}
              >
                <Typography.Title level={4}>{event.title}</Typography.Title>
                <Card.Meta
                  title={
                    <Typography.Text type="secondary">
                      {event?.venue}
                    </Typography.Text>
                  }
                  description={
                    <Typography.Paragraph
                      ellipsis={{ rows: 2, tooltip: event?.description }}
                      italic
                    >
                      {event?.description}
                    </Typography.Paragraph>
                  }
                />
              </Card>
            );
          })
        )}
      </div>
      <Modal
        title={selectedEvent?.title}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <button
            key="confirm"
            onClick={navigateToBookingPage}
            className="mt-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer px-6 py-2"
          >
            Navigate to booking page
          </button>,
        ]}
      >
        <Typography.Text type="secondary" className="mb-4 block">
          Venue: {selectedEvent?.venue}
        </Typography.Text>
        <Typography.Paragraph>
          {selectedEvent?.description}
        </Typography.Paragraph>
        <Typography.Text type="secondary" className="mt-4 block" mark>
          Date: {moment(selectedEvent?.dateTime).format("MMM-DD-YYYY hh:mm A")}
        </Typography.Text>
      </Modal>
    </div>
  );
};

export default UpcomingEvents;
