import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Vehicle } from "./Vehicle";
import { RideRequest } from "./RideRequest";

@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  origin!: string;

  @Column()
  destination!: string;

  @Column()
  date!: string;

  @Column()
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

  @Column({ default: 'open' })
  status!: string;

  @OneToMany(() => RideRequest, (request) => request.ride)
  requests!: RideRequest[];

  @CreateDateColumn()
  createdAt!: Date;
}