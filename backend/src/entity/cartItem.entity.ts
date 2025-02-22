import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "./product.entity";

@Entity("cart_item")
export class CartItem extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: "CASCADE",
  })
  product: Product;

  @Column({ type: "int", default: 1 })
  quantity: number;

  @Column({
    type: "int",
    default: 0,
  })
  price: number;
}
