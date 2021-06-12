# nft_token
Simple example of NFT Token

## To deploy
in /blockchain directory
* $ npx hardhat compile
* $ npx hardhat test #optional
* $ npx hardhat run --network <network> scripts/deploy.js 

<network> must be configured in hardhat.config.js

It will create an Artifact.js file in dapp/generated directory with ABI and address of deployed contract

Execute a HTTP Server in app/ directory and browse to 
* createToken.html to create new nft
* viewTolen to view generated tokens (Work in progress)
