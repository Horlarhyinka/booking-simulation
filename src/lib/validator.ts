
import Joi from 'joi'

class Validator{
    validateProperty(payload: any){
        return Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            price_per_night: Joi.number().required(),
            available_from: Joi.string().required(),
            available_to: Joi.string().required(),
            
        }).validate(payload)
    }

    validateBooking(payload: any) {
        return Joi.object({
            user_name: Joi.string().required(),
            property_id: Joi.string().required(),
            start_date: Joi.string().required(),
            end_date: Joi.string().required(),
        }).validate(payload)
    }
}

export default Object.freeze(new Validator())