import {Property} from '../models/property'
import { AppDataSource } from '../config/db/data-source'
import catchAsyncErrors from '../lib/catchAsyncErrors'
import { Request, Response } from 'express';
import validator from '../lib/validator';
import { Booking } from '../models/booking';
import { DateTime } from 'luxon';

export const addProperty = catchAsyncErrors(async(req: Request, res: Response)=>{
    const valRes = validator.validateProperty(req.body)
    if(valRes.error?.message){
        res.status(400).json({message: valRes.error.message})
        return
    }

    const from = DateTime.fromISO(req.body.available_from, { zone: 'utc' });
    const to = DateTime.fromISO(req.body.available_to, { zone: 'utc' });

    if (!from.isValid || !to.isValid) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    const availableFromDate = from.toJSDate();
    const availableToDate = to.toJSDate();


    if(!availableFromDate)return res.status(400).json({message: 'available from date is not valid'})
    if(!availableToDate)return res.status(400).json({message: 'available to date is not valid'})

    if(availableFromDate >= availableToDate)return res.status(400).json({message: 'Available to date must be greater than Available from date'})
    const property = new Property()
    const payload = req.body
    property.title = payload.title
    property.description = payload.description
    property.available_from = availableFromDate
    property.available_to = availableToDate
    console.log({availableFromDate, availableToDate})
    property.price_per_night = payload.price_per_night
    const propertyRepository = AppDataSource.getRepository(Property)
    const saved = await propertyRepository.save(property)
    return res.status(201).json(saved)

})

export const getProperties = catchAsyncErrors(async(req: Request, res: Response)=>{
    const {available_on} = req.query;
    const page = Number(req.query.page) ?? 1
    const size = Number(req.query.size) ?? 10
    const propertyRepository = AppDataSource.getRepository(Property)
    if(available_on){
        const parsedAvailableOn = Date.parse(available_on.toString())
        const availableOnDate = new Date(parsedAvailableOn)
        const [properties, totalCount] = await propertyRepository.createQueryBuilder("property")
            .leftJoinAndSelect("property.bookings", "booking")
            .where("property.available_from <= :availableOnDate", { availableOnDate })
            .andWhere("property.available_to >= :availableOnDate", { availableOnDate })
            .skip(size * (page - 1))
            .take(size)
            .getManyAndCount();

        return res.status(200).json({ page, size, data: properties, total: totalCount });

    }else{
        const properties = await propertyRepository.find({ skip: size * (page - 1), take: size, relations: ['bookings'] })
        const totalCount = await propertyRepository.count()
        return res.status(200).json({page, size, data: properties, total: totalCount})
    }

})


export const getPropertyAvailability = catchAsyncErrors(async(req: Request, res: Response)=>{
    const {id} = req.params;
    const propertyRepository = AppDataSource.getRepository(Property)
    
    const property = await propertyRepository.findOne({ where: { id }, relations: ['bookings']})
    if(!property)return res.status(404).json({message: 'Property not found'})
    //check if available date range has not passed
    const nowDate = new Date()

    nowDate.setHours(0) //remove time factors so as to match db date and ease comparison
    nowDate.setMinutes(0)
    nowDate.setMilliseconds(0)

    if(nowDate >= property.available_to)return res.status(200).json([])
    if(!property.bookings.length){
        if(property.available_from > nowDate) return res.status(200).json([{from: property.available_from, to: property.available_to}])
        return res.status(200).json([{ from: nowDate, to: property.available_to }])
    }else{
        let last_start: Date = nowDate > property.available_from? nowDate: property.available_from
        let last_stop: Date = last_start
        const availability_range: {to: Date, from: Date}[] = []
        const sorted_bookings = [...property.bookings].sort((a,b)=>a.start_date.getTime() - b.start_date.getTime())
        for(let i = 0; i < sorted_bookings.length; i++){
            const booking = sorted_bookings[i]
            if(last_stop.getTime() != booking.start_date.getTime() && i != sorted_bookings.length -1){ //this prevents repetition of consecutive bookings in the range e.g [{from: 01-01-2025, to: 02-01-2025}, {from: 02-01-2025, to: 03-01-2025}, ]  instead of simply [{from: 01-01-2025, to: 03-01-2025}, ]
                last_stop = booking.end_date
                continue;
            }
            availability_range.push({from: last_start, to: last_stop})
        }
        return res.status(200).json(availability_range)
    }
    
})


