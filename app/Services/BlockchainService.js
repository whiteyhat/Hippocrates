//using the infura.io node, otherwise ipfs requires you to run a daemon on your own computer/server. See IPFS.io docs
const IPFS = require('ipfs-api')
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

//run with local daemon
// const IPFS = require('ipfs-api');
// const ipfs = new IPFS('localhost', '5001', {
//   protocol: 'http'
// });


const ethUtil = require('ethereumjs-util')
const sigUtil = require('eth-sig-util')
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

  async verifyDigitalSignature(data){

    const msg = 'I am signing my one-time nonce: ' + data.user.nonce
    // We now are in possession of msg, publicAddress and signature. We
    // will use a helper from eth-sig-util to extract the address from the signature


    // We now are in possession of msg, publicAddress and signature. We
    // will use a helper from eth-sig-util to extract the address from the signature
    const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
    const address = sigUtil.recoverPersonalSignature({
      data: msgBufferHex,
      sig: data.signature
    });

    // The signature verification is successful if the address found with
    // sigUtil.recoverPersonalSignature matches the initial publicAddress
    if (address.toLowerCase() === data.user.address.toLowerCase()) {
      return true
    } else {
      return false
    }

  }

}

module.exports = new BlockchainService()
