import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity, OneToMany } from "typeorm";

import { StoreOrder } from "./store-order";

@Entity()
export class PayMethodGudfy extends BaseEntity {
  @Column({ nullable: false })
  method?: string;

  @OneToMany(() => StoreOrder, (so) => so?.pay_method)
  store_order?: StoreOrder[];
}
