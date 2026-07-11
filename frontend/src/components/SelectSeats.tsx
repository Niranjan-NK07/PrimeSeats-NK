import type React from "react";
import { seatService } from "../services/seatService";
import { useEffect, useState } from "react";

interface SeatProps {
  eventId: string;
  seats: any[];
  setSelectedSeats: any;
  selectedSeats: any[];
}

const SelectSeats: React.FC<SeatProps> = ({
  eventId,
  seats,
  selectedSeats,
  setSelectedSeats,
}) => {
  const [localSeats, setLocalSeats] = useState<any[]>(seats);

  const toggleSeat = async (seatId: string) => {
    try {
      const updatedSeat = await seatService.lockASeat(seatId, eventId);
      setLocalSeats((prev) =>
        prev?.map((seat) => (seat._id === seatId ? updatedSeat : seat)),
      );
      setSelectedSeats([...selectedSeats, updatedSeat]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLocalSeats(seats);
  }, [seats]);

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-10">
      {localSeats
        .slice() // make a shallow copy
        .sort((a, b) => Number(a.number) - Number(b.number))
        .map((seat) => (
          <button
            key={seat._id}
            disabled={seat.status !== "available"}
            onClick={() => toggleSeat(seat._id)}
            className={`w-10 h-10 rounded cursor-pointer ${
              seat.status === "available"
                ? "bg-green-500 hover:bg-green-400 transition-all"
                : seat.status === "locked"
                  ? "bg-yellow-500 hover:bg-yellow-400 transition-all"
                  : "bg-red-500 hover:bg-red-400 transition-all"
            }`}
          >
            {seat.number}
          </button>
        ))}
    </div>
  );
};

export default SelectSeats;
