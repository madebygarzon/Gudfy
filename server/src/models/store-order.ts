import { BaseEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/utils";
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
import { OrderDiscussion } from "./order-discussion";

@Entity()
export class StoreOrder extends BaseEntity {
  @Column({ nullable: false })
  seller_id?: string;

  @ManyToOne(() => Customer, (seller) => seller?.sellerorder)
  @JoinColumn({ name: "seller_id", referencedColumnName: "id" })
  seller?: Customer[];

  @Column({ nullable: false })
  customer_id?: string;

  @ManyToOne(() => Customer, (os) => os?.customerorder)
  @JoinColumn({ name: "customer_id", referencedColumnName: "id" })
  customer?: Customer[];

  @Column({ nullable: false })
  pay_method_id?: string;

  @ManyToOne(() => PayMethodGudfy, (pay) => pay?.store_order)
  @JoinColumn({ name: "pay_method_id", referencedColumnName: "id" })
  pay_method?: PayMethodGudfy[];

  @Column({ nullable: false })
  order_status_id?: string;

  @ManyToOne(() => OrderStatus, (os) => os?.store_order)
  @JoinColumn({ name: "order_status_id", referencedColumnName: "id" })
  order_status?: OrderStatus[];

  @Column({ nullable: true })
  SellerApproved?: boolean;

  @Column({ nullable: true })
  CustomerApproved?: boolean;

  @Column({ nullable: true })
  quantity_products?: number;

  @Column({ nullable: true })
  total_price?: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  conty?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  phone?: string;

  @OneToMany(() => StoreVariantOrder, (spo) => spo?.store_order)
  storeVariantOrder?: StoreVariantOrder[];

  @OneToMany(() => OrderDiscussion, (spo) => spo?.store_order)
  discussion?: OrderDiscussion[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "store_order_id");
  }
}
