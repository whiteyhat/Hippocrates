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
const fs = require("fs")
const Database = use('Database')


class UserController {

  async logout({auth}) {
    try {
      await auth.logout()
    } catch (error) {
    }
  }

  async selfSovereignIdentity({auth, request,response}) {
    try {
      const {address} = request.all()

      if (!address){
      response.status(400)
        .send('Request should have signature and publicAddress')
      } 

      const user = await User.findBy('address', address)
      if (!user) {          

       const query = await Database.select('*').from('users')
       if (!query[0]) {
        const user = await User.create({address, admin:1})
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
      const user = await User.findBy('address', address)
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
      const { txid,filehash,blockNumber,timestamp, patient,report,allergy,immunisation,social,medication} = request.all()

      const data = {patient,report,allergy,immunisation,social,medication,blockchain : {filehash,blockNumber,timestamp,txid,filehash}}

      const path = await PdfService.generatePDF(data, Date.now().toString())
      Logger.info(path)
      setTimeout(function(){
        // Assuming that 'path/file.txt' is a regular file.
        fs.unlink("public/temp/"+path, (err) => {
          if (err) throw err;
          Logger.warning(path + " was self-deleted")
        });
      }, 10000);

      response.send({path})
      

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
        
        await BlockchainService.uploadToIPFS(file).then(function(nice) {
          Logger.info("IPFS HASH: " + nice)
          response.send({hash:nice})
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
