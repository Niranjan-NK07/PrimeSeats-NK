import { Card, Typography, Carousel, Tooltip } from "antd";
import type React from "react";
import { useAppSelector } from "../../../storeManager/hooks";
import "./dotStyle.css";
import { useNavigate } from "react-router-dom";

const CategorizedEvents: React.FC = () => {
  const { categories } = useAppSelector((state) => state.events);
  const navigate = useNavigate();

  const navigateToBookingPage = (category: any) => {
    navigate("/events", { state: { category: category.value } });
  };

  return (
    <div className="px-10 py-5">
      <Typography.Title level={4}>Browse by Category</Typography.Title>
      <Carousel
        slidesToShow={4}
        slidesToScroll={4}
        arrows
        infinite={false}
        autoplay
      >
        {categories.map((category) => (
          <div key={category.value} className="p-2">
            <Tooltip
              title={`Click to view events in ${category.label}`}
              placement="top"
            >
              <Card
                hoverable
                cover={
                  <img
                    draggable={false}
                    alt="event"
                    className="h-30 w-full object-cover"
                    src="/Event-PNG-Photo.png"
                  />
                }
                className="bg-gray-400!"
                variant="outlined"
                onClick={() => navigateToBookingPage(category)}
              >
                <Typography.Title level={4} className="text-center text-white!">
                  {category.label}
                </Typography.Title>
              </Card>
            </Tooltip>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CategorizedEvents;
