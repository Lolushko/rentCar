import carService from "../create/car.create.js"

class carController {
  async creatCar(req, res) {
    try {
    const { name, license_plate } = req.body
    res.json(await carService.create(name, license_plate))
    } catch (err) {
      console.log('CREARE CAR',err)
    }
   }
  async deleteCar(req, res) {
    try {
    const id = req.params.id
    const car = carService.delete(id)
    res.json(car.rows) 
    } catch (err) {
      console.log('DELETE CAR', err)
    }
  }
}

export default new carController()

