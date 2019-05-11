const Web3 = require('web3')
//access our local copy to contract deployed on rinkeby testnet
//use your own contract address
const address = '0xb84b12e953f5bcf01b05f926728e855f2d4a67a9'
//use the ABI from your contract
const abi = [{
    "constant": true,
    "inputs": [],
    "name": "getHash",
    "outputs": [{
      "name": "x",
      "type": "string"
    }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{
      "name": "x",
      "type": "string"
    }],
    "name": "sendHash",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
//using the infura.io node, otherwise ipfs requires you to run a daemon on your own computer/server. See IPFS.io docs
const IPFS = require('ipfs-api')
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
const Logger = use('Logger')


//run with local daemon
// const ipfsApi = require('ipfs-api');
// const ipfs = new ipfsApi('localhost', '5001', {protocol: 'http'});
class BlockchainService {

  async uploadToBlockchain(data) {
    const accounts = await web3.eth.getAccounts()
    const web3 = new Web3(window.web3.currentProvider);
    const contract = web3.eth.contract(abi, address)
    let hash = null
    let txid = null
    Logger.info('Sending from Metamask account: ' + accounts[0])


    //save document to IPFS,return its hash#, and set hash# to state
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
    await ipfs.add(data, (err, ipfsHash) => {
      Logger.warning(err, ipfsHash)
      //setState by setting ipfsHash to ipfsHash[0].hash 

      hash = ipfsHash[0].hash

      Logger.info(hash)
      
      // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
      //return the transaction hash from the ethereum contract
      //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send

      contract.methods.sendHash(hash).send({
        from: accounts[0]
      }, (error, transactionHash) => {
        txid = transactionHash
        Logger.info(txid)
      }); //storehash 
    }) //await ipfs.add 
  }



}

module.exports = new BlockchainService()
