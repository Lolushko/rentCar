import convert from '../dateHandler/date.js'
import db from '../dataBase/db.js'
import responseWrapper from '../wrapper/wrappers.js';
import dayjs from 'dayjs';

class rentService {
  
  calculateCost(days) {

    let end = days || days + 1;
    let total_cost = 0;

    if (days >= 18) {
      total_cost = (end - 17) * 1000 * 0.85 + this.calculateCost(17).cost;
    } else if (days >= 10) {
      total_cost = (end - 9) * 1000 * 0.9 + this.calculateCost(9).cost;
    } else if (days >= 5) {
      total_cost = (end - 4) * 1000 * 0.95 + this.calculateCost(4).cost;
    } else {
      total_cost = end * 1000;
    }

    return { 
      cost: total_cost,
      discount: parseInt(`${days * 1000 - total_cost}`)
    };
  }


  async checkCarsAvailability(startDate, endDate) {
    const validDate = (convert.isValidDate(startDate, endDate))
    if (typeof validDate === 'string') return validDate

    const cars = await db.query(
      `SELECT * FROM "car" WHERE id NOT IN(SELECT car_id FROM "rent" WHERE '${startDate} ' < end_date AND '${endDate}' > start_date)`,
    );
    return responseWrapper.responseSucces(cars.rows)
  }


  async insertRent(startDate, endDate, license_plate) {

    const validDate = (convert.isValidDate(startDate, endDate))
    if (typeof validDate === 'string') return validDate

    const difference = convert.getDaysDif(startDate, endDate);
    if (difference > 30 || difference < 1) {
      return responseWrapper.responseError('The rental session cannot be longer than 30 days and less than 1 day');
    }

    const lastAllowedRentEndDate = dayjs(startDate)
      .subtract(3, 'day')
      .format('YYYY-MM-DD');

    const endDateValid = dayjs(endDate)
      .subtract(-3, 'day')
      .format('YYYY-MM-DD')

    const cars = await db.query(
      `SELECT * FROM car WHERE id NOT IN(SELECT car_id FROM rent WHERE '${lastAllowedRentEndDate}' < end_date AND '${endDateValid}' > start_date) AND license_plate='${license_plate}'`,
    );
    if (!cars.rows[0]) {
      return responseWrapper.responseError(
        'No available cars for desired period.',
      );
    }

    const { cost, discount } = this.calculateCost(
      difference
    );
    try {
    await db.query(
        `INSERT INTO "rent" (car_id, start_date, end_date, cost)
        VALUES (${cars.rows[0].id}, '${startDate}', '${endDate}', ${cost})`,
      );
      return responseWrapper.responseSucces({ cost, discount,  });
    } catch (err) {
      return responseWrapper.responseError(
        'input data error'
      )
    }
  }

  async sendReport(month) {
    let rent;

    const startDate = dayjs(month).startOf('month').format('YYYY-MM-DD');
    const endDate = dayjs(month).endOf('month').format('YYYY-MM-DD');
    const daysInMonth = dayjs(month).daysInMonth();

    try {
      rent = await db.query(
        `SELECT start_date, end_date, license_plate FROM "rent" JOIN "car" ON "car"."id" = "rent"."car_id" WHERE '${startDate}' < end_date AND '${endDate}' > start_date`,
      );
    } catch (err) {
      console.log(err);
    }
    const rentDaysByCar = rent.rows.reduce(
      (acc, curr) => {
        let { start_date, end_date } = curr;
        const { license_plate } = curr;

        if (dayjs(start_date).format('MMMM') !== dayjs(month).format('MMMM')) {
          start_date = startDate;
        }

        if (dayjs(end_date).format('MMMM') !== dayjs(month).format('MMMM')) {
          end_date = endDate;
        }
        const days = convert.getDaysDif(start_date, end_date);
        
        !acc[license_plate]
          ? (acc[license_plate] = days)
          : (acc[license_plate] += days);

        return acc;
      },
      {},
    );
    const report = Object.entries(rentDaysByCar).reduce((acc, curr) => {
      const percent = (curr[1] / daysInMonth) * 100;
      acc[curr[0]] = { percent: `${percent.toFixed(2)}%` };
      return acc;
    }, {});
    let unusedCars;
    const usedCars = Object.keys(rentDaysByCar).map((car) => `'${car}'`);
    try {
      if (usedCars[0] !== undefined) {
      unusedCars = await db.query(
        `SELECT license_plate FROM "car" WHERE license_plate NOT IN (${usedCars})`,
      );
      } else {
        unusedCars = await db.query(
          `SELECT license_plate FROM "car"`,
        );
      }
    } catch (error) {
      console.log(error)
    }
    try {
     unusedCars.rows.forEach(car => {
        report[car.license_plate] = {
          percent: '0%',
        };
      });
      const allPercent = Object.values(report);

      const total = allPercent.reduce((acc, curr) => {
        return (acc += parseFloat(curr.percent));
      }, 0);
      return { report ,  total: `${(total / allPercent.length).toFixed(2)}%` };
  } catch (err) {
      return responseWrapper.responseError(err)
    }
  }
}

export default new rentService
