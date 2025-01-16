import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity, ManyToOne, JoinColumn, BeforeInsert } from "typeorm";
import { generateEntityId } from "@medusajs/utils";
import { OrderClaim } from "./order-claim";
import { Customer } from "./customer";
import { CommentOwner } from "./comment-owner";

@Entity()
export class ClaimComment extends BaseEntity {
  @Column({ type: "text", nullable: false })
  comment: string;

  @Column({ nullable: true })
  customer_id?: string;

  @Column({ type: "varchar", nullable: true })
  image: string;

  @ManyToOne(() => Customer, (orderClaim) => orderClaim.comments)
  @JoinColumn({ name: "customer_id", referencedColumnName: "id" })
  customer?: Customer;

  @Column({ nullable: true })
  comment_owner_id?: string;

  @ManyToOne(() => CommentOwner, (orderClaim) => orderClaim.claim_comment)
  @JoinColumn({ name: "comment_owner_id", referencedColumnName: "id" })
  comment_owner?: CommentOwner;

  @Column({ nullable: true })
  order_claim_id?: string;

  @ManyToOne(() => OrderClaim, (orderClaim) => orderClaim.comments)
  @JoinColumn({ name: "order_claim_id", referencedColumnName: "id" })
  order_claim?: OrderClaim;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "claimcom");
  }
}
