import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Auth } from "./auth.entity";
import { CartItem } from "./cartItem.entity";

@Entity("cart")
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: 0 })
  totalPrice: number;

  @ManyToOne(() => Auth, (user) => user.carts, { onDelete: "CASCADE" })
  user: Auth;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  items: CartItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
