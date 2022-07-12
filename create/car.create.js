import db from '../dataBase/db.js'

class carServise {
  async create(name, license_plate) {
    try {
      console.log(name, license_plate)
      const newCar = await db.query(`INSERT INTO car (name, license_plate) values ($1, $2) RETURNING *` , [name, license_plate])
      return newCar.rows
    } catch (err) {
      console.log(err)
      return err
    }
  }

  async delete(id) {
    try {
    await db.query(`DELETE FROM car where id = $1`, [id])
    } catch (err) {
      console.log(err)
      return err
    }
  }
}



export default new carServise()