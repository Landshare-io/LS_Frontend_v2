import React from "react";
import { useGlobalContext } from "../../../context/GlobalContext";

export default function LoadingStatus() {
  const {
    screenLoadingStatus
  } = useGlobalContext();

  if (screenLoadingStatus == '') {
    return null;
  }
  return (
    <div  className="w-full h-screen fixed top-0 bg-[#ffffff7d] z-50 flex flex-col justify-center items-center">
      <div className="text-center whitespace-pre-line text-[48px] font-bold">
        {screenLoadingStatus ? screenLoadingStatus : "..."}
      </div>
    </div>
  );
}
