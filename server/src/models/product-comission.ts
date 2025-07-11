import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { Product } from "./product";
import { generateEntityId } from "@medusajs/medusa";

@Entity()
export class ProductComission {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  percentage: number;

  @OneToMany(() => Product, (product) => product.product_comission)
  products?: Product[];

   @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "comission_id");
    }
}
