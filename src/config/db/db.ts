
import { AppDataSource } from "./data-source";
import logger from "jet-logger";


//add connection logic
export async function connectDb(){
    try{
        await AppDataSource.initialize()
        logger.info('DB data source initialized, DB connected.')
    }catch(err){
        logger.err(`Error occured while connecting to DB: ${err}`)
        process.exit(1)
    }
}

//include any other db config in this module

