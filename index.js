import express from 'express'
import routerCar from './routes/car.routes.js'
import routerService from './routes/servise.routes.js'

const PORT = process.env.PORT || 8080

const app = express()

app.use(express.json())

app.use('/api', routerCar)
app.use('/api', routerService)

app.listen(PORT, () => console.log(`Server started port on ${PORT}`))
