'use strict'
const User = use('App/Models/User')
const Report = use('App/Models/Report')
const Allergy = use('App/Models/Allergy')
const Immunisation = use('App/Models/Immunisation')
const Social = use('App/Models/Social')
const Medication = use('App/Models/Medication')
const Patient = use('App/Models/Patient')
const PdfService = use('App/Services/PdfService')
const BlockchainService = use('App/Services/BlockchainService')
const Logger = use('Logger')
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

  async selfSovereignIdentity({auth, request,response}) {
    try {
      const {address} = request.all()

      if (!address){
      response.status(400)
        .send('Request should have signature and publicAddress')
      } 

      const user = await User.findBy('wallet', address)
      if (!user) {          

       const query = await Database.select('*').from('users')
       if (!query[0]) {
        const nonce = Math.floor(Math.random() * 10000)
        const user = await User.create({wallet: address, admin:1, nonce})
        await auth.remember(true).login(user)
      }else{
        response.send({ msg: 'Sorry, only registered users can access to Hippocrates'})
      }
      
      }else{
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
      const { txid,filehash,blockNumber,timestamp, patient,report,allergy,immunisation,social,medication, address, signature, message, password, doctor} = request.all()

      const data = {patient, password, doctor, report,allergy,immunisation,social,medication,blockchain : {filehash,blockNumber,timestamp,txid,filehash, address, signature, message}}

      const path = await PdfService.generatePDF(data, Date.now().toString())
      Logger.info(path)

      await BlockchainService.uploadToIPFS("public/temp/"+path).then(function(result) {
        Logger.info("FINAL IPFS HASH: " + result.hash)
        response.send({
          finalHash:result.hash,
          path
        })
      }).catch(function(error) {
        console.log("Failed!", error);
      })

      PdfService.autoDeletePdf(path)

      
    }catch(error){
      Logger.error(error)
    }
  }

  async newPassport({auth,request,response}) {
    try {

    if (auth.user.id) {
        const {patient,report,allergy,immunisation,social,medication} = request.all()
  
        const patien = await Patient.create({
          doctor_id: await auth.user.id,
          name: patient.name,
          dob: patient.dob,
          gender: patient.gender
        })
  
        const repor = await Report.create({
          patient_id: patien.id,
          condition: report.condition,
          year: report.year,
          notes: report.notes
        })
  
        const allerg = await Allergy.create({
          patient_id: patien.id,
          allergy: allergy.name,
          risk: allergy.risk,
          notes: allergy.notes
        })
  
        const immunisatio = await Immunisation.create({
          patient_id: patien.id,
          name: immunisation.name,
          date: immunisation.year,
        })
  
        const socia = await Social.create({
          patient_id: patien.id,
          mobility: social.mobility,
          eating: social.eating,
          dressing: social.dressing,
          toileting: social.toileting,
          washing: social.washing,
          functions: social.activity,
          behaviour: social.behaviour
        })
  
        const medicatio = await Medication.create({
          patient_id: patien.id,
          medication: medication.name,
          dose: medication.dose,
          monday: medication.monday,
          tuesday: medication.tuesday,
          wednesday: medication.wednesday,
          thursday: medication.thursday,
          friday: medication.friday,
          saturday: medication.saturday,
          sunday: medication.sunday,
          description: medication.plan
        })
  
        const data = {
          patient,
          report,
          allergy,
          immunisation,
          social,
          medication
        }
  
        // response.send({data: "wtf?"})
        const file = await PdfService.generatePDF(data, Date.now().toString())
        
        await BlockchainService.uploadToIPFS(file).then(function(result) {
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
