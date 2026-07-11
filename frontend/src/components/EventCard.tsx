import { message, Modal, Typography } from "antd";
import SelectSeats from "./SelectSeats";
// import { seatService } from "../services/seatService";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../storeManager/hooks";
import { getSeats } from "../storeManager/slices/seatSlice";
import { paymentService } from "../services/paymentService";

interface EventProps {
  eventId: string;
  title: string;
  date: string;
  description: string;
  location: string;
  image: string;
  openBookNowModal: boolean;
  setOpenBookModal: any;
}
const EventCard: React.FC<EventProps> = ({
  eventId,
  title,
  date,
  description,
  location,
  image,
  openBookNowModal,
  setOpenBookModal,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const {
    loading,
    seats: seatsFromStore,
    error,
  } = useAppSelector((state: any) => state.seats);

  const dispatch = useAppDispatch();

  const onhandleClick: any = async () => {
    try {
      setOpenBookModal(true);
      setTimeout(() => {
        dispatch(getSeats(eventId));
      }, 0);
    } catch (err) {
      console.log(err);
    }
  };

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) return;
    await paymentService.handlePayment(
      selectedSeats.map((s) => s._id),
      eventId,
    );
    setSelectedSeats([]);
    dispatch(getSeats(eventId));
    setOpenBookModal(false);
    message.success("Seat booked!");
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow hover:shadow-xl/40 transition overflow-hidden w-full max-w-sm flex flex-col">
        <img src={image} alt={title} className="h-40 w-full object-cover" />
        <div className="p-4 flex flex-col grow">
          <div className="grow">
            <Typography.Title level={4}>{title}</Typography.Title>
            <Typography.Text type="secondary">
              {date} • {location}
            </Typography.Text>
            <Typography.Paragraph
              ellipsis={{ rows: 3, expandable: "collapsible" }}
              italic
            >
              {description}
            </Typography.Paragraph>
          </div>
          <button
            className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition cursor-pointer w-full"
            onClick={onhandleClick}
          >
            Book Now
          </button>
        </div>
      </div>
      <Modal
        title="Select your seats!"
        open={openBookNowModal}
        onCancel={() => {
          setSelectedSeats([]);
          setOpenBookModal(false);
        }}
        loading={loading}
        mask={{ blur: true }}
        footer={[
          selectedSeats?.length > 0 && (
            <Typography.Text key="seat">
              Booked Seats:{" "}
              {selectedSeats?.map((seat) => (
                <Typography.Text key={seat?._id} className="mr-4">
                  {seat?.number},
                </Typography.Text>
              ))}
            </Typography.Text>
          ),
          seatsFromStore?.length !== 0 && (
            <button
              key="confirm"
              onClick={confirmBooking}
              className="mt-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer px-6 py-2"
            >
              Proceed to payment
            </button>
          ),
        ]}
        width="90vw"
        style={{ maxWidth: 800 }}
      >
        <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "20px" }}>
          {seatsFromStore?.length === 0 ? (
            <Typography.Text type="warning">
              No seats available !
            </Typography.Text>
          ) : error ? (
            <Typography.Text type="danger">
              Something went wrong !
            </Typography.Text>
          ) : (
            <SelectSeats
              eventId={eventId}
              seats={seatsFromStore}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default EventCard;
