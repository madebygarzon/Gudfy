import { Entity, OneToMany, OneToOne } from "typeorm";
import { Store as MedusaStore } from "@medusajs/medusa";
import { Customer } from "./customer";
import { StoreXVariant } from "./store_x_variant";
import { StoreReview } from "./store-review";
import { Wallet } from "./wallet";

@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => Customer, (customer) => customer?.store)
  members?: Customer[];

  @OneToMany(() => StoreXVariant, (store) => store?.store)
  store_x_variant?: StoreXVariant[];

  @OneToMany(() => StoreReview, (sr) => sr?.store)
  reviews?: StoreReview[];

  @OneToOne(() => Wallet, (wallet) => wallet?.store)
  wallet: Wallet;
}
