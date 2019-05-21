'use strict'
const User = use('App/Models/User')
const edge = require('edge.js')
const PdfService = use('App/Services/PdfService')
const BlockchainService = use('App/Services/BlockchainService')
const Logger = use('Logger')
const Env = use('Env')
const Database = use('Database')

class UserController {

  async logout({auth}) {
    try {
      await auth.logout()
    } catch (error) {
    }
  }

  async edit({auth, request, response}) {
    const {role, name, email, phone, clinic, address} = request.all()
    try {
      if (auth.user.wallet) {
        const user = await User.findBy('wallet', auth.user.wallet)
        if (role != undefined) {
          user.role = role
        }
        user.role = role
        if (name != undefined) {
          user.name = name
        }
        if (address != undefined) {
          user.address = address
        }

        if (email != undefined) {
          user.email = email
        }

        if (phone != undefined) {
          user.phone = phone
        }

        if (clinic != undefined) {
          user.clinic = clinic
        }
     
        await user.save()
        response.send({msg: "Profile saved", type: "success"})
      } else {
        response.send({msg: "You do not have the permissions", type: "error"})
      }
    } catch (error) {
      Logger.error(error)
    }
  }

  async staff({auth, view, response}) {
    try {
      if (auth.user.wallet) {
        const users = await Database.select('name', 'role', 'wallet').from('users')
        edge.global('contract', Env.get('CONTRACT_ADDRESS'))
        return view.render('staff', {users})
      } else {
        response.send({msg: "You do not have the permission to view the admin panel"})
      }
    } catch (error) {
    }
  }

  async admin({auth, view, response}) {
    try {
      if (auth.user.admin) {
        const users = await Database.select('name', 'id', 'role', 'address', 'email', 'phone', 'clinic', 'wallet', 'created_at').from('users')
        return view.render('admin', {users})
      } else {
        response.send({msg: "You do not have the permission to view the admin panel"})
      }
    } catch (error) {
    }
  }

  async deleteAccount({auth, response, request}) {
    const {id} = request.all()
    let msg = ""
    let type = ""
    try {
      if (auth.user.admin) {

        await Database
        .table('tokens')
        .where('user_id', id)
        .delete()

        await Database
        .table('users')
        .where('id', id)
        .delete()
        msg = "User deleted"
        type = "success"
      } else {
        if (auth.user.id) {
          await Database
          .table('tokens')
          .where('user_id', auth.user.id)
          .delete()

          await Database
          .table('users')
          .where('id', auth.user.id)
          .delete()

          msg = "User deleted"
          type = "success"
        }
      }
      response.send({type, msg})
    } catch (error) {
      Logger.error(error)
    }
  }

  async createUser({auth, request, response}) {
    
      try {
        const {wallet} = request.all()

      if (auth.user.admin) {
        const nonce = Math.floor(Math.random() * 10000)
        Logger.info(nonce)
        let msg = ""
        let type = ""
        const user = await User.create({wallet: wallet.toLowerCase(), nonce })
        if (user) {
          msg = "New user added"
          type = "success"
        }else{
           msg = "There was an error when adding a new user"
           type = "error"
        }

        response.send({type, msg})

      } else {
        response.send({type: "error", msg: "You do not have the permission to create"})
      }
    } catch (error) {
      Logger.error(error)
    }
  }
  async demoAdmin({auth, request, response}) {
    
    try {
      const {wallet} = request.all()
      const nonce = Math.floor(Math.random() * 10000)
      const user = await User.findBy('wallet', wallet)

      if (user) {
        await user.delete()
        await User.create({wallet: wallet.toLowerCase(), nonce})
    
        response.send({type:'info', msg: "Demo started. Please click on log in on the top right button"})
      }
      if (auth.user) {
        await auth.logout()
        return response.send({type:"info", msg:"You are already in Hippocrates, please log in on the top right button"})
      }else{
        await User.create({wallet: wallet.toLowerCase(), nonce, admin: true})
        
        const msg = 'Demo started. Please click on log in on the top right button'
        const type = "info"
      
        response.send({type, msg})
      }
  } catch (error) {
    Logger.error(error)
  }
}

async demoDoctor({auth, request, response}) {
    
  try {
    const {wallet} = request.all()
    const nonce = Math.floor(Math.random() * 10000)
    const user = await User.findBy('wallet', wallet)

    if (user) {
      await user.delete()
      await User.create({wallet: wallet.toLowerCase(), nonce})
  
      response.send({type:'info', msg: "Demo started. Please click on log in on the top right button"})
    }

    if (auth.user) {
      await auth.logout()
      return response.send({type:"info", msg:"You are already in Hippocrates, please log in on the top right button"})
    }else{
      await User.create({wallet: wallet.toLowerCase(), nonce})
      
      const msg = "Demo started. Please click on log in on the top right button"
      const type = "info"
  
      response.send({type, msg})
    }

} catch (error) {
  Logger.error(error)
}
}



  async selfSovereignIdentity({auth, request,response}) {
    try {
      const {address} = request.all()
      const nonce = Math.floor(Math.random() * 10000)

      if (!address){
      response.status(400)
        .send('Request should have signature and publicAddress')
      } 

      const user = await User.findBy('wallet', address)
      if (!user) {          
        let msg = ""
        let type = ""
       const query = await Database.select('*').from('users')
       if (!query[0]) {
        const user = await User.create({wallet: address, admin:1, nonce})
        await auth.remember(true).login(user)
        msg = "Welcome to Hippocrates. New admin user created"
        type = "info"

      }else{
        msg = "Sorry, only registered users can access to Hippocrates"
        type = "error"
      }

      response.send({type, msg, nonce })
      
      }else{
        user.nonce = nonce
        await user.save()
        response.send({nonce: user.nonce})
      }
    } catch (error) {
      Logger.error(error)
    }
  }

  async digitalSign({auth,request,response}) {
    const {address, signature} = request.all()
    if (!signature || !address){
      return res
      .status(400)
        .send({ error: 'Request should have signature and publicAddress' })
      }

    try {
      const user = await User.findBy('wallet', address)
      const data = {user,signature}
      if (BlockchainService.verifyDigitalSignature(data)) {
        await auth.remember(true).login(user)
        response.send({msg: "Welcome back "})
      } 
    } catch (error) {
      Logger.error(error)
    }
  }

  async fetchBlockchainData({request, response}){
    try {
      const { txid,filehash, patient,report,allergy,immunisation,social,medication, address, signature, message, password, doctor} = request.all()
      
      const image = request.file('image')

      const jsonPatient = JSON.parse(patient)
      const reportJson = JSON.parse(report)
      const allergyJson = JSON.parse(allergy)
      const immunisationJson = JSON.parse(immunisation)
      const socialJson = JSON.parse(social)
      const medicationJson = JSON.parse(medication)


      const txidJson = JSON.parse(txid)
      const filehashJson = JSON.parse(filehash)
      const addressJson = JSON.parse(address)
      const signatureJson = JSON.parse(signature)
      const messageJson = JSON.parse(message)
      const passwordJson = JSON.parse(password)
      const doctorJson = JSON.parse(doctor)
     
     
      const data = {image, 
        patient: jsonPatient, 
        password :passwordJson,
        doctor: doctorJson,
        report: reportJson,
        allergy: allergyJson,
        immunisation: immunisationJson,
        social: socialJson,
        medication: medicationJson,
        blockchain : {
          filehash: filehashJson,
          txid:txidJson,
          filehash: filehashJson,
           address: addressJson,
           signature: signatureJson,
           message: messageJson
          }}

      const path = await PdfService.generatePDF(data, Date.now().toString())
      Logger.info(path)

      PdfService.autoDeletePdf(path)

      await BlockchainService.uploadToIPFS("public/temp/"+path).then(function(result) {
        Logger.info("FINAL IPFS HASH: " + result.hash)
        response.send({
          finalHash:result.hash,
          path
        })
      }).catch(function(error) {
        console.log("Failed!", error);
      })
      
    }catch(error){
      Logger.error(error)
    }
  }

  async newPassport({auth,request,response}) {
    try {

    if (auth.user.id) {
        const {patient,report,allergy,immunisation,social,medication,password} = request.all()
        const image = request.file('image')
        
        
        const jsonPatient = JSON.parse(patient)
        const reportJson = JSON.parse(report)
        const allergyJson = JSON.parse(allergy)
        const immunisationJson = JSON.parse(immunisation)
        const socialJson = JSON.parse(social)
        const medicationJson = JSON.parse(medication)
        const passwordJson = JSON.parse(password)


        const data = {
          image,
          patient: jsonPatient,
          report: reportJson,
          allergy: allergyJson,
          immunisation: immunisationJson,
          social: socialJson,
          password: passwordJson,
          medication : medicationJson
        }
  
        const path = await PdfService.generatePDF(data, Date.now().toString())

        PdfService.autoDeletePdf(path)

        
        await BlockchainService.uploadToIPFS("public/temp/"+path).then(function(result) {
          Logger.info("IPFS HASH: " + result.hash)
          response.send({hash:result.hash})
        }).catch(function(error) {
          console.log("Failed!", error);
        })
    }  else {
      Logger.info("Not an identified doctor")
      response.send({msg:"Not an identified doctor"})
    }
  } catch (error) {
    Logger.error(error)
  }
  }


}

module.exports = UserController
