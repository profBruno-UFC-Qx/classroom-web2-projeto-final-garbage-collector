import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column()
  color!: string;

  @Column({ unique: true })
  plate!: string;

  @ManyToOne(() => User, (user) => user.vehicles)
  user!: User;

  @Column()
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;
}