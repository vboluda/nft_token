
var account="";
var nftContract={};

async function init(){
  console.log("Initialization");
  var eth=window.ethereum;
  window.web3=new Web3(eth);
  if(!eth && !eth.isMetamask()){
      alert("Metamask not installed. Please install Metamask.");
      return;
  }

  var accounts=await eth.request({ method: 'eth_requestAccounts' });
  
  if(accounts.length){
    if(accounts.length>0){
      account=accounts[0];
    }
  }else{
    account=accounts;
  }
  console.log("Retrieved Main Account "+account);

  var balance=await eth.request({ 
    method: 'eth_getBalance', 
    params:[account]});
  //var heritageBalance=await c.methods.getBalance(element).call();
  console.log(`Account balance ${balance/100000000000000000}` )

  var elem=document.getElementById("mainaccount");
  elem.innerText=`${account} (${balance/1000000000000000000})`;

  nftContract= new window.web3.eth.Contract(artifact.nftVbvb.abi,artifact.nftVbvb.address)
  
}


function previewFile() {
    var preview = document.querySelector('img');
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    reader.onloadend = function () {
      preview.src = reader.result;
    }
  
    if (file) {
      console.log("File selected: "+JSON.stringify(file));
      //document.getElementById('#fileName').innerText=file.name;
      var elem=document.getElementById("filename");
      elem.value=file.name;
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }
  }

  async function storeOnIPFS(imageContent,metadata){
        var ipfs= await Ipfs.create({host: 'ipfs.infura.io', port: '5001'});
        var result=await ipfs.add(imageContent);
        console.log("Image ID: "+result.path);
        var metadata={
            imageID: result.path,
            name: metadata.name
        };

        var strJson=JSON.stringify(metadata);
        var nftMetadataId=await ipfs.add(strJson);
        console.log("NFT ID: "+nftMetadataId.path)
        return nftMetadataId.path;
  };

  async function mint(){
    var elem=document.getElementById("filename");
    var name=elem.value;
    var preview = document.querySelector('img');
    var src=preview.src;
    var idUri=await storeOnIPFS(src,{name:name});
    
    console.log(`Send tx awward item [%s] id [%s]`,account,idUri);
    await nftContract.methods.awardItem(account,idUri).send({from:account});
  } 