import * as report from './report'

const express = require('express')
const multer = require('multer')

const upload = multer({ dest: 'tmp/csv/' })
const app = express()

const bodyParser = require('body-parser')

const port = 3000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const APICODE = {
  T110: { value: 'csv received', color: '\x1b[34m' },
  T111: { value: 'report fetched', color: '\x1b[34m' }
}
console.infoCopy = console.info.bind(console)
console.info = function (data) {
  const timestamp = `Info: {${new Date()}}: `
  let textColor = '%s'
  try {
    if (data.slice(1, 5) in APICODE) {
      textColor = `${APICODE[data.slice(1, 5)].color}%s\x1b[0m`
    }
  } catch (error) {
    console.error(error)
  }
  this.infoCopy(textColor, timestamp + data + '\n')
}

app.get('/health', async (req, res) => {
  return res.sendStatus(200)
})

app.post('/csv', upload.single('data'), async (req, res) => { return report.storePayRollInfo(req, res) })

app.get('/report', async (req, res) => { return report.fetchPayRollInfo(req, res) })

app.listen(port, () => console.info(`listening on port ${port}!`))
