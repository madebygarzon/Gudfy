import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity, ManyToOne, BeforeInsert, JoinColumn } from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { StoreOrder } from "./store-order";
import { OrderPayments } from "./order-payments";
import { StoreVariantOrder } from "./store-variant-order";

@Entity()
export class PaymentDetail extends BaseEntity {
  @Column({ nullable: false })
  order_payments_id?: string;

  @ManyToOne(() => OrderPayments, (op) => op?.payment_detail)
  @JoinColumn({ name: "order_payments_id", referencedColumnName: "id" })
  order_payments?: OrderPayments;

  @Column({ nullable: false })
  store_variant_order_id?: string;

  @ManyToOne(() => StoreVariantOrder, (s) => s?.payment_detail)
  @JoinColumn({ name: "store_variant_order_id", referencedColumnName: "id" })
  store_variant_order?: StoreVariantOrder;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  product_price: number;

  @Column({ type: "integer", nullable: false })
  quantity: number;

  @Column({ nullable: false })
  product_name?: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "payment_detail_id_");
  }
}
