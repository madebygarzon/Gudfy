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
export class SellerApplication extends BaseEntity {
  @Column({ type: "varchar", nullable: false })
  customer_id: string;

  @OneToOne(() => Customer, (customer) => customer.sellerapplications)
  @JoinColumn({ name: "customer_id", referencedColumnName: "id" })
  customer: Customer;

  @Column({ type: "varchar", nullable: false })
  application_data_id: string;

  @OneToOne(() => ApplicationData, (appliData) => appliData.sellerapplication)
  @JoinColumn({ name: "application_data_id", referencedColumnName: "id" })
  application_data: ApplicationData;

  @Column({ type: "varchar", nullable: false })
  state_application_id: string;

  @ManyToOne(
    () => StateApplication,
    (stateAppli) => stateAppli.sellerapplication
  )
  @JoinColumn({ name: "state_application_id", referencedColumnName: "id" })
  state_application: StateApplication;

  @Column({ type: "varchar", nullable: false })
  role_seller: string;

  @Column({ type: "varchar", nullable: true })
  comment_status: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "appli");
  }
}
