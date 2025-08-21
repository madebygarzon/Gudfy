import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  BeforeInsert,
  JoinColumn,
} from "typeorm";
import { Product } from "./product";
import { generateEntityId } from "@medusajs/medusa";
import { StoreXVariant } from "./store_x_variant";
import { BaseEntity } from "@medusajs/medusa";

@Entity()
export class ProductNotificate extends BaseEntity {
 
  @Column({ type: "integer" })
  stock_notificate: number;

  @Column({ type: "boolean" })
  activate: boolean;

  @Column({ type: "varchar" })
  store_x_variant_id: string;

  @OneToOne(() => StoreXVariant, (store_x_variant) => store_x_variant.product_notificate)
  @JoinColumn({ name: "store_x_variant_id", referencedColumnName: "id" })
  store_x_variant?: StoreXVariant;

   @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "product_notificate_id");
    }
}
