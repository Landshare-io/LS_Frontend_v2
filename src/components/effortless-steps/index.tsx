import Image, { StaticImageData } from "next/image";
import { BsArrowRight } from "react-icons/bs";

interface StepCardProps {
  step: string;
  title: string;
  image: StaticImageData;
  buttonLabel: string;
  buttonAction?: () => void;
  buttonHref?: string;
  isDisabled?: boolean;
  showArrow?: boolean;
  arrowZIndex?: string; // to allow custom z-index (step 3 uses z-[100])
}

const StepCard = ({
  step,
  title,
  image,
  buttonLabel,
  buttonAction,
  buttonHref,
  isDisabled = false,
  showArrow = false,
  arrowZIndex = "z-50",
}: StepCardProps) => {
  return (
    <div className=" grid grid-cols-2 grid-rows-2 lg:flex lg:flex-col lg:h-[360px] lg:justify-between gap-4 bg-secondary rounded-3xl p-6 w-full max-w-3xl lg:max-w-sm  relative">
      {/* Text Section */}
      <div className="col-start-1 row-start-1 lg:col-start-1 lg:row-auto flex flex-col items-start text-left">
        <p className="text-text-secondary text-sm">{step}</p>
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">
          {title}
        </h2>
      </div>

      {/* Image */}
      {title == "Hold & Earn" ? (
        /* Image absolutely positioned at bottom */
        <>
          <div className="hidden absolute z-0 bottom-0 end-0 w-full lg:flex justify-center pointer-events-none">
            <Image
              src={image}
              alt={title}
              className=" object-contain absolute z-0 bottom-0 end-0 w-32 h-32 md:w-36 md:h-36 lg:w-full lg:h-auto  hidden lg:block"
            />
          </div>
          <div className="col-start-2 row-start-1 row-span-2 lg:col-start-1 lg:row-span-1 justify-self-center self-center">
            <Image
              src={image}
              alt={title}
              className="absolute right-0 top-1/2 -translate-y-1/2 size-[160px] block lg:hidden"
            />
          </div>
        </>
      ) : (
        <>
          <div className="col-start-2 row-start-1 row-span-2 lg:col-start-1 lg:row-span-1 justify-self-center self-center">
            {title == "Withdraw Principal" ? (
              <>
                <Image
                  src={image}
                  alt={title}
                  className="absolute right-0 top-1/2 -translate-y-1/2 size-[160px] block lg:hidden"
                />
                <Image
                  src={image}
                  alt={title}
                  className="w-32 h-32 md:w-36 md:h-36 lg:size-40 object-contain hidden lg:block"
                />
              </>
            ) : (
              <>
                <Image
                  src={image}
                  alt={title}
                  className="w-32 h-32 md:w-36 md:h-36 lg:size-40 object-contain hidden lg:block"
                />
                <Image
                  src={image}
                  alt={title}
                  className="w-32 h-32 md:w-36 md:h-36 lg:size-40  object-contain block lg:hidden"
                />
              </>
            )}
          </div>
        </>
      )}

      {/* Button */}
      <div className="col-start-1 row-start-2 lg:col-start-1 text-[12px] lg:row-auto place-self-start">
        {buttonHref ? (
          <a
            href={buttonHref}
            className="z-[100] relative"
            target="_blank"
            rel="noreferrer"
          >
            <button
              className={`bg-primary-green text-white font-medium px-6 py-2 rounded-full  hover:-translate-y-1 transition ${
                isDisabled
                  ? "cursor-not-allowed bg-gray-300 text-text-secondary"
                  : ""
              }`}
              disabled={isDisabled}
            >
              {buttonLabel}
            </button>
          </a>
        ) : (
          <button
            onClick={buttonAction}
            disabled={isDisabled}
            className={` bg-primary-green text-white font-medium px-6 py-2 rounded-full hover:-translate-y-1 transition ${
              isDisabled
                ? "cursor-not-allowed bg-gray-300 text-text-secondary hover:-translate-y-0"
                : ""
            }`}
          >
            {buttonLabel}
          </button>
        )}
      </div>

      {/* Arrow */}
      {showArrow && (
        <div
          className={`absolute right-[45%] -bottom-[34px] rotate-90 lg:rotate-0 lg:-right-[34px] lg:top-[45%] ${arrowZIndex} text-primary rounded-2xl size-[54px] flex justify-center items-center bg-primary`}
        >
          <div className="bg-[#D9D9D9] size-[30px] flex justify-center items-center rounded-lg">
            <BsArrowRight />
          </div>
        </div>
      )}
    </div>
  );
};

export default StepCard;
