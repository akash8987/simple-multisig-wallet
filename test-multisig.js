const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MultiSig", function () {
  it("Should require 2 signatures to execute", async function () {
    const [owner1, owner2, owner3, nonOwner] = await ethers.getSigners();
    const MultiSig = await ethers.getContractFactory("MultiSig");
    const wallet = await MultiSig.deploy([owner1.address, owner2.address, owner3.address], 2);
    
    // Fund wallet
    await owner1.sendTransaction({ to: wallet.address, value: ethers.utils.parseEther("1.0") });

    // 1. Submit
    await wallet.connect(owner1).submitTransaction(nonOwner.address, ethers.utils.parseEther("0.5"));

    // 2. Confirm (1/2)
    await wallet.connect(owner2).confirmTransaction(0);
    
    // Try execute (Should fail)
    await expect(wallet.connect(owner1).executeTransaction(0)).to.be.revertedWith("Not enough confirmations");

    // 3. Confirm (2/2)
    await wallet.connect(owner3).confirmTransaction(0);

    // 4. Execute (Should success)
    await wallet.connect(owner1).executeTransaction(0);
    
    expect(await ethers.provider.getBalance(wallet.address)).to.equal(ethers.utils.parseEther("0.5"));
  });
});
