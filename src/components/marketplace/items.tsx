import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import ReactLoading from "react-loading";
import MarketplaceItem from "./item";
import {
  NextLabelIconMarketPlaceIcon,
  PrevLabelIconMarketPlaceIcon,
} from "../common/icons/index";
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

interface MarketplaceItemsProps {
  isLoading: boolean;
  products: any[];
  getProducts: Function;
}

export default function MarketplaceItems({
  isLoading,
  products,
  getProducts,
}: MarketplaceItemsProps) {
  const [itemOffset, setItemOffset] = useState(0);
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
  };
  const itemsPerPage = 8;
  const pageCount = Math.ceil(products.length / itemsPerPage);
  const currentItems = products.slice(itemOffset, itemOffset + itemsPerPage);

  return (
    <>
      {isLoading ? (
        <div className="flex w-full min-h-[60vh] h-full items-center justify-center mlg:grid mlg:grid-cols-[minmax(251px,max-content),minmax(251px,max-content),minmax(251px,max-content)] lg:grid-cols-[minmax(251px,max-content),minmax(251px,max-content),minmax(251px,max-content),minmax(251px,max-content)] mlg:justify-between mlg:gap-[4rem]">
          <ReactLoading type="bars" color="#61cd81" />
        </div>
      ): 
      <div>
        {currentItems.length > 0 ? (
          <div className="flex flex-row overflow-x-auto pb-[20px] pb-5 last:m-0">
            {currentItems.map((product, index) => (
              <div
                key={`nft-house-item-${index}`}
                className="w-[251px] mr-[20px]"
              >
                <MarketplaceItem
                  product={product}
                  getProducts={getProducts}
                />
              </div>
            ))}
          </div>
        ) : 
          <div className='flex w-full items-center justify-center flex-col min-h-[40vh]'>
            <div className={`text-[20px] mb-[20px] text-gray-500 ${BOLD_INTER_TIGHT.className}`}>No NFTs Found</div>
        
          </div>
        }
        {pageCount > 1 && (
          <div className="flex justify-center mb-5">
            <ReactPaginate
              previousLabel={<PrevLabelIconMarketPlaceIcon />}
              nextLabel={<NextLabelIconMarketPlaceIcon />}
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
              pageCount={pageCount}
              renderOnZeroPageCount={null}
            />
          </div>
        )}
      </div>}
    </>
  );
};
