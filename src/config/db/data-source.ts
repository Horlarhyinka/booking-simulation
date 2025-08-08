import {DataSource} from 'typeorm'
import { envVars } from '../envvars'
import { Property } from '../../models/property'
import { Booking } from '../../models/booking'
export const AppDataSource = new DataSource({
    type: envVars.DB_TYPE,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [Property, Booking],
    subscribers: [],
    migrations: [],
})