import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useWriteContract } from "wagmi";
import { getCurrentEpoch } from "../../utils/helpers/generate-epochs";
import { Fuul } from "@fuul/sdk";
import {
  BOLD_INTER_TIGHT,
  USDC_ADDRESS,
} from "../../config/constants/environments";
import { useChainId } from "wagmi";
import { Web3Provider } from "@ethersproject/providers";
import FUULabi from "../../abis/FuulContract.json";

export default function ReferralEarning() {
  const APIURL =
    "https://api.studio.thegraph.com/query/71690/fuul-protocol-bsc/version/latest";
  const chainId = useChainId();
  const { address } = useAccount();
  const [rewards, setRewards] = useState({
    availableToClaim: "0",
    claimed: "0",
    currency: "",
  });
  const [isClaiming, setIsClaiming] = useState(false);
  const [referredVolume, setReferredVolume] = useState<number>(0);
  const current_epoch = getCurrentEpoch();

  const { data, isPending, writeContract } = useWriteContract();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (address) {
          const total_conversions = await Fuul.getPayoutsLeaderboard({
            currency_address: USDC_ADDRESS[chainId],
            user_address: address,
            from: current_epoch?.start_date
              ? new Date(current_epoch.start_date)
              : undefined,
            to: current_epoch?.end_date
              ? new Date(current_epoch.end_date)
              : undefined,
            user_type: "affiliate",
            fields: "referred_volume",
          });

          const totalReferredAmountSum = [...total_conversions.results].reduce(
            (sum, item) => sum + Number(item?.total_amount),
            0
          );
          setReferredVolume(totalReferredAmountSum);
        }
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchData();
  }, [address]);

  useEffect(() => {
    if (address) {
      const client = new ApolloClient({
        uri: APIURL,
        cache: new InMemoryCache(),
      });

      const USER_BALANCES_QUERY = gql`
        query GetUserBalances($owner: String!) {
          userBalances(
            where: {
              owner_contains_nocase: $owner
              project_: {
                deployedAddress: "0x5c41b8814315988163e308c4734AC3FAF7092A10"
              }
            }
          ) {
            availableToClaim
            claimed
            currency
            project {
              id
              deployedAddress
            }
          }
        }
      `;

      client
        .query({
          query: USER_BALANCES_QUERY,
          variables: { owner: address },
        })
        .then((data) => {
          console.log("Subgraph data: ", data);
          if (data.data.userBalances.length > 0) {
            setRewards(data.data.userBalances[0]);
          }
        })
        .catch((err) => {
          console.log("Error fetching data: ", err);
        });
    }
  }, [address]);

  const handleClaim = async () => {
    setIsClaiming(true);

    const claimChecks = [
      {
        projectAddress: "0x5c41b8814315988163e308c4734AC3FAF7092A10",
        currency: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
        amount: ethers.parseEther(rewards.availableToClaim.toString()),
        tokenIds: [],
        amounts: [],
      },
    ];

    const address = "0xC38E3A10B5818601b29c83F195E8b5854AAE45aF";

    try {
      const provider = new Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const fuulManager = new ethers.Contract(
        address,
        FUULabi,
        signer as unknown as ethers.Signer
      );

      const tx = await fuulManager.claim(claimChecks);

      console.log("claim", tx);
    } catch (error) {
      console.error("Error during claim: ", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const scrollToElement = () => {
    const targetElement = document.querySelector("#how-to-participate");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full h-full flex flex-col  justify-between bg-third rounded-2xl p-6 shadow-lg">
      <div className="flex flex-col gap-8 md:gap-3">
        <p className="font-bold text-lg  text-text-primary">Earnings</p>
        <div className="flex flex-col gap-2 lg:gap-3">
          <div className=" flex justify-between">
            <p className="text-text-secondary text-sm leading-[28px]">
              Total Earned
            </p>

            <p className="font-bold text-text-primary text-lg leading-[28px] flex flex-col items-end">
              {parseFloat(
                ethers.formatUnits(
                  (
                    parseFloat(rewards.availableToClaim) +
                    parseFloat(rewards.claimed)
                  ).toString(),
                  18
                )
              ).toFixed(2)}{" "}
              USDC
            </p>
          </div>

          <hr className="w-full my-[22px] bg-secondary" />

          <div className="flex justify-between items-center">
            <div>
              <p className="text-text-secondary text-sm leading-[28px]">
                Available to Claim
              </p>
              <p className="text-text-primary font-bold leading-[22px]">
                {parseFloat(
                  ethers.formatUnits(rewards.availableToClaim, 18)
                ).toFixed(2)}{" "}
                USDC
              </p>
            </div>

            <div className="text-text-secondary text-sm leading-[28px] flex flex-col items-end">
              <p>
                Total claimed:{" "}
                <span className="font-bold text-text-primary">
                  {rewards.claimed}
                </span>{" "}
                <span className="text-text-primary">USDC</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={isClaiming || parseInt(rewards.availableToClaim) === 0}
            className="w-full font-bold border border-[#61CD81] text-text-primary text-sm mt-[22px] py-[13px] rounded-[100px]"
          >
            {isClaiming ? "Claiming..." : "Claim Earnings"}
          </button>
          <div className="flex !bg-transparent items-center justify-center">
            <button
              onClick={() => scrollToElement()}
              className={`text-[14px] cursor-pointer leading-[22px] text-[#61cd81] ${BOLD_INTER_TIGHT.className}`}
            >
              Learn how to participate
            </button>
          </div>
        </div>
      </div>

      <div className="text-sm mt-[60px] md:mt-[6px] text-text-secondary leading-[22px]">
        <p className="text-red-500 dark:text-red-400 font-bold">
          30-Day Holding Requirement
        </p>
        <p>
          Both the referrer and referee must wait until the referee holds the
          LSRWA tokens for at least 30 days before rewards can be claimed.
        </p>
      </div>
    </div>
  );
}
