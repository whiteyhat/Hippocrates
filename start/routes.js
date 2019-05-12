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
Route.on('/new-passport').render('index')
Route.get('/p', 'UserController.pdf')

Route.post('/block-data', 'UserController.fetchBlockchainData')
Route.post('/login', 'UserController.login')
Route.post('/sign', 'UserController.selfSovereignIdentity')
Route.post('/auth', 'UserController.digitalSign')
Route.post('/signup', 'UserController.signup')
Route.get('/logout', 'UserController.logout')
Route.post('/new', 'UserController.newPassport')

