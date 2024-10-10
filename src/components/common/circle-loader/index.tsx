import React from "react";

export default function CircleLoader() {
  return (
    <>
      <div className="relative rounded-[50%] w-[70px] h-[70px] my-0 mx-auto overflow-hidden animate-spin">
        <div className="w-full h-[50%] absolute mt-[50%] bg-gradient-to-b from-[#dcdcdc] to-[#969696] before:content-[''] before:absolute before:w-[100%] before:h-[100%] before:bg-gradient-to-b from-[#dcdcdc] to-[#969696] after:content-[''] after:w-[80%] after:h-[160%] after:absolute after:bg-gradient-to-b from-[#dcdcdc] to-[#969696] after:mt-[-40%] after:ml-[10%]"></div>
      </div>
    </>
  );
};
