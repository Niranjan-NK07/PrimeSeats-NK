import type React from "react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../storeManager/hooks";
import { getMySeats } from "../storeManager/slices/seatSlice";
import MyEventCard from "../components/MyEventCard";
import { Empty } from "antd";

const MyTickets: React.FC = () => {
  const { mySeats } = useAppSelector((state) => state.seats);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMySeats());
  }, []);

  return (
    <>
      <div className="flex justify-center items-center w-full min-h-screen bg-orange-50">
        {mySeats?.length === 0 ? (
          <Empty />
        ) : (
          <div className="grid w-full grid-cols-1 gap-6 p-4 md:grid-cols-2 md:p-10">
            {mySeats?.map((seat, i) => (
              <MyEventCard
                seat={seat}
                eventId={seat?.eventId}
                key={`${seat?.number}-${i}`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
export default MyTickets;
