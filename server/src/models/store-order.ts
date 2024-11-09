import { BaseEntity } from "@medusajs/medusa";
// import { generateEntityId } from "@medusajs/utils";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { StoreVariantOrder } from "./store-variant-order";
import { Customer } from "./customer";
import { PayMethodGudfy } from "./pay-method-gudfy";
import { OrderStatus } from "./order-state";
import { OrderClaim } from "./order-claim";
import { StoreReview } from "./store-review";

@Entity()
export class StoreOrder extends BaseEntity {
  @Column({ nullable: true })
  customer_id?: string;

  @ManyToOne(() => Customer, (os) => os?.customerorder)
  @JoinColumn({ name: "customer_id", referencedColumnName: "id" })
  customer?: Customer[];

  @Column({ nullable: true })
  pay_method_id?: string;

  @ManyToOne(() => PayMethodGudfy, (pay) => pay?.store_order)
  @JoinColumn({ name: "pay_method_id", referencedColumnName: "id" })
  pay_method?: PayMethodGudfy[];

  @Column({ nullable: false })
  order_status_id?: string;

  @ManyToOne(() => OrderStatus, (os) => os?.store_order)
  @JoinColumn({ name: "order_status_id", referencedColumnName: "id" })
  order_status?: OrderStatus;

  @Column({ nullable: false })
  quantity_products?: number;

  @Column({ nullable: false })
  total_price?: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  contry?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  phone?: string;

  @OneToMany(() => StoreVariantOrder, (spo) => spo?.store_order)
  storeVariantOrder?: StoreVariantOrder[];

  @OneToMany(() => StoreReview, (sr) => sr?.store_order_id)
  storeReviws?: StoreReview[];
}
