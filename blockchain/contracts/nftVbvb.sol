pragma solidity ^0.7.3;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract nftVbvb is ERC721 {
    uint public currentId;
    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {
        console.log("SOL - nftVbvb:- Create [%s] symbol: [%s]",name,symbol);
        currentId=0;
    }

    function awardItem(address receiver, string memory tokenURI) public returns (uint256) {
        console.log("SOL - nftVbvb:- awardItem receiver [%s] tockenUri: [%s]",receiver,tokenURI);
        
        uint nextId=currentId+1;
        require(nextId>currentId,"OFERFLOW. No more tokenId can be created");

        currentId=nextId;        
        _mint(receiver, currentId);
        _setTokenURI(currentId, tokenURI);
        console.log("SOL - nftVbvb:- awardItem new token minted with id [%i]",currentId);

        return currentId;
    }
}