import { Entity, Column, ManyToOne, CreateDateColumn, PrimaryColumn } from "typeorm";
import { Property } from "./property";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Booking {

    @PrimaryColumn()
    id: string = uuidv4();

    @ManyToOne(()=>Property, (b)=>b.bookings)
    property_id!: Property;

    @Column()
    user_name!: string;

    @Column()
    start_date!: Date;

    @Column()
    end_date!: Date;

    @CreateDateColumn()
    created_at!: Date;

    
}