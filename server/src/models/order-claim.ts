import { BaseEntity } from "@medusajs/medusa";
import {
  Column,
  Entity,
  ManyToOne,
  BeforeInsert,
  JoinColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { StoreOrder } from "./store-order";
import { StoreVariantOrder } from "./store-variant-order";
import { Customer } from "./customer";
import { ClaimComment } from "./claim-comment";

@Entity()
export class OrderClaim extends BaseEntity {
  @Column({ nullable: true })
  store_variant_order_id?: string;

  @ManyToOne(() => StoreVariantOrder, (os) => os?.claim)
  @JoinColumn({ name: "store_variant_order_id", referencedColumnName: "id" })
  store_variant_order?: StoreOrder;

  @Column({ nullable: true })
  customer_id?: string;

  @ManyToOne(() => Customer, (os) => os?.claim)
  @JoinColumn({ name: "customer_id", referencedColumnName: "id" })
  customer?: Customer;

  @Column({ type: "boolean", nullable: false })
  status_claim: boolean;

  @OneToMany(() => ClaimComment, (comment) => comment?.order_claim)
  comments?: OrderClaim[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "oreder_claim");
  }
}
