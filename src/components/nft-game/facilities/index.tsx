import React from "react";
import Slider from "react-slick";
import useGetUserData from "../../../hooks/nft-game/axios/useGetUserData";
import Facility from "./facility";
// import "react-multi-carousel/lib/styles.css";

export default function ProductionFacilities() {
  const {
    facilities
  } = useGetUserData();

  const settings = {
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 770,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {(facilities.length > 0) && (
        <div className="block md:hidden">
          <Slider {...settings}>
            {facilities.sort((a, b) => a.sortingId - b.sortingId).map((facility, type) => (
              <div key={`facility-levels-${type}`} className="flex justify-center">
                <Facility
                  type={type}
                  isBoosts={false}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
      <div className="mb-5 hidden pb-[20px] md:grid md:grid-cols-[minmax(300px,max-content),minmax(300px,max-content)] justify-between gap-[50px] lg:md:grid-cols-[minmax(300px,max-content),minmax(300px,max-content),minmax(300px,max-content)]">
        {(facilities.length > 0) && facilities.sort((a, b) => a.sortingId - b.sortingId).map((facility, type) => (
          <div key={`facility-levels-${type}`}>
            <Facility
              type={type}
              isBoosts={false}
            />
          </div>
        ))}
      </div>
    </>
  );
};
