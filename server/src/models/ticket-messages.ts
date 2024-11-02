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
import { CommentOwner } from "./comment-owner";
import { Ticket } from "./tickets";

@Entity()
export class TicketMessages extends BaseEntity {
  @Column({ nullable: false })
  ticket_id?: string;

  @OneToOne(() => Ticket, (ts) => ts?.mesagges)
  @JoinColumn({ name: "ticket_id", referencedColumnName: "id" })
  ticket?: Ticket;

  @Column({ nullable: false })
  owner_id?: string;

  @OneToOne(() => CommentOwner, (ts) => ts?.ticket_message)
  @JoinColumn({ name: "owner_id", referencedColumnName: "id" })
  owner?: CommentOwner;

  @Column({ type: "text", nullable: true })
  message: string;

  @Column({ type: "varchar", nullable: true })
  image: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ticket_message_id_");
  }
}
