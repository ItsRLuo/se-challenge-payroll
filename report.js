import * as db from './db'
import { prRedis } from './utils'
const neatCsv = require('neat-csv')
const fs = require('fs')

const payTable = {
  A: 20,
  B: 30
}

export async function fetchPayRollInfo (req, res) {
  try {
    console.info('(T111) report fetched')

    // get biweekly from db
    const rawReport = await db.queryBiweeklyRecord()
    // parse the data
    const report = rawReport.rows.map(record => {
      const startDay = record.date.getDate() === 15 ? '01' : '16'
      const endDay = record.date.getDate()
      const month = record.date.getMonth() + 1 >= 10 ? record.date.getMonth() + 1 : `0${record.date.getMonth() + 1}`
      const year = record.date.getFullYear()
      return {
        employeeId: record.employee_id,
        amountPaid: `$${(Math.round(record.pay * 100) / 100).toFixed(2)}`,
        payPeriod: {
          startDate: `${year}-${month}-${startDay}`,
          endDate: `${year}-${month}-${endDay}`
        }
      }
    })
    return res.send({
      payrollReport: {
        employeeReports: report
      }
    })
  } catch (error) {
    console.error(error)
  }
  return res.sendStatus(204)
}

export async function storePayRollInfo (req, res) {
  try {
    if (req.file && req.file.path && req.file.originalname) {
      const fileNumber = req.file.originalname.split('-')[2].split('.')[0]
      const locationName = await prRedis.get(fileNumber)
      if (locationName) return res.send('File already uploaded')

      fs.readFile(req.file.path, async (err, data) => {
        if (err) {
          console.error(err)
          return res.sendStatus(204)
        }
        console.info('(T110) csv received')
        const csvArr = await neatCsv(data)

        // create format for report db insertion
        const formatedCSV = csvArr.map(record => {
          const dateArr = record.date.split('/')
          const formatedDate = new Date(null)
          formatedDate.setFullYear(dateArr[2])
          formatedDate.setMonth(dateArr[1] - 1)
          formatedDate.setDate(dateArr[0])
          return {
            employee_id: record['employee id'],
            hours_worked: record['hours worked'],
            job_group: record['job group'],
            date: formatedDate
          }
        })

        // create format for aggro_report db insertion
        const formatedAgrroCSV = csvArr.map(record => {
          const dateArr = record.date.split('/')
          const formatedDate = new Date(null)
          console.log(dateArr[1])
          formatedDate.setFullYear(dateArr[2])
          if (dateArr[0] <= 15) {
            formatedDate.setDate(15)
            formatedDate.setMonth(dateArr[1] - 1)
          } else {
            formatedDate.setMonth(dateArr[1])
            formatedDate.setDate(formatedDate.getDate() - 1)
          }
          return {
            employee_id: record['employee id'],
            pay: record['hours worked'] * payTable[record['job group']],
            date: formatedDate
          }
        })

        await db.createMutliRecord(formatedCSV, formatedAgrroCSV)
      })

      await prRedis.set(fileNumber, 'T')
      return res.send(200)
    }
  } catch (error) {
    console.error(error)
  }
  return res.sendStatus(204)
}
