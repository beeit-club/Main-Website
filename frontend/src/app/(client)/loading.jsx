"use client";

import Image from "next/image";
import LoadingIMG from "../../../public/logo.gif";

export default function Loading() {
  return (
    <div
      id="loading-area"
      className="fixed top-0 right-0 left-0 bottom-0 bg-white  z-40"
    >
      <div className="w-full h-full flex justify-center items-center">
        <span className="loader-2"></span>
        <Image src={LoadingIMG} alt="/" />
        <span className="loader"></span>
      </div>
    </div>
  );
}
