import { useState, useEffect } from "react";
import { useAccount } from "wagmi"
import Head from "next/head";
import ReactLoading from "react-loading";
import ReactPaginate from "react-paginate";

import Breadcrumb from "../../components/common/breadcrumb";
import { getCcipTransactions } from "../../lib/slices/contract-slices/APIs/updateCcipTransaction";
import { useGlobalContext } from "../../context/GlobalContext";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { CCIP_CHAIN_NAME } from "../../config/constants/environments";
import Timer from "../../components/common/timer";

const breadcrumbItems = [
  {
    name: 'Home',
    url: '/'
  },
  {
    name: 'Vaults',
    url: '/vaults'
  },
  {
    name: 'Transactions',
    url: '/vaults/ccip-transactions'
  }
]

export default function CcipTransactions() {
  const { address } = useAccount()
  const { theme } = useGlobalContext();
  const [ccipTransactions, setCcipTransactions] = useState([])
  const [ccipTransactionsCount, setCcipTransactionsCount] = useState(0)
  const itemsPerPage = 10
  const [pageCount, setPageCount] = useState(0)
  const [itemOffset, setItemOffset] = useState(0)
  const [isPageLoading, setIsPageLoading] = useState(true)

  const getTransactionData = async (newOffset: any) => {
    if (typeof address == "undefined") return
    setIsPageLoading(true)
    const { data } = await getCcipTransactions(address, newOffset, itemsPerPage)

    setCcipTransactions(data)
    setPageCount(Math.ceil(data.count / itemsPerPage))
    setItemOffset(newOffset)
    setCcipTransactionsCount(data.count)
    setIsPageLoading(false)
  }

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % ccipTransactionsCount;
    getTransactionData(newOffset)
  };

  useEffect(() => {
    getTransactionData(0)
  }, [address])

  return (
    <div className={`pb-5 lg:pb-0 ${theme == 'dark' ? "dark" : ""}`}>
      <Head>
        <title>Landshare - Vaults</title>
      </Head>
      <div className="bg-primary pt-[41px] px-[20px] pb-[25px] lg:px-[120px]">
        <div className="max-w-[1200px] m-auto">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      <div className="bg-primary py-[20px] px-[20px] md:py-[80px] md:px-[40px] lg:px-[120px] pt-0">
        <div className="overflow-x-auto shadow-md sm:rounded-lg max-w-[1200px] m-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">CCIP Message ID</th>
                <th scope="col" className="px-6 py-3">From</th>
                <th scope="col" className="px-6 py-3">To</th>
                <th scope="col" className="px-6 py-3">ETA</th>
                <th scope="col" className="px-6 py-3">Action</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {isPageLoading && (
                <tr>
                  <td colSpan={7}>
                    <div className="flex w-full min-h-[60vh] h-full items-center justify-center">
                      <ReactLoading type="bars" color="#61cd81" />
                    </div>
                  </td>
                </tr>
              )}
              {!isPageLoading && ccipTransactions.map((transaction: any, index) => {
                const truncatedMessageId = `${transaction.messageId.slice(0, 8)}...${transaction.messageId.slice(-8)}`;
                return (
                  <tr key={transaction.messageId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(transaction.createDateTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <a
                        className="hover:underline text-blue-600 hover:text-blue-800"
                        href={`https://ccip.chain.link/msg/${transaction.messageId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={transaction.messageId}
                      >
                        {truncatedMessageId}
                      </a>
                    </td>
                    <td className="px-6 py-4">{CCIP_CHAIN_NAME[Number(transaction.sourceChain)]}</td>
                    <td className="px-6 py-4">{CCIP_CHAIN_NAME[Number(transaction.destinationChain)]}</td>
                    <td className="px-6 py-4">
                      {transaction.status == 'PENDING' ? (
                        <Timer countTime={new Date(transaction.createDateTime).getTime() + transaction.estimateTime - new Date().getTime()} />
                      ) : 'DONE'}
                    </td>
                    <td className="px-6 py-4">{transaction.action}</td>
                    <td className="px-6 py-4">{transaction.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {pageCount > 1 && (
          <div className="flex justify-center my-4">
            <ReactPaginate
              previousLabel={<IoIosArrowBack />}
              nextLabel={<IoIosArrowForward />}
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
    </div>
  )
}
