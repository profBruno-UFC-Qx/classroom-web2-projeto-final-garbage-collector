import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Vehicle } from "./Vehicle";
import { RideRequest } from "./RideRequest";

export type RideStatus = 'open' | 'full' | 'cancelled' | 'finished';

@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  origin!: string;

  @Column()
  destination!: string;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'time' })
  time!: string;

  @Column()
  seats!: number;

  @Column({ nullable: true })
  observation?: string; 

  @ManyToOne(() => User, (user) => user.ridesAsDriver)
  @JoinColumn({ name: "driverId" })
  driver!: User;

  @Column()
  driverId!: number;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: "vehicleId" })
  vehicle!: Vehicle;

  @Column()
  vehicleId!: number;

  @Column({
    type: "varchar",
    default: "open"
  })
  status!: RideStatus;

  @OneToMany(() => RideRequest, (request) => request.ride)
  requests!: RideRequest[];

  @CreateDateColumn()
  createdAt!: Date;
}