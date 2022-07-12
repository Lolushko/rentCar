import dayjs from "dayjs"

class convert {

  isValidDate(startDate, endDate) {
    try {
      const start = dayjs(startDate, 'YYYY-MM-DD', true).isValid()
      const stop = dayjs(endDate, 'YYYY-MM-DD', true).isValid()
      if (!start) return 'invalid lease start date format, valid YYYY-MM-DD format'
      if (!stop) return 'invalid lease end date format, valid YYYY-MM-DD format'
      return true 
    } catch (err) {
      console.log('conver.date', err)
    }
  }

  date(date) {
    try {
      return dayjs(date, 'YYYY-MM-DD')
    } catch (err) {
      console.log('date', err)
    }
  }

  getDaysDif(startDate, endDate) {
    try {
      const start = this.date(startDate);
      const end = this.date(endDate);
      return end.diff(start, 'day');
    } catch (err) {
    console.log('getDayDiff', err)
    }
  }
}

export default new convert
