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

import { Customer } from "./customer";
import { Ticket } from "./tickets";

@Entity()
export class TicketStatus extends BaseEntity {
  @Column({ type: "varchar", nullable: false })
  status: string;

  @Column({ type: "varchar", nullable: false })
  description: string;

  @OneToMany(() => Ticket, (t) => t?.status)
  tickets?: Ticket[];
}
