import { Card, Skeleton, Tag, Typography } from "antd";
import type React from "react";
import { useEffect, useState } from "react";
import { eventService } from "../services/eventServices";
import moment from "moment";

interface MyEventCardProps {
  seat: any;
  eventId: string;
}
export interface Event {
  _id?: string;
  title: string;
  description: string;
  venue: string;
  dateTime: Date;
  organizerId: string;
  category: string;
  status: "upcoming" | "cancelled" | "completed";
  totalSeats: number;
}

const MyEventCard: React.FC<MyEventCardProps> = ({ seat, eventId }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const capitaliseUsername = (name: string | undefined) => {
    return `${name?.slice(0, 1)?.toUpperCase()}${name?.slice(1)}`;
  };

  useEffect(() => {
    setLoading(true);
    eventService
      .getEvent(eventId)
      .then(setEvent)
      .catch(() => setEvent(null));
    setLoading(false);
  }, [eventId]);

  return (
    <>
      {loading ? (
        <Skeleton />
      ) : (
        <Card
          title={event?.title}
          extra={<Tag color="green">{capitaliseUsername(seat.status)}</Tag>}
          className="bg-linear-to-br! from-orange-400! via-white! via-80%! to-purple-500! shadow-xl/40 w-90"
          loading={loading}
        >
          <div className="flex justify-between">
            <div>
              <Typography.Title level={1}>{seat.number}</Typography.Title>
            </div>
            <div className="flex flex-col">
              <Typography.Title level={5}>{event?.venue}</Typography.Title>
              <Typography.Text>
                {capitaliseUsername(event?.status)}
              </Typography.Text>
              <Typography.Text type="secondary" className="mt-2">
                {moment(event?.dateTime).format("MMM-DD-YYYY hh:mm A")}
              </Typography.Text>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default MyEventCard;
