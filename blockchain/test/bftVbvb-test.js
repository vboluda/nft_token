const { expect } = require("chai");

describe("nftVbvb", function () {
  it("Should return the right name and symbol", async function () {
    const nftVbvb = await hre.ethers.getContractFactory("nftVbvb");
    const instance = await nftVbvb.deploy("VBVB TOKEN", "VBVB");

    await instance.deployed();
    expect(await instance.name()).to.equal("VBVB TOKEN");
    expect(await instance.symbol()).to.equal("VBVB");
  });


  it("Should mint new token", async function () {
    const nftVbvb = await hre.ethers.getContractFactory("nftVbvb");
    const instance = await nftVbvb.deploy("VBVB TOKEN", "VBVB");
    const [Owner, Receiver] = await ethers.getSigners();

    await instance.deployed();
    receiver=await Receiver.getAddress();

    const URI="URI_DUMMY"
    await instance.awardItem(receiver,URI);
    const balance=await instance.balanceOf(receiver);
    expect(balance).eq(1);
    const tokenOwner=await instance.ownerOf(1);
    expect(tokenOwner).eq(receiver);

  });


  it("Should transfer token", async function () {
    const nftVbvb = await hre.ethers.getContractFactory("nftVbvb");
    const instance = await nftVbvb.deploy("VBVB TOKEN", "VBVB");
    const [Owner, Receiver,Other] = await ethers.getSigners();

    await instance.deployed();
    const owner=await Owner.getAddress();
    const receiver=await Receiver.getAddress();
    const other=await Other.getAddress();

    const URI="URI_DUMMY"
    await instance.awardItem(owner,URI);
    await instance.transferFrom(owner,other,1);
    const balance=await instance.balanceOf(other);
    expect(balance).eq(1);
    const tokenOwner=await instance.ownerOf(1);
    expect(tokenOwner).eq(other);

  });
});
