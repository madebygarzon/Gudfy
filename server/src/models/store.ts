import { Entity, OneToMany } from "typeorm";
import { Store as MedusaStore } from "@medusajs/medusa";
import { Customer } from "./customer";
import { StoreXVariant } from "./store_x_variant";
import { ProductReview } from "./product-review";

@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => Customer, (customer) => customer?.store)
  members?: Customer[];

  @OneToMany(() => StoreXVariant, (store) => store?.store)
  store_x_variant?: StoreXVariant[];

  @OneToMany(() => ProductReview, (customer) => customer?.store)
  reviews?: ProductReview[];
}
