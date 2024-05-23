import { Entity, OneToMany } from "typeorm";
import { ProductVariant as MedusaProductVariant } from "@medusajs/medusa";
import { SerialCode } from "./serial-code";
import { StoreXVariant } from "./store_x_variant";
@Entity()
export class ProductVariant extends MedusaProductVariant {
  @OneToMany(() => StoreXVariant, (spo) => spo?.variant)
  store_x_variant?: StoreXVariant[];
}
