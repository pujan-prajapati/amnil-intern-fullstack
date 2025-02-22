import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("product")
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  description: string;

  @Column({
    type: "int",
    nullable: false,
  })
  price: number;

  @Column({
    type: "text",
    array: true,
    nullable: false,
  })
  images: string[];

  @Column({
    nullable: false,
  })
  category: string;

  @Column({
    type: "int",
    nullable: false,
  })
  quantity: number;

  @Column({
    default: 0,
  })
  views: number;

  @Column({
    default: 0,
  })
  reviews: number;

  @Column({
    default: 0,
  })
  likes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
