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
  OneToOne,
} from "typeorm";
import { ProductVariant } from "./product-variant";
import { Store } from "./store";
import { StoreVariantOrder } from "./store-variant-order";
import { SerialCode } from "./serial-code";
import { LineItem } from "./line-item";
import { PayMethodSeller } from "./pay-method-seller";

@Entity()
export class Wallet extends BaseEntity {
  @Column({ nullable: false })
  store_id?: string;

  @OneToOne(() => Store, (store) => store?.store_x_variant)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  available_balance?: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  outstanding_balance: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  balance_paid: number;

  @OneToMany(() => PayMethodSeller, (pms) => pms?.wallet)
  pay_method_seller?: PayMethodSeller[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "seller_waller_id");
  }
}
