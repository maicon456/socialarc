const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to Arc Network Testnet...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "USDC\n");

  if (balance === 0n) {
    console.warn("⚠️  WARNING: Account has no balance. Get USDC from faucet:");
    console.warn("   https://faucet.circle.com\n");
  }

  // Deploy ArcnetNostr contract
  console.log("📦 Deploying ArcnetNostr contract...");
  const ArcnetNostr = await hre.ethers.getContractFactory("ArcnetNostr");
  const arcnetNostr = await ArcnetNostr.deploy();
  await arcnetNostr.waitForDeployment();
  const arcnetNostrAddress = await arcnetNostr.getAddress();
  console.log("✅ ArcnetNostr deployed to:", arcnetNostrAddress);

  // Deploy SocialFeed contract
  console.log("\n📦 Deploying SocialFeed contract...");
  const SocialFeed = await hre.ethers.getContractFactory("SocialFeed");
  const socialFeed = await SocialFeed.deploy();
  await socialFeed.waitForDeployment();
  const socialFeedAddress = await socialFeed.getAddress();
  console.log("✅ SocialFeed deployed to:", socialFeedAddress);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Deployment Complete!");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log("   ArcnetNostr:", arcnetNostrAddress);
  console.log("   SocialFeed: ", socialFeedAddress);
  console.log("\n📝 Next Steps:");
  console.log("   1. Update .env.local with these addresses:");
  console.log(`      NEXT_PUBLIC_CONTRACT_ADDRESS=${arcnetNostrAddress}`);
  console.log(`      NEXT_PUBLIC_SOCIAL_CONTRACT_ADDRESS=${socialFeedAddress}`);
  console.log("   2. Update lib/contract.ts and lib/social-contract.ts");
  console.log("   3. View contracts on explorer:");
  console.log(`      https://testnet.arcscan.app/address/${arcnetNostrAddress}`);
  console.log(`      https://testnet.arcscan.app/address/${socialFeedAddress}`);
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });


