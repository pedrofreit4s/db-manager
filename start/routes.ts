/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/', 'AuthController.authenticate')
    Route.post('/register', 'AuthController.store')
    Route.put('/active/:token', 'AuthController.activeAccount')
  }).prefix('/auth')
  Route.group(() => {
    Route.group(() => {
      Route.get('/recover', 'AccountsController.recover')
    }).prefix('/account')
    Route.group(() => {
      Route.get('/', 'DatabasesController.list')
      Route.post('/', 'DatabasesController.store')

      Route.post('/users', 'DatabasesController.createUser')
      Route.delete('/users/:id', 'DatabasesController.deleteUser')
    }).prefix('/database')
  }).middleware('auth')
}).prefix('/v1')
