import { BaseEntity, Customer } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/utils";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { StoreXVariant } from "./store_x_variant";
import { StoreOrder } from "./store-order";

@Entity()
export class StoreVariantOrder extends BaseEntity {
  @Column({ nullable: false })
  store_variant_id?: string;

  @ManyToOne(
    () => StoreXVariant,
    (store_variant) => store_variant?.storeVariantOrder
  )
  @JoinColumn({ name: "store_variant_id", referencedColumnName: "id" })
  store_variant?: StoreXVariant[];

  @Column({ nullable: true })
  store_order_id?: string;

  @ManyToOne(() => StoreOrder, (so) => so?.storeVariantOrder)
  @JoinColumn({ name: "store_order_id", referencedColumnName: "id" })
  store_order?: StoreOrder[];

  @Column({ nullable: false })
  quantity?: number;

  @Column({ nullable: true })
  total_price?: number;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "store_variant_order_id");
  }
}
