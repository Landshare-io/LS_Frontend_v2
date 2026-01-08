const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying LandshareSale contract with account:", deployer.address);

  const whitelistAddress = "0xF96d8e687147C9BE23e47Eb763e4a38fB4130e9E";
  const RWATokenAddress = "0x475eD67Bfc62B41c048b81310337c1D75D45aADd";
  const USDCTokenAddress = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";
  const LANDTokenAddress = "0xA73164DB271931CF952cBaEfF9E8F5817b42fA5C";
  const apiConsumerAddress = "0x61f8c9fE835e4CA722Db3A81a2746260b0D77735";
  const saleExchangeRateAddress = "0x4e9651AD369d8F986935852C945338F76b5fb360";
  const initialOwner = "0x0734F6BA6445289a2C45Cd846e84944132a33338";

  console.log("Constructor parameters:");
  console.log("Whitelist:", whitelistAddress);
  console.log("RWA Token:", RWATokenAddress);
  console.log("USDC Token:", USDCTokenAddress);
  console.log("LAND Token:", LANDTokenAddress);
  console.log("API Consumer:", apiConsumerAddress);
  console.log("Sale Exchange Rate:", saleExchangeRateAddress);
  console.log("Initial Owner:", initialOwner);

  const LandshareSale = await ethers.getContractFactory("LandshareSale");
  
  const landshareSale = await LandshareSale.deploy(
    whitelistAddress,
    RWATokenAddress,
    USDCTokenAddress,
    LANDTokenAddress,
    apiConsumerAddress,
    saleExchangeRateAddress,
    initialOwner,
    {
      gasLimit: 5000000
    }
  );

  await landshareSale.waitForDeployment();
  const address = await landshareSale.getAddress();

  console.log("\nLandshareSale deployed to:", address);
  console.log("\nUpdate LANDSHARE_SALE_CONTRACT_ADDRESS[56] in environments.ts with:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
