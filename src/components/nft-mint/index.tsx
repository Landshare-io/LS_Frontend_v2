import ReactLoading from "react-loading";
import { useAccount } from "wagmi";
import { useGlobalContext } from '../../context/GlobalContext';
import ConnectWallet from '../connect-wallet';
import useLogin from '../../hooks/nft-game/axios/useLogin';
import PremiumNfts from '../mint-premium-nfts';
import Topbar from '../common/topbar';
import HouseMintItem from './house-mint';
import YouOwn from '../common/you-own';
import { BOLD_INTER_TIGHT } from "../../config/constants/environments";

export default function NftMint() {
  const { isConnected, address } = useAccount();
  const { isLoading: isLoginLoading } = useLogin()
  const {
    isAuthenticated,
    theme
  } = useGlobalContext()

  const houseTypes = [
    // {
    //   type: 1,
    //   name: 'LSNF'
    // },
    // {
    //   type: 2,
    //   name: 'LSMD'
    // },
    {
      type: 3,
      name: 'LSCH'
    }
  ]

  return (
    <div className={`${theme == 'dark' ? "dark" : ""} bg-primary`}>
      {isLoginLoading ? (
        <div className="flex w-full min-h-[60vh] h-full items-center justify-center">
          <ReactLoading type="bars" color="#61cd81" />
        </div>
      ) : (
        <div className="relative max-w-[1200px] px-0 m-auto overflow-hidden pt-0 text-text-primary">
          {(!isConnected || !isAuthenticated) ? (
            <div className="text-center min-h-[60vh] flex flex-col justify-center items-center">
              <ConnectWallet />
            </div>
          ) : (
            <>
              <Topbar isNftList={true} />
              <span className={`text-[24px] ${BOLD_INTER_TIGHT.className}`}>Mint House NFTs</span>
              <div className={`h-0 border-b ${theme == 'dark' ? "border-b-[#ffffff50]" : "border-b-[#00000050]"} block w-full mb-4 my-3`}></div>
              <div className='flex overflow-x-auto pb-[20px] lg:grid lg:gird-cols-[minmax(251px,max-content),minmax(251px,max-content),minmax(251px,max-content),minmax(251px,max-content)] justify-between gap-[4rem] pb-5 mb-5'>
                {houseTypes.map((product, index) => (
                  <div
                    key={`nft-house-item-${index}`}
                    className="max-w-[251px] mr-[20px] m-0"
                  >
                    <HouseMintItem product={product} />
                  </div>
                ))}
              </div>

              <span className={`text-[24px] ${BOLD_INTER_TIGHT.className}`}>Premium Upgrades</span>
              <div className={`h-0 border-b ${theme == 'dark' ? "border-b-[#ffffff50]" : "border-b-[#00000050]"} block w-full mb-4 my-3`}></div>
              <PremiumNfts />
            </>
          )}
        </div>
      )}
      {isConnected && (
        <YouOwn />
      )}
    </div>
  )
}
