import { BaseEntity } from "@medusajs/medusa";
import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Entity()
export class CustomerRole extends BaseEntity {
  @Index("CustomerRoleId")
  @Column({ nullable: false })
  role_id: number;

  @Column({ type: "varchar", nullable: false })
  nameRole: string;
}
