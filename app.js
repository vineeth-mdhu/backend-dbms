const express = require('express')
const dotenv = require('dotenv')
const bodyParser=require('body-parser')
const distance_warehouse= require('./routes/distance-warehouse')
const distance_store= require('./routes/distance-store')
const distance_factory= require('./routes/distance-factory')
const delivery = require('./routes/delivery')
const test = require('./routes/test')
const cors = require('cors')
const app = express()
const port = 5000
dotenv.config()

app.use(cors())

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/distance-warehouse',distance_warehouse)

app.use('/distance-store',distance_store)

app.use('/distance-factory',distance_factory)

app.use('/delivery',delivery)

app.use('/test',test)

app.listen(process.env.PORT || 5000,process.env.YOUR_HOST || '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`)
})