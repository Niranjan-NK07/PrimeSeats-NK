import { message } from "antd";
import { authService } from "./authService";

const getAuthHeaders = () => {
  const token = authService.getToken();
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

export const paymentService = {
  handlePayment: async (seatIds: string[], eventId: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const authHeaders = getAuthHeaders();
    if (authHeaders.Authorization) {
      headers.Authorization = authHeaders.Authorization;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/payment/create-order`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ eventId, seatIds }),
      },
    );

    const result = await response.json();
    const order = result?.order ?? result;

    if (!response.ok || !order?.id) {
      message.error(
        result?.error ||
          result?.message ||
          "Could not initialize payment order.",
      );
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Prime Seats",
      description: "Event Ticket Booking",
      order_id: order.id,
      handler: async function (response: any) {
        const verifyRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/payment/verifyPayment`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              seatIds,
              eventId,
            }),
          },
        );

        const verifyResult = await verifyRes.json();

        if (verifyRes.ok) {
          message.success("Payment successful! Seats booked.");
        } else {
          message.error("Payment verification failed: " + verifyResult.error);
        }
      },
      prefill: { email: "test@example.com", contact: "9999999999" },
      theme: { color: "#6b46c1" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  },
};
