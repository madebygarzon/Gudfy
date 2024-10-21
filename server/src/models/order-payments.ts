import { BaseEntity } from "@medusajs/medusa";
import {
  Column,
  Entity,
  ManyToOne,
  BeforeInsert,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { StoreOrder } from "./store-order";
import { Store } from "./store";
import { PaymentDetail } from "./payment-detail";

@Entity()
export class OrderPayments extends BaseEntity {
  @Column({ nullable: true })
  store_id?: string;

  @ManyToOne(() => Store, (s) => s?.order_payments)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  amount_paid: number;

  @Column({ type: "varchar" })
  payment_note: string;

  @Column({ type: "varchar" })
  voucher: string;

  @Column({ type: "varchar" })
  customer_name: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  subtotal: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  commission: number;

  @OneToMany(() => PaymentDetail, (pd) => pd?.order_payments)
  payment_detail: PaymentDetail[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "oreder_payments_id_");
  }
}
