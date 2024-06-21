import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { LineItem as MedusaLineItem } from "@medusajs/medusa";
import { StoreXVariant } from "./store_x_variant";

@Entity()
export class LineItem extends MedusaLineItem {
  @Column({ type: "varchar", nullable: true })
  store_variant_id?: string;

  @ManyToOne(() => StoreXVariant, (store) => store.store_line_items)
  @JoinColumn({ name: "store_variant_id", referencedColumnName: "id" })
  store_variant?: StoreXVariant;
}
