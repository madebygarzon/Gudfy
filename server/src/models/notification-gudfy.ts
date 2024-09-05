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
import { NotificationType } from "./notification-type";
import { Customer } from "./customer";

@Entity()
export class NotificationGudfy extends BaseEntity {
  @Column({ nullable: true })
  order_claim_id?: string;

  @ManyToOne(() => OrderClaim, (oc) => oc?.notifications)
  @JoinColumn({ name: "order_claim_id", referencedColumnName: "id" })
  order_claim?: OrderClaim;

  @Column({ nullable: false })
  notification_type_id?: string;

  @ManyToOne(() => NotificationType, (oc) => oc?.notifications)
  @JoinColumn({ name: "order_claim_id", referencedColumnName: "id" })
  notification_type?: NotificationType;

  @Column({ nullable: true })
  customer_id?: string;

  @ManyToOne(() => Customer, (os) => os?.claim)
  @JoinColumn({ name: "customer_id", referencedColumnName: "id" })
  customer?: Customer;

  @Column({ nullable: false })
  seen_status: boolean;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "notification_gudfy_");
  }
}
