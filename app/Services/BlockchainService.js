
//using the infura.io node, otherwise ipfs requires you to run a daemon on your own computer/server. See IPFS.io docs
const IPFS = require('ipfs-api')
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
const Logger = use('Logger')
const fs = require("fs")


//run with local daemon
// const ipfsApi = require('ipfs-api');
// const ipfs = new ipfsApi('localhost', '5001', {protocol: 'http'});
class BlockchainService {

  async uploadToIPFS(filename) {
    let file = fs.readFileSync(filename);

    let buffer = new Buffer.from(file);
    Logger.info("Uploading file to IPFS")
    //save document to IPFS,return its hash
    //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
    
    return new Promise(resolve => {
      ipfs.add(buffer, (err, ipfsHash) => {
        resolve(ipfsHash[0].hash)
      }) //await ipfs.add 
    });

  }



}

module.exports = new BlockchainService()
