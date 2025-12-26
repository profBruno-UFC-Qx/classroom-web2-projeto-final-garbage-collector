import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Vehicle } from "./Vehicle";
import { Ride } from "./Ride";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number; 

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'passageiro' })
  role!: string;

  @Column({ nullable: true })
  phone?: string; 

  @Column({ nullable: true })
  avatar?: string;

  @Column({ type: 'float', default: 5.0 })
  rating!: number;

  @Column({ default: 0 })
  totalRides!: number;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehicles!: Vehicle[];

  @OneToMany(() => Ride, (ride) => ride.driver)
  ridesAsDriver!: Ride[];

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  showPhone!: boolean;

  @Column({ default: true })
  emailNotifications!: boolean; 

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}