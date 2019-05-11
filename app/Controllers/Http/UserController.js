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


class UserController {

  async autologin({
    auth,
    view
  }) {
    try {
      await auth.check()
      return view.render('welcome')
    } catch (error) {
      await auth.check()
      return view.render('welcome')
    }
  }

  async login({
    auth,
    request,
    response
  }) {
    try {
      const {
        email,
        password
      } = request.all()
      await auth.attempt(email, password)

      return response.send('Logged in successfully')
    } catch (error) {
      Logger.error(error)
    }

  }

  async signup({
    auth,
    request
  }) {
    try {
      const {
        email,
        password
      } = request.all()

      const user = await User.create({
        email,
        password
      })
      await auth.attempt(email, password)
      return 'User created successfully'
    } catch (error) {
      Logger.error(error)
    }

  }

  async fetchBlockchainData({request}){
    try {
      const { blockHash,blockNumber,timestamp,confirmations} = request.all()

      Logger.info(blockHash)
      Logger.info(blockNumber)
      Logger.info(timestamp)
      Logger.info(confirmations)

    }catch(error){
      Logger.error(error)
    }
  }

  async newPassport({
    auth,
    request,
    response
  }) {
    try {
      const {
        patient,
        report,
        allergy,
        immunisation,
        social,
        medication
      } = request.all()

      // const patien = await Patient.create({
      //   doctor_id: await auth.user.id,
      //   name: patient.name,
      //   dob: patient.dob,
      //   gender: patient.gender
      // })

      // const repor = await Report.create({
      //   patient_id: patien.id,
      //   condition: report.condition,
      //   year: report.year,
      //   notes: report.notes
      // })

      // const allerg = await Allergy.create({
      //   patient_id: patien.id,
      //   allergy: allergy.name,
      //   risk: allergy.risk,
      //   notes: allergy.notes
      // })

      // const immunisatio = await Immunisation.create({
      //   patient_id: patien.id,
      //   name: immunisation.name,
      //   date: immunisation.year,
      // })

      // const socia = await Social.create({
      //   patient_id: patien.id,
      //   mobility: social.mobility,
      //   eating: social.eating,
      //   dressing: social.dressing,
      //   toileting: social.toileting,
      //   washing: social.washing,
      //   functions: social.activity,
      //   behaviour: social.behaviour
      // })

      // const medicatio = await Medication.create({
      //   patient_id: patien.id,
      //   medication: medication.name,
      //   dose: medication.dose,
      //   monday: medication.monday,
      //   tuesday: medication.tuesday,
      //   wednesday: medication.wednesday,
      //   thursday: medication.thursday,
      //   friday: medication.friday,
      //   saturday: medication.saturday,
      //   sunday: medication.sunday,
      //   description: medication.plan
      // })

      const data = {
        patient,
        report,
        allergy,
        immunisation,
        social,
        medication
      }
      await PdfService.generatePDF(data)
    } catch (error) {
      Logger.error(error)
    }

  }


}

module.exports = UserController
