import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

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
  phone!: string;

  @Column({ nullable: true })
  avatar!: string;

  @Column({ type: 'float', default: 5.0 })
  rating!: number;

  @Column({ default: 0 })
  totalRides!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}