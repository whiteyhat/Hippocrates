'use strict'
const User = use('App/Models/User')
const Report = use('App/Models/Report')
const Allergy = use('App/Models/Allergy')
const Immunisation = use('App/Models/Immunisation')
const Social = use('App/Models/Social')
const Medication = use('App/Models/Medicaton')

const Logger = use('Logger')

class UserController {

    async autologin ({ auth, view }) {
        try {
          await auth.check()
          return view.render('welcome')
        } catch (error) {
            await auth.check()
          return view.render('welcome')
        }
      }

    async login ({ auth, request, response }) {
        try {
            const { email, password } = request.all()
            await auth.attempt(email, password)
        
            return response.send('Logged in successfully' ) 
        } catch (error) {
            console.log(error)
        }
       
      }

      async signup ({ auth, request }) {
          try {
            const { email, password } = request.all()
            console.log(email)
            console.log(password)
            const user = await User.create({email, password })
            await auth.attempt(email, password)
            await auth.login(user)    
            return 'User created successfully'
          } catch (error) {
              console.log(error)
          }
        
      }

      async newPassport ({ auth, request, response }) {
        try {
          const {patient, report, allergy, immunisation, social, medication} = request.all()
          const user = await User.create({email, password })
          await auth.attempt(email, password)
          await auth.login(user)    
          return 'User created successfully'
        } catch (error) {
            console.log(error)
        }
      
    }


}

module.exports = UserController
