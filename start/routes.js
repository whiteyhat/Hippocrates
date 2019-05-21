'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')
Route.get('/admin', 'UserController.admin').middleware(['isAdmin:auth'])
Route.on('/profile').render('profile').middleware(['auth'])
Route.get('/staff', 'UserController.staff').middleware(['auth'])
Route.on('/new-passport').render('index').middleware(['auth'])

Route.post('/delete', 'UserController.deleteAccount')
Route.post('/create-new', 'UserController.createUser')
Route.post('/block-data', 'UserController.fetchBlockchainData')
Route.post('/login', 'UserController.login')
Route.post('/edit', 'UserController.edit')
Route.post('/sign', 'UserController.selfSovereignIdentity')
Route.post('/auth', 'UserController.digitalSign')
Route.post('/signup', 'UserController.signup')
Route.post('/logout', 'UserController.logout')
Route.post('/new', 'UserController.newPassport')
Route.post('/doctor-demo', 'UserController.demoDoctor')
Route.post('/admin-demo', 'UserController.demoAdmin')