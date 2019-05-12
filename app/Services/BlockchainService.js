//using the infura.io node, otherwise ipfs requires you to run a daemon on your own computer/server. See IPFS.io docs
const IPFS = require('ipfs-api')
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

//run with local daemon
// const IPFS = require('ipfs-api');
// const ipfs = new IPFS('localhost', '5001', {
//   protocol: 'http'
// });

const Logger = use('Logger')
const fs = require("fs")

class BlockchainService {

  async uploadToIPFS(filename) {
    Logger.info(filename)
    try {        
      return new Promise(resolve => {

      setTimeout(function(){
        var content = fs.readFileSync(filename)

        if (content) {
          Logger.info("Uploading file to IPFS")
          //save document to IPFS,return its hash
          //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 

            ipfs.add(content, (err, ipfsHash) => {
              Logger.info(ipfsHash)
              resolve(ipfsHash[0].hash)
            }) //await ipfs.add 
        }
      }, 1000)
    })
    } catch (error) {
      Logger.error(error)
    }
  }

}

module.exports = new BlockchainService()
