import { hexlify, parseEther } from "ethers";

export default function stringPadder(input: string, proposalType: string): string {
  let output: bigint = BigInt(0);

  if (proposalType === "Change Auto LAND Fee") {
    output = input !== "" ? BigInt(Math.floor(parseFloat(input) * 100)) : BigInt(0);
  } else if (proposalType === "Change Vault Allocation") {
    output = BigInt(input);
  } else {
    output = input !== "" ? BigInt(parseEther(input).toString()) : BigInt(0);
  }

  let hexOutput = hexlify(output).slice(2);

  while (hexOutput.length < 64) {
    hexOutput = "0" + hexOutput;
  }

  return hexOutput;
}