import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { SellerApplication } from "./seller-application";

@Entity()
export class StateApplication extends BaseEntity {
  @Column({ type: "varchar", nullable: false })
  state: string;

  @Column({ type: "varchar", nullable: true })
  description: string;

  @OneToMany(() => SellerApplication, (seller) => seller?.state_application)
  sellerapplication?: SellerApplication;
}
