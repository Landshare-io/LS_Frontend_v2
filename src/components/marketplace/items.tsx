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
        <div className="flex w-full min-h-[60vh] h-full items-center justify-center">
          <ReactLoading type="bars" color="#61cd81" />
        </div>
      ): 
      <div>
        {currentItems.length > 0 ? (
          <div className="flex flex-row overflow-auto md:grid md:grid-cols-3 lg:grid-cols-4 px-1 pb-5 last:m-0">
            {currentItems.map((product, index) => (
              <div
                key={`nft-house-item-${index}`}
                className="min-w-[251px] m-[20px]"
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
          <div className="flex justify-center mt-[20px] mb-[100px] md:mt-0 md:mb-5">
            <ReactPaginate
              previousLabel={<PrevLabelIconMarketPlaceIcon />}
              nextLabel={<NextLabelIconMarketPlaceIcon />}
              containerClassName={"text-text-primary flex gap-5 items-center"}
              activeClassName={"text-green-600 font-bold"}
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
