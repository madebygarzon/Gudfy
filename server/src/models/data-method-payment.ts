import { BaseEntity, generateEntityId } from "@medusajs/medusa";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { StoreOrder } from "./store-order";


@Entity()
export class DataMethodPayment extends BaseEntity {
  @Column({ nullable: false })
  order_id: string;

  @ManyToOne(() => StoreOrder, (so) => so?.data_method_payments)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  store_order?: StoreOrder;

  @Column({ nullable: true })
  coinpal?: string;

  @BeforeInsert()
    private beforeInsert(): void {
      this.id = generateEntityId(this.id, "data_method_payment");
    }
}
