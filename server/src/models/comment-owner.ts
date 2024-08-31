import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity, OneToMany } from "typeorm";
import { ClaimComment } from "./claim-comment";

@Entity()
export class CommentOwner extends BaseEntity {
  @Column({ nullable: false })
  owner?: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => ClaimComment, (oc) => oc?.comment_owner)
  claim_comment?: ClaimComment[];
}
