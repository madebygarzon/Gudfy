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
import { NotificationGudfy } from "./notification-gudfy";

@Entity()
export class NotificationType extends BaseEntity {
  @Column({ type: "varchar", nullable: false })
  type: string;

  @Column({ type: "varchar", nullable: false })
  description: string;

  @OneToMany(() => NotificationGudfy, (claim) => claim?.notification_type)
  notifications?: NotificationGudfy[];
}
