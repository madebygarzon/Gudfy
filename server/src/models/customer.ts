import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Customer as MedusaCustomer } from "@medusajs/medusa";
import { Store } from "./store";
import { SellerApplication } from "./seller-application";
import { CustomerRole } from "./customer-role";
import { StoreOrder } from "./store-order";
import { OrderClaim } from "./order-claim";
import { ClaimComment } from "./claim-comment";
import { NotificationGudfy } from "./notification-gudfy";
import { Ticket } from "./tickets";

@Entity()
export class Customer extends MedusaCustomer {
  @Index("CustomerStoreId")
  @Column({ type: "varchar", nullable: true })
  store_id?: string;

  @ManyToOne(() => Store, (store) => store.members)
  @JoinColumn({ name: "store_id", referencedColumnName: "id" })
  store?: Store;

  @Column({ nullable: true })
  role_id?: number;

  @ManyToOne(() => CustomerRole, (role) => role.customers)
  @JoinColumn({ name: "role_id" })
  customerRole?: CustomerRole;

  @OneToOne(() => SellerApplication, (seller) => seller?.customer)
  sellerapplications?: SellerApplication[];

  @OneToOne(() => StoreOrder, (custo) => custo?.customer)
  customerorder?: SellerApplication[];

  @OneToMany(() => OrderClaim, (claim) => claim?.customer)
  claim?: OrderClaim[];

  @OneToMany(() => ClaimComment, (claim) => claim?.customer)
  comments?: ClaimComment[];

  @OneToMany(() => NotificationGudfy, (noti) => noti?.customer)
  notifications_gudfy?: NotificationGudfy[];

  @OneToMany(() => Ticket, (t) => t?.customer)
  ticket?: Ticket[];
}
