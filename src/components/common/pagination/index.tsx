import Image from "next/image"
import leftArrowWhite from "../../../../public/icons/left-arrow-white.svg"
import leftArrowGrey from "../../../../public/icons/left-arrow-grey.svg"
import RightArrowWhite from "../../../../public/icons/right-arrow-white.svg"
import RightArrowGrey from "../../../../public/icons/right-arrow-grey.svg"

interface PaginationProps  {
    pageCount : number;
    currentPage : number;
    setCurrentPage : (currentPage : number) => void;
}

const Pagination = ({pageCount, currentPage, setCurrentPage} : PaginationProps) => {

    const NextPage = () => {
        if(currentPage < pageCount){
            setCurrentPage(currentPage + 1);
        }
    }

    const PreviousPage = () => {
        if(currentPage > 1){
            setCurrentPage(currentPage - 1);
        }
    }

    return (
        <div className="flex w-[150px] justify-start items-center">
            <div 
                onClick={() =>  PreviousPage()}
                className={`w-8 h-8 flex justify-center items-center rounded-tl-[7px] rounded-bl-[6px] cursor-pointer border-[#D8D8D8] bg-[#66CE85] {${currentPage > 1}}`}>
                {currentPage > 1 ? 
                <Image src = {leftArrowWhite} className="w-auto" alt = "left Arrow"/> : <Image src = {leftArrowGrey} className="w-auto" alt = "left Arrow"/>}
            </div>

            <div className="grow text-center"><span className="text-black">{currentPage}</span>&nbsp;/&nbsp;<span className="text-[#535457]">{pageCount}</span></div>

            <div 
                onClick={() =>  NextPage()}
                className={`w-8 h-8 flex justify-center items-center rounded-tr-[7px] rounded-br-[6px] cursor-pointer border-[#D8D8D8] bg-[#66CE85] {${currentPage < pageCount}`}>
                {currentPage <pageCount ? 
                <Image src = {RightArrowWhite} className="w-auto" alt = "left Arrow"/> : <Image src = {RightArrowGrey} className="w-auto" alt = "left Arrow"/>}
            </div>
        </div>
    );
};

export default Pagination;