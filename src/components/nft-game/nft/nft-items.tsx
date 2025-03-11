import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import Image from "next/image";
import { NextLabelIcon, PrevLabelIcon, QuestionIcon } from "../../common/icons/index";
import NftItem from "./nft-item";
import sadEmoji from "../../../../public/icons/sad_emoji.png";
import sadEmoji_Dark from "../../../../public/icons/no_item_dark.png";
import { useTheme } from "next-themes";
import { BOLD_INTER_TIGHT } from "../../../config/constants/environments";

interface NftItemsProps {
  houseItems: any[];
}


export default function NftItems({ houseItems }: NftItemsProps) {
  const [itemOffset, setItemOffset] = useState(0);
  const { theme } = useTheme();
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % houseItems.length;
    setItemOffset(newOffset);
  };

  const itemsPerPage = 8;
  const pageCount = Math.ceil(houseItems.length / itemsPerPage);
  const currentItems = houseItems.slice(itemOffset, itemOffset + itemsPerPage);

  return (
    <>
      <div className="">
        {houseItems.length > 0 ? (
          <div className="flex justify-start overflow-x-scroll pb-[20px] gap-[20px]">
            {currentItems.map((houseItem, index) => {
              return (
                <div
                  className="flex justify-center"
                  key={`nft-house-item-${itemOffset + index}`}
                >
                  <NftItem
                    house={
                      houseItems[itemOffset + index]
                    }
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex w-full h-full items-center justify-center flex-col min-h-[40vh]">
            <div className={`text-[20px] mb-[20px] text-gray-500 ${BOLD_INTER_TIGHT.className}`}>No NFTs Found</div>
            <Image src={theme == 'dark' ? sadEmoji_Dark : sadEmoji} alt="Sad Emoji" />
            <div className="flex justify-center items-center mt-[20px]">
              <a
                href="https://docs.landshare.io/"
                target="_blank"
                className="text-center text-[16px] mr-[5px] dark:text-text-secondary"
              >
                Learn More
              </a>{" "}
              <QuestionIcon />
            </div>
          </div>
        )}
        {pageCount > 1 && (
          <div className="flex justify-center mb-5">
            <ReactPaginate
              previousLabel={<PrevLabelIcon />}
              nextLabel={<NextLabelIcon />}
              containerClassName={"pagination"}
              activeClassName={"active"}
              breakLabel="..."
              onPageChange={handlePageClick}
              marginPagesDisplayed={1}
              pageRangeDisplayed={
                itemOffset === 0
                  ? 5
                  : itemOffset / itemsPerPage + 2 <= 4
                    ? 4
                    : pageCount - itemOffset / itemsPerPage <= 3
                      ? 5
                      : 2
              }
              forcePage={itemOffset / itemsPerPage}
              pageCount={pageCount}
              renderOnZeroPageCount={null}
            />
          </div>
        )}
      </div>
    </>
  );
};
