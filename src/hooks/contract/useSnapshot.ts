import snapshotjs from "@snapshot-labs/snapshot.js";
import { Web3Provider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { 
  useWalletClient,
  useAccount
} from "wagmi";
import { useBlockNumber } from 'wagmi'
import { useGlobalContext } from "../../context/GlobalContext";

const client = new snapshotjs.Client712("https://hub.snapshot.org");


interface SnapshotParams {
  title: string;
  body: string;
  proposalJSON: string;
  proposal: string;
}

type SnapshotCallback = () => void;

export default function useSnapshot({ title, body, proposalJSON, proposal }: SnapshotParams) {
  const { setScreenLoadingStatus } = useGlobalContext()
  const { data: signer } = useWalletClient();
  const { address } = useAccount()
  const account = address ?? ''
  const { data: blockNumber } = useBlockNumber()

  async function snapshot(onSuccess?: SnapshotCallback, onError?: (error: Error) => void): Promise<void> {
    const startTime = Math.round(Date.now() / 1000);
    const endTime = startTime + 604800;
    const space = "landsharetest.eth";
    const strategies = [
      {
        name: "single-staking-autocompound-balanceof",
        params: {
          symbol: "LAND",
          decimals: 18,
          stakingPoolAddress: "0x6233FFEEf97D08Db2c763f389eebD9d738E4d4a3",
        },
      },
      {
        name: "masterchef-pool-balance",
        params: {
          pid: "0",
          symbol: "LAND",
          weight: 1,
          tokenIndex: null,
          chefAddress: "0x3f9458892fB114328Bc675E11e71ff10C847F93b",
          uniPairAddress: null,
          weightDecimals: 0,
        },
      },
      {
        name: "erc20-token-and-lp-weighted",
        params: {
          symbol: "LAND",
          tokenAddress: "0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C",
          lpTokenAddress: "0x13F80c53b837622e899E1ac0021ED3D1775CAeFA",
        },
      },
      {
        name: "masterchef-pool-balance-price",
        params: {
          pid: "1",
          token0: {
            weight: 2,
            address: "0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C",
            weightDecimals: 0,
          },
          weight: 1,
          chefAddress: "0x3f9458892fB114328Bc675E11e71ff10C847F93b",
          uniPairAddress: "0x13F80c53b837622e899E1ac0021ED3D1775CAeFA",
          weightDecimals: 0,
        },
      },
    ];
    const network = "56";
    const voters = [account];

    console.log(proposal);
    console.log(proposalJSON);

    function noTX(proposal: string): boolean {
      return (
        proposal === "Create Bounty" ||
        proposal === "Change Voting Period" ||
        proposal === "Change LAND Requirement" ||
        proposal === "Change Quorum" ||
        proposal === "Custom Proposal"
      );
    }

    setScreenLoadingStatus('Transaction Start');

    let score: number = 0;
    try {
      const scores = await snapshotjs.utils.getScores(space, strategies, network, voters, Number(blockNumber));
      console.log("Scores", scores);

      score = scores.reduce((sum: number, strategy: any) => {
        if (typeof strategy[account] !== "undefined") {
          sum += Number(strategy[account]);
        }
        return sum;
      }, 0);

      console.log(score);
    } catch (error) {
      console.error("Error fetching scores:", error);
      if (onError) onError(error as Error);
      return;
    }

    if (score < 100) {
      window.alert("Not enough voting power.");
      setScreenLoadingStatus("Transaction Failed.");
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000)
      return;
    }

    try {
      const proposalSinger = signer as unknown as Web3Provider | Wallet
      await client.proposal((proposalSinger), account, {
        space: "landshare.eth",
        type: "single-choice",
        title: `[${proposal}] ${title}`,
        body: body,
        choices: ["Yes", "No"],
        start: startTime,
        end: endTime,
        snapshot: Number(blockNumber),
        plugins: noTX(proposal) ? JSON.stringify({}) : proposalJSON,
        app: "snapshot",
        discussion: ''
      });

      if (onSuccess) onSuccess();
    } catch (e) {
      console.log(e);
      setScreenLoadingStatus("Transaction Failed.");
      setTimeout(() => {
        setScreenLoadingStatus("")
      }, 1000)
      if (onError) onError(e as Error);
    }

    setScreenLoadingStatus("Transaction Success.");

    setTimeout(() => {
      setScreenLoadingStatus("")
    }, 1000)
  }

  return {
    snapshot,
  };
}
