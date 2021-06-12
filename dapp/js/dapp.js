
var account="";
var nftContract={};
var ipfs={};

async function init(){
  console.log("Initialization");
  var eth=window.ethereum;
  window.web3=new Web3(eth);
  if(!eth && !eth.isMetamask()){
      alert("Metamask not installed. Please install Metamask.");
      return;
  }

  ipfs= await Ipfs.create({host: 'ipfs.infura.io', port: '5001'});

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
  if(elem){
    elem.innerText=`${account} (${balance/1000000000000000000})`;
  }
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

  async function retrieveIpfs(id){
    if(!id.length || id.length==0){
      return "";
    }
    
    const stream = ipfs.cat(id)
    let data = ''

    for await (const chunk of stream) {
      // chunks of data are returned as a Buffer, convert it back to a string
      data += chunk.toString()
    }
    return data;
  }

  async function getNFTs(){
    await init();
    const lastId=await nftContract.methods.currentId().call();
    console.log("Last NFT ID "+lastId);

    var elem=document.getElementById("mainDiv");
    var table   = document.createElement("table");
    elem.appendChild(table);
    var tblBody = document.createElement("tbody");
    table.appendChild(tblBody);
    for(let i=1;i<=lastId;i++){
      let _uri=await nftContract.methods.tokenURI(i).call();
      let owner=await nftContract.methods.ownerOf(i).call()
      console.log(`ID [${i}] URI: ${_uri}`);
      var metadata=await retrieveIpfs(_uri);
      if(metadata.length==0){
        continue;
      }
      console.log(`ID [${i}] URI: ${_uri} content: ${metadata}`);
      var metadataObj=JSON.parse(metadata);
      var imageData=await retrieveIpfs(metadataObj.imageID);
      console.log("Retrieve image of length "+imageData.length)
      
      var row = document.createElement("tr");
      var cell=document.createElement("tr");
      var h3=document.createElement("h3");
      var txtCell = document.createTextNode(metadataObj.name+" (Owned by: "+owner+")");
      h3.appendChild(txtCell);
      cell.appendChild(h3);
      row.appendChild(cell); 
      tblBody.appendChild(row);
       
      var irow = document.createElement("tr");
      var icell=document.createElement("tr");
      var img=document.createElement("img");
      img.setAttribute('src', imageData);
      icell.appendChild(img);
      irow.appendChild(icell);
      tblBody.appendChild(irow);
    }
  }