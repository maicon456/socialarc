const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying SocialFeed to Arc Network Testnet...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "USDC\n");

  console.log("📦 Deploying SocialFeed...");
  const SocialFeed = await hre.ethers.getContractFactory("SocialFeed");
  const contract = await SocialFeed.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ SocialFeed deployed to:", address);
  console.log("🔗 Explorer: https://testnet.arcscan.app/address/" + address);
  console.log("\n📝 Add to .env.local:");
  console.log(`NEXT_PUBLIC_SOCIAL_CONTRACT_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



