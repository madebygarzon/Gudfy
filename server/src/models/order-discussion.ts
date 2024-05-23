import { BaseEntity } from "@medusajs/medusa";
import {
  Column,
  Entity,
  ManyToOne,
  BeforeInsert,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { StoreOrder } from "./store-order";

@Entity()
export class OrderDiscussion extends BaseEntity {
  @Column({ nullable: true })
  store_order_id?: string;

  @OneToOne(() => StoreOrder, (os) => os?.discussion)
  @JoinColumn({ name: "order_id", referencedColumnName: "id" })
  store_order?: StoreOrder;

  @Column({ nullable: true })
  comment?: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "oreder_discussion");
  }
}
