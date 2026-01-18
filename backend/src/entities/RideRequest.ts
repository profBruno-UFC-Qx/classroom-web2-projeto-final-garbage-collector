import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Ride } from "./Ride";

export type RideRequestStatus = 'pending' | 'approved' | 'rejected' | 'left';

@Entity()
export class RideRequest {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Ride, (ride) => ride.requests)
  @JoinColumn({ name: "rideId" })
  ride!: Ride;

  @Column()
  rideId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "passengerId" })
  passenger!: User;

  @Column()
  passengerId!: number;

  @Column({
    type: "varchar",
    default: "pending"
  })
  status!: RideRequestStatus;

  @CreateDateColumn()
  createdAt!: Date;
}