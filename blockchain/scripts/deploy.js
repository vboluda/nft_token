const hre = require("hardhat");
const fs = require('fs');

async function main() {

  const nftVbvb = await hre.ethers.getContractFactory("nftVbvb");
  const instance = await nftVbvb.deploy("VBVB TOKEN","VBVB");

  await instance.deployed();

  const Artifact = JSON.parse(fs.readFileSync('./artifacts/contracts/nftVbvb.sol//nftVbvb.json',
  {encoding:'utf8', flag:'r'}));

  fs.writeFileSync("../dapp/generated/Artifacts.js", "var artifact="+JSON.stringify({
    nftVbvb:{
      address:instance.address,
      abi:Artifact.abi
    }
  })+";",{encoding:'utf8'});

  console.log("Done.");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
