import React from "react";
import ReactLoading from 'react-loading';

export default function FullPageLoading() {
  return (
    <>
      <div className="bg-[#f5fff7] flex justify-center items-center h-[100vh] fixed top-0 left-0 overflow-hidden z-[20]">
        <ReactLoading type="bars" color="#61cd81" />
      </div>
    </>
  );
}
