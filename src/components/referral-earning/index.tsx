import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { useWriteContract } from 'wagmi';
 // Import ethers

export default function ReferralEarning() {
  const APIURL = 'https://api.studio.thegraph.com/query/71690/fuul-protocol-bsc/version/latest';
  const { address } = useAccount();
  const [rewards, setRewards] = useState({ availableToClaim: 0, claimed: 0, currency: '' });
  const [isClaiming, setIsClaiming] = useState(false); 

  useEffect(() => {
    const client = new ApolloClient({
      uri: APIURL,
      cache: new InMemoryCache(),
    });

    const USER_BALANCES_QUERY = gql`
      query GetUserBalances($owner: String!) {
        userBalances(
          where: { 
            owner_contains_nocase: $owner, 
            project_: {
              deployedAddress: "0x5c41b8814315988163e308c4734AC3FAF7092A10"
            }
          }
        ) {
          availableToClaim
          claimed
          currency
        }
      }
    `;

    client
      .query({
        query: USER_BALANCES_QUERY,
        variables: { owner: address },
      })
      .then((data) => {
        console.log('Subgraph data: ', data);
        if (data.data.userBalances.length > 0) {
          setRewards(data.data.userBalances[0]);
        }
      })
      .catch((err) => {
        console.log('Error fetching data: ', err);
      });
  }, [address]);

  const handleClaim = async () => {
    setIsClaiming(true);

    const claimChecks = [
      {
        projectAddress: '0x5c41b8814315988163e308c4734AC3FAF7092A10', // Replace with actual address
        currency: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        amount: ethers.parseEther(rewards.availableToClaim.toString()), // Convert to BigNumber
        tokenIds: [],
        amounts: [],
      },
    ];

    const address = "0xC38E3A10B5818601b29c83F195E8b5854AAE45aF";

    const abi = [
      "function claim(ClaimCheck[] calldata claimChecks) external"
    ];

    const {
      data,
      isPending,
      writeContract
    } = useWriteContract();

    try {
      const result = writeContract({
        address,
        abi,
        functionName: 'claim',
        args: [claimChecks],
      });

      console.log('Claim result: ', result);
    } catch (error) {
      console.error('Error during claim: ', error);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-third rounded-2xl p-6 shadow-lg">
      <p className="font-bold text-lg leading-7 text-text-primary">Earnings</p>

      <div className="">
        <div className="mt-[22px] flex justify-between">
          <p className="text-text-secondary text-sm leading-[28px]">
            Total Earned
          </p>

          <p className="font-bold text-text-primary text-lg leading-[28px] flex flex-col items-end">
              0.00 USDC
          </p>
        </div>

        <hr className="w-full my-[22px] bg-[#D8D8D8]" />

        <div className="flex justify-between items-center">
          <div>
            <p className="text-text-secondary text-sm leading-[28px]">
              Available to Claim
            </p>
            <p className="text-text-primary font-bold leading-[22px]">
              {rewards.availableToClaim} USDC
            </p>
          </div>

          <div className="text-text-secondary text-sm leading-[28px] flex flex-col items-end">
            <p>
              Total claimed:{" "}
              <span className="font-bold text-text-primary">{rewards.claimed}</span>{" "}
              <span className="text-text-primary">USDC</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleClaim}
          disabled={isClaiming || rewards.availableToClaim === 0}
          className="w-full font-bold border border-[#61CD81] text-text-primary text-sm mt-[22px] py-[13px] rounded-[100px]"
        >
          {isClaiming ? 'Claiming...' : 'Claim Earnings'}
        </button>

      </div>

      <div className="text-sm mt-[60px] md:mt-[66px] text-text-secondary leading-[22px]">
        <p className="text-[#FF0000] font-bold">
          30-Day Holding Requirement
        </p>
        <p>
          Both the referrer and referee must wait until the referee holds the LSRWA tokens for at least 30 days before rewards can be claimed.
        </p>
      </div>
    </div>
  );
}