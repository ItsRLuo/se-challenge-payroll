const { Pool } = require('pg')
const sql = require('sql')

const pool = new Pool({
  user: 'pr',
  host: 'pr-postgres',
  database: 'pr',
  password: 'prapi',
  port: 5432
})

sql.setDialect('postgres')

const Record = sql.define({
  name: 'records',
  columns: [
    'employee_id',
    'hours_worked',
    'job_group',
    'date'
  ]
})

const AggroRecord = sql.define({
  name: 'aggro_records',
  columns: [
    'employee_id',
    'pay',
    'date'
  ]
})

export async function createMutliRecord (arr, aggroArr) {
  // should do transaction here

  const query1 = Record.insert(arr).toQuery()

  aggroArr.map(value => {
    const query2 = AggroRecord.insert(value).toQuery()
    query2.text += 'on conflict (employee_id, date) do update set pay = excluded.pay + aggro_records.pay'
    pool.query(query2)
  })

  return pool.query(query1)
}

export async function queryBiweeklyRecord () {
  const query1 = AggroRecord.select().from(AggroRecord).order('employee_id', 'date').toQuery()
  return pool.query(query1)
}
