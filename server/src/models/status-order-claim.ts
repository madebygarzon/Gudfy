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
import { OrderClaim } from "./order-claim";

@Entity()
export class StatusOrderClaim extends BaseEntity {
  @Column({ type: "varchar", nullable: false })
  status: string;

  @Column({ type: "varchar", nullable: false })
  description: string;

  @OneToMany(() => OrderClaim, (claim) => claim?.status_order_claim)
  order_claim?: OrderClaim[];
}
