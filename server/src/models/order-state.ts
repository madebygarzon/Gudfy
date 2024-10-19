import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity, OneToMany } from "typeorm";
import { StoreVariantOrder } from "./store-variant-order";
import { StoreOrder } from "./store-order";

@Entity()
export class OrderStatus extends BaseEntity {
  @Column({ nullable: false })
  state?: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => StoreOrder, (sl) => sl?.order_status)
  store_order?: StoreOrder[];

  @OneToMany(() => StoreVariantOrder, (svo) => svo?.variant_order_status)
  store_variant_order?: StoreVariantOrder[];
}
