import dotenv from 'dotenv';

dotenv.config()
export const envVars = {
    PORT: process.env.PORT!,
    HOST: process.env.HOST!,
    DB_TYPE: process.env.DB_TYPE! as 'postgres' | 'mysql' | 'sqlite',
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: parseInt(process.env.DB_PORT!),
    DB_USERNAME: process.env.DB_USERNAME!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_NAME: process.env.DB_NAME!,

}