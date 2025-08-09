import { Entity, Column, ManyToOne, CreateDateColumn, PrimaryColumn } from "typeorm";
import { Property } from "./property";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Booking {

    @PrimaryColumn('uuid')
    id: string = uuidv4();

    @ManyToOne(()=>Property, (b)=>b.bookings)
    property_id!: Property;

    @Column('string')
    user_name!: string;

    @Column('date')
    start_date!: Date;

    @Column('date')
    end_date!: Date;

    @CreateDateColumn('date')
    created_at!: Date;

    
}