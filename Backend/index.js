import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"
import session from "express-session"
// import ส่วนที่ติดตั้งเข้ามา
import swaggerUI from "swagger-ui-express"
import yaml from "yaml"
// ใช้ File
import fs from "fs"


import productRoute from './routes/productRoute.js'
import brandRoute from './routes/brandRoute.js'
import typeRoute from './routes/typeRoute.js'
import memRoute from './routes/memRoute.js'
import cartRoute from './routes/cartRoute.js'
import orderRoute from './routes/orderRoute.js'
import adminRoute from './routes/adminRoute.js'

dotenv.config()

const app = express()
const port = process.env.PORT
app.use(bodyParser.json())
app.use(cors({
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

const thesecret = process.env.SECRET
app.use(session({
    secret: thesecret,
    resave: false,
    saveUninitialized: true
}))

app.use(productRoute)
app.use(brandRoute)
app.use(typeRoute)
app.use(memRoute)
app.use(cartRoute)
app.use(orderRoute)
app.use(adminRoute)
const swaggerfile = fs.readFileSync('services/APIdocument.yaml', 'utf-8')
const swaggerDoc = yaml.parse(swaggerfile)
// กำหนด path ที่จะให้เรียกหน้า Document ขึ้นมา
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})