import express from 'express';
import swaggerui from 'swagger-ui-express';
import http from 'http';
import logger from 'jet-logger'
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectDb } from './config/db/db';
import swaggerSpec from './config/swagger';
import { envVars } from './config/envvars';

import propertyRouter from './routes/properties';
import bookingRouter from './routes/bookings';

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
}))
app.use(helmet())

app.use('/api/docs', swaggerui.serve, swaggerui.setup(swaggerSpec));
app.use('/api/properties', propertyRouter)
app.use('/api/bookings', bookingRouter)

async function start(){
    try{
    //ensure db is connected before starting server
    await connectDb()
    const server = http.createServer(app)
    server.listen(envVars.PORT, ()=>{
        logger.info(`server running on port ${(server.address() as {port: number}).port}...`)
    })
    }catch(err){
        logger.err(`Unable to start server: ${err}`)
    }
}


start()