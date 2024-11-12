import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
interface PaginationProps {
  pageCount: number;
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
}

const Pagination = ({
  pageCount,
  currentPage,
  setCurrentPage,
}: PaginationProps) => {
  const NextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const PreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex justify-end items-center cursor-pointer">
      <div className="flex w-[150px] justify-start items-center bg-third border-[#D8D8D8] rounded-[7px]">
        <button
          onClick={() => PreviousPage()}
          className={`group w-8 h-8 flex justify-center items-center border border-[#D8D8D8] rounded-tl-[7px] rounded-bl-[6px] bg-third hover:bg-[#66CE85] {${
            currentPage > 1
          }}`}
        >
          <SlArrowLeft className=" w-3 h-3 text-text-primary group-hover:text-white" />
        </button>

        <div className="grow flex justify-center items-center h-8 text-center text-text-primary border-x-0 border-y border-[#D8D8D8]">
          <span className="text-[14px]">{currentPage}</span>&nbsp;/&nbsp;
          <span className="text-[14px] text-text-secondary">{pageCount}</span>
        </div>

        <button
          onClick={() => NextPage()}
          className={`group w-8 h-8 flex justify-center items-center border border-[#D8D8D8] rounded-tr-[7px] rounded-br-[6px] bg-third hover:bg-[#66CE85] {${
            currentPage < pageCount
          }`}
        >
          <SlArrowRight className="w-3 h-3  text-text-primary group-hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
