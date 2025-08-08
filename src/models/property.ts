import { Entity, Column, OneToMany, CreateDateColumn, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { Booking } from "./booking";


@Entity()
export class Property{
    @PrimaryColumn()
    id: string = uuidv4();

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column()
    price_per_night!: string;

    @Column()
    available_from!: Date;

    @Column()
    available_to!: Date;

    @OneToMany(()=>Booking, (b)=>b.property_id)
    bookings!: Booking[];

    @CreateDateColumn()
    created_at!: Date;
}

