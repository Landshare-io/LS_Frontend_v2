import ReactLoading from "react-loading";
import { useAccount } from "wagmi";
import { useGlobalContext } from '../../context/GlobalContext';
import ConnectWallet from '../connect-wallet';
import useLogin from '../../hooks/nft-game/axios/useLogin';
import PremiumNfts from '../mint-premium-nfts';
import Topbar from '../common/topbar';
import HouseMintItem from './house-mint';
import YouOwn from '../common/you-own';
import './mint.css';

export default function NftMint() {
  const { isConnected, address } = useAccount();
  const { isLoading: isLoginLoading } = useLogin(address)
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
        <div className="section-container nft-game-container overflow-hidden pt-0 text-text-primary">
          {(!isConnected || !isAuthenticated) ? (
            <div className="text-center min-h-60vh d-flex flex-column justify-content-center align-items-center">
              <ConnectWallet />
            </div>
          ) : (
            <>
              <Topbar isNftList={true} />
              <span className="fw-bold fs-md">Mint House NFTs</span>
              <div className={`h-0 border-b ${theme == 'dark' ? "border-b-[#ffffff50]" : "border-b-[#00000050]"} d-block w-100 mb-4 my-3`}></div>
              <div className='mint-list pb-5 mb-5'>
                {houseTypes.map((product, index) => (
                  <div
                    key={`nft-house-item-${index}`}
                    className="mint-item-moible"
                  >
                    <HouseMintItem product={product} />
                  </div>
                ))}
              </div>

              <span className="fw-bold fs-md">Premium Upgrades</span>
              <div className={`h-0 border-b ${theme == 'dark' ? "border-b-[#ffffff50]" : "border-b-[#00000050]"} d-block w-100 mb-4 my-3`}></div>
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
