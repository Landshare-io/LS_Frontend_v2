import { hexlify, parseEther } from "ethers";

function bigintToUint8Array(bigInt: bigint) {
  let hexString = bigInt.toString(16);
  if (hexString.length % 2 !== 0) {
      hexString = '0' + hexString;
  }
  const byteArray = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
      byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
  }

  return byteArray;
}

export default function stringPadder(input: string, proposalType: string): string {
  let output: bigint = BigInt(0);

  if (proposalType === "Change Auto LAND Fee") {
    output = input !== "" ? BigInt(Math.floor(parseFloat(input) * 100)) : BigInt(0);
  } else if (proposalType === "Change Vault Allocation") {
    output = BigInt(input);
  } else {
    output = input !== "" ? BigInt(parseEther(input).toString()) : BigInt(0);
  }

  let hexOutput = hexlify(bigintToUint8Array(output)).slice(2);

  while (hexOutput.length < 64) {
    hexOutput = "0" + hexOutput;
  }

  return hexOutput;
}
