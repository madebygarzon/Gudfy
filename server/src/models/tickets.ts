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
import { TicketStatus } from "./ticket-status";
import { TicketMessages } from "./ticket-messages";

@Entity()
export class Ticket extends BaseEntity {
  @Column({ nullable: false })
  status_id?: string;

  @OneToOne(() => TicketStatus, (ts) => ts?.tickets)
  @JoinColumn({ name: "status_id", referencedColumnName: "id" })
  status?: TicketStatus;

  @Column({ nullable: false })
  customer_id?: string;

  @OneToOne(() => Customer, (custo) => custo?.ticket)
  @JoinColumn({ name: "customer_id", referencedColumnName: "id" })
  customer?: Customer;

  @OneToMany(() => TicketMessages, (t) => t?.ticket)
  mesagges?: TicketMessages[];

  @Column({ type: "varchar", nullable: false })
  subject?: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ticket_id_");
  }
}
