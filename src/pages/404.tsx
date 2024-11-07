import type { NextPage } from 'next';
import { BOLD_INTER_TIGHT } from "../config/constants/environments";
import Logo from "../components/common/logo";
import YouOwn from '../components/common/you-own';

const Custom404: NextPage = () => {
  return (
    <div
      className="flex flex-col bg-primary items-center h-[calc(100vh-132px)] xl:h-[calc(100vh-144px)] justify-center"
    >
      <Logo />
      <h2 className={`text-[93px] text-text-primary ${BOLD_INTER_TIGHT.className}`}>404</h2>
      <p className="text-[22px] text-text-primary">page not found</p>
    </div>
  );
}

export default Custom404
