import { pack } from "@ethersproject/solidity";
import { _TypedDataEncoder } from "ethers";
import { hexDataLength } from "@ethersproject/bytes";
import { ethers } from "ethers";
import { keccak256 } from "@ethersproject/keccak256";
import stringPadder from "./string-padder";

interface TxHashBuilderProps {
  setHash: (hash: string) => void;
  setCompleteHash: (hash: string) => void;
  setBatchData: (data: string) => void;
}

interface ProposalValue {
  amountToBurn?: string;
  autoLandFee?: string;
  amountToMarketing?: string;
  allocPointsBurn?: string;
  allocPointsStake?: string;
  allocPointsLP?: string;
  grantAmount?: string;
}

export default async function txHashBuilder(
  { setHash, setCompleteHash, setBatchData }: TxHashBuilderProps,
  proposalValue: ProposalValue,
  proposalType: string
): Promise<boolean | void> {
  if (proposalType === "Burn Tokens") {
    const burnAmount = stringPadder(proposalValue.amountToBurn || "", proposalType);
    try {
      const domain = {
        chainId: process.env.REACT_APP_NET_ID,
        verifyingContract: process.env.REACT_APP_REALITY_MODULE,
      };

      const types = {
        Transaction: [
          { type: "address", name: "to" },
          { type: "uint256", name: "value" },
          { type: "bytes", name: "data" },
          { type: "uint8", name: "operation" },
          { type: "uint256", name: "nonce" },
        ],
      };

      const value = {
        to: process.env.REACT_APP_LAND_TOKEN_V2_ADDR,
        value: 0,
        data:
          "0xa9059cbb000000000000000000000000000000000000000000000000000000000000dead" +
          burnAmount,
        operation: 0,
        nonce: 0,
      };

      const structHash = ethers.utils._TypedDataEncoder.hash(domain, types, value);
      const completeHash = keccak256(structHash);

      setHash(structHash);
      setCompleteHash(completeHash);
    } catch (e) {
      console.log(e);
    }

    return true;
  }

  if (proposalType === "Change Auto LAND Fee") {
    const newFee = stringPadder(proposalValue.autoLandFee || "", proposalType);

    const domain = {
      chainId: process.env.REACT_APP_NET_ID,
      verifyingContract: process.env.REACT_APP_REALITY_MODULE,
    };

    const types = {
      Transaction: [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "nonce" },
      ],
    };

    const value = {
      to: process.env.REACT_APP_AUTOLANDV3,
      value: 0,
      data: "0x70897b23" + newFee,
      operation: 0,
      nonce: 0,
    };

    const structHash = ethers.utils._TypedDataEncoder.hash(domain, types, value);
    const completeHash = keccak256(structHash);

    setHash(structHash);
    setCompleteHash(completeHash);

    return true;
  }

  if (proposalType === "Add to Marketing Fund") {
    const bountyAmount = stringPadder(proposalValue.amountToMarketing || "", proposalType);

    const domain = {
      chainId: process.env.REACT_APP_NET_ID,
      verifyingContract: process.env.REACT_APP_REALITY_MODULE,
    };

    const types = {
      Transaction: [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "nonce" },
      ],
    };

    const value = {
      to: process.env.REACT_APP_LAND_TOKEN_V2_ADDR,
      value: 0,
      data:
        "0xa9059cbb000000000000000000000000ee39392eCAc26a321D22bAfAE79b6e923a3ad413" +
        bountyAmount,
      operation: 0,
      nonce: 0,
    };

    const structHash = ethers.utils._TypedDataEncoder.hash(domain, types, value);
    const completeHash = keccak256(structHash);

    setHash(structHash);
    setCompleteHash(completeHash);

    return true;
  }

  if (proposalType === "Change Vault Allocation") {
    const burnPoolAmount = stringPadder(proposalValue.allocPointsBurn || "", proposalType);
    const stakePoolAmount = stringPadder(proposalValue.allocPointsStake || "", proposalType);
    const LPPoolAmount = stringPadder(proposalValue.allocPointsLP || "", proposalType);

    const multiSendContract = new ethers.utils.Interface([
      "function multiSend(bytes transactions) payable",
    ]);

    const domain = {
      chainId: process.env.REACT_APP_NET_ID,
      verifyingContract: process.env.REACT_APP_REALITY_MODULE,
    };

    const types = {
      Transaction: [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "nonce" },
      ],
    };

    const values = [
      {
        to: process.env.REACT_APP_MASTERCHEF,
        value: 0,
        data:
          "0x64482f790000000000000000000000000000000000000000000000000000000000000000" +
          stakePoolAmount +
          "0000000000000000000000000000000000000000000000000000000000000001",
        operation: 0,
        nonce: 0,
      },
      {
        to: process.env.REACT_APP_MASTERCHEF,
        value: 0,
        data:
          "0x64482f790000000000000000000000000000000000000000000000000000000000000001" +
          LPPoolAmount +
          "0000000000000000000000000000000000000000000000000000000000000001",
        operation: 0,
        nonce: 0,
      },
      {
        to: process.env.REACT_APP_MASTERCHEF,
        value: 0,
        data:
          "0x64482f790000000000000000000000000000000000000000000000000000000000000002" +
          burnPoolAmount +
          "0000000000000000000000000000000000000000000000000000000000000001",
        operation: 0,
        nonce: 0,
      },
    ];

    const valuesMap = values.map((tx) => [
      tx.operation,
      tx.to,
      tx.value,
      hexDataLength(tx.data || "0x"),
      tx.data || "0x",
    ]);

    const typesMap = values.map(() => ["uint8", "address", "uint256", "uint256", "bytes"]);

    const packed = pack(typesMap.flat(1), valuesMap.flat(1));

    const data = multiSendContract.encodeFunctionData("multiSend", [packed]);

    const valueBatch = {
      to: process.env.REACT_APP_MULTISEND_ADDRESS,
      value: "0",
      data: data,
      operation: 1,
      nonce: "0",
    };

    const structHash = ethers.utils._TypedDataEncoder.hash(domain, types, valueBatch);
    const completeHash = keccak256(structHash);

    setBatchData(data);
    setHash(structHash);
    setCompleteHash(completeHash);

    return true;
  }

  if (proposalType === "Request Grant") {
    const grantAmount = stringPadder(proposalValue.grantAmount || "", proposalType);

    const domain = {
      chainId: process.env.REACT_APP_NET_ID,
      verifyingContract: process.env.REACT_APP_REALITY_MODULE,
    };

    const types = {
      Transaction: [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "nonce" },
      ],
    };

    const value = {
      to: process.env.REACT_APP_LAND_TOKEN_V2_ADDR,
      value: 0,
      data:
        "0xa9059cbb0000000000000000000000009c28db9FAA2ae0fF5985d12067b83C7FaC43907B" +
        grantAmount,
      operation: 0,
      nonce: 0,
    };

    const structHash = ethers.utils._TypedDataEncoder.hash(domain, types, value);
    const completeHash = keccak256(structHash);

    setHash(structHash);
    setCompleteHash(completeHash);

    return true;
  }
}
