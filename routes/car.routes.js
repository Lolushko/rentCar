import Router from 'express'
import carController from '../controller/car.controller.js'

const routerCar = Router()


routerCar.post('/car', carController.creatCar)
routerCar.delete('/car/:id', carController.deleteCar)


export default routerCar