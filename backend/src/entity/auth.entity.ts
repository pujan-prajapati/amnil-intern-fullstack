import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Cart } from "./cart.entity";
import { Order } from "./order.entity";

enum Role {
  ADMIN = "admin",
  USER = "user",
}

@Entity("auth")
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false,
    length: 100,
    unique: true,
  })
  username: string;

  @Column({
    nullable: false,
    unique: true,
    length: 100,
  })
  email: string;

  @Column({
    nullable: true,
  })
  password: string;

  @Column({
    nullable: true,
    length: 15,
  })
  phone: string;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Column({
    nullable: false,
  })
  avatar: string;

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  carts: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @Column({
    nullable: true,
  })
  googleId: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @Column({
    nullable: true,
  })
  otp: number;

  @Column({
    nullable: true,
    type: "bigint",
  })
  otpExpiry: number;

  @Column({ default: 0 })
  failedLoginAttempts: number;

  @Column({ default: false })
  isLocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
