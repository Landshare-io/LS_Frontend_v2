import { Address } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "ethers";
import { useGlobalContext } from "../../../context/GlobalContext";
import useBalanceOf from "../../contract/LandTokenContract/useBalanceOf";
import useApprove from "../../contract/HouseNftContract/useApprove";
import useGetSetting from "./useGetSetting";
import {
  getHasPremiumNftIds,
  getPremiumNftAbleItem
} from "../../../utils/helpers/validator";
import { ADMIN_WALLET_ADDRESS } from "../../../config/constants/environments";

export default function useHandleGamePremiumNfts(chainId: number, address: Address | undefined, setLoader: Function) {
  const { isConnected } = useAccount();
  const { isAuthenticated, notifyError, notifySuccess } = useGlobalContext()
  const { data: landTokenBalance } = useBalanceOf({ chainId, address })
  const { approve, data: approveTx } = useApprove()
  const { 
    premiumAbleTime,
    premiumAttachPrice 
  } = useGetSetting()

  const { isSuccess: approveSuccess, data: approveStatusData } = useWaitForTransactionReceipt({
    hash: approveTx,
    chainId: chainId
  });

  const attachePremiumNftHandler = async (item: any) => {
    try {
      if (!isAuthenticated || !isConnected) return;
  
      if (Number(landTokenBalance) >= premiumAttachPrice) {
        setLoader(item.name)
        const hasNftIds = getHasPremiumNftIds(item.backendItems, premiumAbleTime)
        const nftId = getPremiumNftAbleItem(item.onChainItems, hasNftIds)
        if (item.hasItemId) {
          const amount = parseUnits(premiumAttachPrice.toString(), 18)
          approve(ADMIN_WALLET_ADDRESS, amount);
          const receipt = await transaction.wait();
          if (receipt.status) {
            try {
              const { data: transactionData } = await axios.post('/house/get-attach-premium-nft-transaction', {
                itemId: item.id
              })
              const sendedTransaction = await signer.sendTransaction(transactionData.transaction)
              sendedTransaction.wait().then(async (receipt) => {
                if (receipt.status) {
                  await axios.post('/has-premium-nft/reattach-premium-nft-house', {
                    hasItemId: item.hasItemId
                  })
  
                  const landTokenV2Balance = await landTokenV2Contract.balanceOf(account);
  
                  setUserResource((prevState) => ({
                    ...prevState,
                    landTokenV2: landTokenV2Balance,
                  }))
                  await getHouse(house.id)
                  gettingPremiumItems();
                  setLoader('')
                  notifySuccess(`Attach ${item.name} successfully`);
                }
              })
            } catch (error) {
              setLoader('')
              notifyError(`Attach ${item.name} failed`);
              notifyError("Buy house failed");
            }
          }
        } else {
          if (nftId == -1) {
            setLoader('')
            return notifyError(`No ${item.name} NFT Found`);
          } else {
            const transaction = await contracts[item.name].approve(
              process.env.REACT_APP_ADMIN_WALLET_ADDRESS,
              nftId
            );
            const receiptApproveNFT = await transaction.wait();
            if (receiptApproveNFT.status) {
              const amount = utils.parseUnits(premiumAttachPrice.toString(), 18)
              const transaction = await landTokenV2Contract.approve(
                process.env.REACT_APP_ADMIN_WALLET_ADDRESS,
                amount
              );
              const receipt = await transaction.wait();
              if (receipt.status) {
                try {
                  const { data: transactionData } = await axios.post('/house/get-attach-premium-nft-transaction', {
                    itemId: item.id
                  })
                  const sendedTransaction = await signer.sendTransaction(transactionData.transaction)
                  sendedTransaction.wait().then(async (receipt) => {
                    if (receipt.status) {
                      await axios.post('/has-premium-nft/attach-premium-nft-house', {
                        itemId: item.id,
                        houseId: house.id,
                        nftId,
                        nonce: transactionData.nonce,
                      })
    
                      const landTokenV2Balance = await landTokenV2Contract.balanceOf(account);
    
                      setUserResource((prevState) => ({
                        ...prevState,
                        landTokenV2: landTokenV2Balance,
                      }))
                      await getHouse(house.id)
                      gettingPremiumItems();
                      setLoader('')
                      notifySuccess(`Attach ${item.name} successfully`);
                    } else {
                      setLoader('')
                      notifyError(`Attach ${item.name} failed`);
                    }
                  }
                  )
                } catch (buyError: any) {
                  console.log(buyError);
                  setLoader('')
                  notifyError(buyError.response.data.message);
                }
              } else {
                setLoader('')
                notifyError(`Attach ${item.name} failed`);
              }
            } else {
              setLoader('')
              notifyError("Approve error");
            }
          }
        }
      } else {
        notifyError("Not Enough LAND Token");
      }
    } catch (error: any) {
      setLoader('')
      console.log("Error", error);
      notifyError(error.response.data.message);
    }
  };
}
