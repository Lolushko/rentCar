import Router from 'express'
import serviceController from '../controller/service.controller.js'


const routerService = Router()

routerService.get('/calc', serviceController.calculation)
routerService.get('/avail', serviceController.available)
routerService.post('/rent', serviceController.rentCar)
routerService.get('/report', serviceController.report)

export default routerService