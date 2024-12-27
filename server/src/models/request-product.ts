import { BaseEntity } from "@medusajs/medusa";
import {
  Column,
  Entity,
  Index,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToOne,
} from "typeorm";
import { Customer } from "./customer";
import { ApplicationData } from "./application-data";
import { StateApplication } from "./state-application";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity()
export class RequestProduct extends BaseEntity {
  @Column({ type: "varchar", nullable: false })
  customer_id: string;

  @OneToOne(() => Customer, (customer) => customer.request_product)
  @JoinColumn({ name: "customer_id", referencedColumnName: "id" })
  customer: Customer;

  @Column({ type: "varchar", nullable: false })
  product_title: string;

  @Column({ type: "varchar", nullable: false })
  product_image: string;

  @Column({ type: "varchar", nullable: false })
  description: string;

  @Column({ type: "varchar", nullable: true })
  variants: string;

  @Column({ type: "boolean", nullable: true })
  approved: boolean;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "request_product_id");
  }
}
