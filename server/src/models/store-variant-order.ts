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
import { OrderClaim } from "./order-claim";
import { OrderStatus } from "./order-state";
import { PaymentDetail } from "./payment-detail";
import { SerialCode } from "./serial-code";

@Entity()
export class StoreVariantOrder extends BaseEntity {
  @Column({ nullable: false })
  store_variant_id?: string;

  @ManyToOne(
    () => StoreXVariant,
    (store_variant) => store_variant?.storeVariantOrder
  )
  @JoinColumn({ name: "store_variant_id", referencedColumnName: "id" })
  store_variant?: StoreXVariant;

  @Column({ nullable: true })
  store_order_id?: string;

  @ManyToOne(() => StoreOrder, (so) => so?.storeVariantOrder)
  @JoinColumn({ name: "store_order_id", referencedColumnName: "id" })
  store_order?: StoreOrder;

  @Column({ nullable: false })
  variant_order_status_id?: string;

  @ManyToOne(() => OrderStatus, (os) => os?.store_variant_order)
  @JoinColumn({ name: "variant_order_status_id", referencedColumnName: "id" })
  variant_order_status?: OrderStatus;

  @Column({ nullable: false })
  quantity?: number;

  @Column({ nullable: true })
  total_price?: number;

  @OneToMany(() => OrderClaim, (claim) => claim?.store_variant_order)
  claim?: OrderClaim[];

  @OneToMany(() => PaymentDetail, (pd) => pd?.store_variant_order)
  payment_detail: PaymentDetail[];

  @OneToMany(() => SerialCode, (sc) => sc?.store_variant_order)
  serial_code?: SerialCode[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "store_variant_order_id");
  }
}
