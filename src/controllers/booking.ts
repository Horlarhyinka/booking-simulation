import { AppDataSource } from "../config/db/data-source";
import catchAsyncErrors from "../lib/catchAsyncErrors";
import validator from "../lib/validator";
import { Request, Response } from "express";
import { Booking } from "../models/booking";
import { Property } from "../models/property";
import { DateTime } from "luxon";

export const createBooking = catchAsyncErrors(async(req: Request, res: Response) =>{
    const validateResponse = validator.validateBooking(req.body)
    if(validateResponse.error?.message)return res.status(400).json({message: validateResponse.error.message})
    const propertyRepository = AppDataSource.getRepository(Property)
    
    const property = await propertyRepository.findOne({where: {id: req.body.property_id}, relations: ['bookings']})
    if(!property) return res.status(404).json({message: 'Property not found.'})

    const from = DateTime.fromISO(req.body.start_date, { zone: 'utc' });
    const to = DateTime.fromISO(req.body.end_date, { zone: 'utc' });

    if (!from.isValid || !to.isValid) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }
    
    const fromDate = from.toJSDate();
    const toDate = to.toJSDate();
    const nowDate = DateTime.now().toJSDate();
    if(nowDate > fromDate)return res.status(400).json({message: 'start_date must be a future/current date'})
    if(fromDate >= toDate) return res.status(400).json({message: 'start_date must be less than end_date'})

    //check if proposed booking time falls withing available time range
    if(fromDate < property.available_from || fromDate >= property.available_to || toDate > property.available_to || toDate <= property.available_from)return res.status(400).json({message: 'This property is not available for booking at this selected time'})
    
    //now check for overlapping booking for the time
    if(property.bookings.length){
        let isAvailable = true;

        for(let i = 0; i < property.bookings.length; i++){
            const bk = property.bookings[i]
            if(bk.start_date.getTime() == fromDate.getTime()){
                isAvailable = false;
                break;
            }
            if(fromDate >= bk.start_date && fromDate <= bk.end_date){
                isAvailable = false;
                break;
            }

            if(fromDate < bk.start_date && toDate > bk.start_date){
                isAvailable = false;
                break;
            }
        }

        if(!isAvailable)return res.status(400).json({message: 'Selected date has been booked, try a different time range.'})
    }

    //at this point, we're clear
    const booking = new Booking()
    booking.user_name = req.body.user_name
    booking.start_date = fromDate
    booking.end_date = toDate
    booking.property_id = property


    const bookingRepository = AppDataSource.getRepository(Booking);
    const saved = await bookingRepository.save(booking)
    return res.status(201).json(saved)
})

export const deleteBooking = catchAsyncErrors(async(req: Request, res: Response)=>{
    const {id} = req.params;
    const bookingRepository = AppDataSource.getRepository(Booking);
    const booking = await bookingRepository.findOne({where: { id }})
    if(!booking) return res.status(404).json({message: 'Booking not found'})
    await bookingRepository.delete({id})
    return res.status(200).json(booking)
})

