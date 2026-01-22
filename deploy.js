const hre = require("hardhat");

async function main() {
  const [deployer, addr1, addr2] = await hre.ethers.getSigners();
  
  // In a real deployment, replace these with real addresses
  const owners = [deployer.address, addr1.address, addr2.address];
  const requiredSigs = 2; // 2 out of 3

  console.log("Deploying MultiSig with owners:", owners);

  const MultiSig = await hre.ethers.getContractFactory("MultiSig");
  const multisig = await MultiSig.deploy(owners, requiredSigs);

  await multisig.deployed();

  console.log("MultiSig deployed to:", multisig.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
