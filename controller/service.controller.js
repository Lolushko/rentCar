import rentService from "../service/rentService.js"
import convert from "../dateHandler/date.js"

class serviceController {
  
  calculation(req, res) {
    try {
    const { startDate, endDate } = req.body
    const answer = rentService.calculateCost(convert.getDaysDif(startDate, endDate))
    res.json(answer)
    } catch (err) {
      console.log('CALCULATION', err)
    }
  }

  async available(req, res) {
    try {
      const {startDate, endDate} = req.body
      const answer = await rentService.checkCarsAvailability(startDate, endDate)
      res.json(answer)
    } catch (err) {
      console.log('AVAILABLE', err)
    }
  }

  async rentCar(req, res) {
    try {
      const { startDate, endDate, license_plate } = req.body
      console.log(startDate, endDate,license_plate)
      const answer = await rentService.insertRent(startDate, endDate, license_plate)
      res.json(answer)
    } catch (err) {
      console.log('RENTCAR',err)
    }
  }

  async report(req, res) {
    try {
      const { month } = req.body
      const ansver = await rentService.sendReport(month)
      res.json(ansver)
    } catch (err) {
      console.log('REPORT', err)
    }
  }

}


export default new serviceController


