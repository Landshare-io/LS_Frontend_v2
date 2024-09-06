import { Inter_Tight } from 'next/font/google';
import Logo from "../components/common/logo";

const boldInterTight = Inter_Tight({
  weight: "700",
  style: "normal",
  preload: false,
});

export default function Custom404() {
  return (
    <div
      className="flex flex-col bg-primary items-center h-[calc(100vh-132px)] xl:h-[calc(100vh-144px)] justify-center"
    >
      <Logo />
      <h2 className={`text-[93px] text-text-primary ${boldInterTight.className}`}>404</h2>
      <p className="text-[22px] text-text-primary">page not found</p>
    </div>
  );
}
