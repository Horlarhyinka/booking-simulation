import { AppDataSource } from "../config/db/data-source";
import catchAsyncErrors from "../lib/catchAsyncErrors";
import validator from "../lib/validator";
import { Request, Response } from "express";
import { Booking } from "../models/booking";
import { Property } from "../models/property";

export const createBooking = catchAsyncErrors(async(req: Request, res: Response) =>{
    const validateResponse = validator.validateBooking(req.body)
    if(validateResponse.error?.message)return res.status(400).json({message: validateResponse.error.message})
    const propertyRepository = AppDataSource.getRepository(Property)
    const bookingRepository = AppDataSource.getRepository(Booking);
    
})

// export const cancelBooking =

