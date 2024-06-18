import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { LineItem as MedusaLineItem } from "@medusajs/medusa";
import { Store } from "./store";

@Entity()
export class LineItem extends MedusaLineItem {
  @Column({ type: "varchar", nullable: true })
  store_id?: string;

  @ManyToOne(() => Store, (store) => store.store_line_items)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;
}
