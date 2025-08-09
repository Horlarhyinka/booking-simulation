import { Entity, Column, OneToMany, CreateDateColumn, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { Booking } from "./booking";


@Entity()
export class Property{
    @PrimaryColumn('uuid')
    id: string = uuidv4();

    @Column('string')
    title!: string;

    @Column('string')
    description!: string;

    @Column('float')
    price_per_night!: string;

    @Column('date')
    available_from!: Date;

    @Column('date')
    available_to!: Date;

    @OneToMany(()=>Booking, (b)=>b.property_id)
    bookings!: Booking[];

    @CreateDateColumn('date')
    created_at!: Date;
}

