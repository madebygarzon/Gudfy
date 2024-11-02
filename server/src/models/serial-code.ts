import { BaseEntity, Customer } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/utils";
import { Column, Entity, JoinColumn, ManyToOne, BeforeInsert } from "typeorm";
import { StoreXVariant } from "./store_x_variant";
import { StoreOrder } from "./store-order";
import { StoreVariantOrder } from "./store-variant-order";

@Entity()
export class SerialCode extends BaseEntity {
  @Column({ type: "varchar", nullable: false })
  serial: string;

  @Column({ nullable: true })
  store_variant_id?: string;

  @ManyToOne(() => StoreXVariant, (sv) => sv?.serial_code)
  @JoinColumn({ name: "store_variant_id", referencedColumnName: "id" })
  store_variant?: StoreXVariant;

  @Column({ nullable: true })
  store_variant_order_id?: string;

  @ManyToOne(() => StoreVariantOrder, (svo) => svo?.serial_code)
  @JoinColumn({ name: "store_variant_order_id", referencedColumnName: "id" })
  store_variant_order?: StoreVariantOrder;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "serial_code");
  }
}
