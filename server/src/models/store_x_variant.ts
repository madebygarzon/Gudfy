import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa";
import {
  Entity,
  Column,
  Index,
  JoinColumn,
  OneToMany,
  ManyToOne,
  BeforeInsert,
} from "typeorm";
import { ProductVariant } from "./product-variant";
import { Store } from "./store";
import { StoreVariantOrder } from "./store-variant-order";
import { SerialCode } from "./serial-code";
import { ProductReview } from "./product-review";
import { LineItem } from "./line-item";

@Entity()
export class StoreXVariant extends BaseEntity {
  @Column({ nullable: false })
  store_id?: string;

  @ManyToOne(() => Store, (store) => store?.store_x_variant)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ nullable: false })
  variant_id?: string;

  @ManyToOne(() => ProductVariant, (productV) => productV?.store_x_variant)
  @JoinColumn({ name: "variant_id", referencedColumnName: "id" })
  variant?: ProductVariant;

  @Column({ nullable: false })
  price?: number;

  @Column({ nullable: false })
  ammount_store?: string;

  @OneToMany(() => StoreVariantOrder, (spo) => spo?.store_variant)
  storeVariantOrder?: StoreVariantOrder[];

  @OneToMany(() => SerialCode, (sc) => sc?.store_variant)
  serial_code?: SerialCode[];

  @OneToMany(() => LineItem, (store) => store?.store_variant)
  store_line_items?: LineItem[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "store_variant_id");
  }
}
