import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Customer as MedusaCustomer } from "@medusajs/medusa";
import { Store } from "./store";
import { SellerApplication } from "./seller-application";
import { CustomerRole } from "./customer-role";

@Entity()
export class Customer extends MedusaCustomer {
  @Index("CustomerStoreId")
  @Column({ nullable: true })
  store_id?: string;

  @ManyToOne(() => Store, (store) => store.members)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ nullable: true })
  role_id?: number;

  @ManyToOne(() => CustomerRole)
  @JoinColumn({ name: "role_id" })
  customerRole?: CustomerRole;

  @OneToMany(() => SellerApplication, (appli) => appli.customer)
  sellerapplication?: SellerApplication[];
}
