import { BaseEntity } from "@medusajs/medusa";
import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { Customer } from "./customer";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity()
export class SellerApplication extends BaseEntity {
  @Column({ type: "integer", nullable: false })
  customer_id: string;

  @ManyToOne(() => Customer, (customer) => customer.sellerapplication)
  @JoinColumn({ name: "customer_id", referencedColumnName: "id" })
  customer: Customer;

  @Column({ type: "integer", nullable: false })
  identification_number: number;

  @Column({ type: "varchar", nullable: false })
  address: string;

  @Column({ type: "boolean", nullable: false })
  approved: boolean;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "appli");
  }
}
