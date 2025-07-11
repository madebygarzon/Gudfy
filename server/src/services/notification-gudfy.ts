import {
  EventBusService,
  TransactionBaseService,
  Customer,
} from "@medusajs/medusa";
import { NotificationGudfyRepository } from "../repositories/notification-gudfy";
import RequestProductRepository from "../repositories/request-product";
import { SellerApplicationRepository } from "../repositories/seller-application";
import { io } from "../websocket";
import { OrderClaimRepository } from "../repositories/order-claim";
import TicketsRepository from "../repositories/tickets";
import { StoreRepository } from "../repositories/store";

export default class NotificationGudfyService extends TransactionBaseService {
  protected readonly notificationGudfyRepository_: typeof NotificationGudfyRepository;
  protected readonly requestProductRepository_: typeof RequestProductRepository;
  protected readonly sellerApplicationRepository_: typeof SellerApplicationRepository;
  protected readonly eventBusService_: EventBusService;
  protected readonly loggedInCustomer_: Customer | null;
  protected readonly orderClaimRepository_: typeof OrderClaimRepository;
  protected readonly ticketsRepository_: typeof TicketsRepository;
  protected readonly storeRepository_: typeof StoreRepository;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.requestProductRepository_ = container.requestProductRepository;
    this.notificationGudfyRepository_ = container.notificationGudfyRepository;
    this.sellerApplicationRepository_ = container.sellerApplicationRepository;
    this.eventBusService_ = container.eventBusService;
    this.orderClaimRepository_ = container.orderClaimRepository;
    this.ticketsRepository_ = container.ticketsRepository;
    this.storeRepository_ = container.storeRepository;
  }

  async createNotification(customer_id, notification_type_id, order_claim_id) {
    const repoNotification = this.activeManager_.withRepository(
      this.notificationGudfyRepository_
    );

    const newNotification = await repoNotification.create({
      order_claim_id,
      customer_id,
      notification_type_id,
      seen_status: true,
    });
    const saveNotificaction = await repoNotification.save(newNotification);

    this.retriverNotification(saveNotificaction.customer_id);

    return newNotification;
  }

  async retriverNotification(idCustomer) {
    const repoNotification = this.activeManager_.withRepository(
      this.notificationGudfyRepository_
    );

    const listNotification = await repoNotification.find({
      where: {
        customer_id: idCustomer,
        seen_status: true,
      },
    });

    return listNotification;
  }

  async retriverNotificationAdmin() {
    const repoNotification = this.activeManager_.withRepository(
      this.notificationGudfyRepository_
    );

    const listNotification = await repoNotification.find({
      where: {
        notification_type_id: "NOTI_CLAIM_ADMIN_ID",
        seen_status: true,
      },
    });

    return listNotification;
  }

  async updateStateNotification(id, state) {
    const repoNotification = this.activeManager_.withRepository(
      this.notificationGudfyRepository_
    );
    await repoNotification.update(id, {
      seen_status: state,
    });
    io.emit("new_notification", {});
  }

  async getNotificatioDashboarAdmin() {
    try {
      const repoReqPro = this.activeManager_.withRepository(
        this.requestProductRepository_
      );
      const sellerApplicationRepository = this.activeManager_.withRepository(
        this.sellerApplicationRepository_
      );
      const TicketRepository = this.activeManager_.withRepository(
        this.ticketsRepository_
      );
  
      const repoOrderClaim = this.activeManager_.withRepository(
        this.orderClaimRepository_
      );
  
      const repoStore = this.activeManager_.withRepository(
        this.storeRepository_
      );
  
      //============================================================================
      //                        Lista de solicitudes de productos
      //============================================================================
      const listAllReqProd = await repoReqPro
        .createQueryBuilder("rp")
        .innerJoinAndSelect("rp.customer", "c")
        .innerJoinAndSelect("c.store", "s")
        .where("rp.status = :status", { status: "C" })
        .select([
          "rp.id AS request_id",
          "rp.customer_id AS seller_id",
          "rp.product_title AS product_title",
          "rp.product_image AS product_image",
          "rp.description AS description",
          "rp.variants AS variants",
          "rp.approved AS approved",
          "rp.created_at AS created_at",
          "rp.status AS status",
          "rp.note AS note",
          "s.name AS store_name ",
          "c.email AS customer_email",
          "s.id AS store_id",
        ])
        .getRawMany();
      //============================================================================
  
      //============================================================================
      //                          Solicitud de vendedor
      //============================================================================
  
      const getList = await sellerApplicationRepository.find({
        where: [{ state_application_id: "C" }, { state_application_id: "E" }],
      });
      //============================================================================
  
  
  //============================================================================
  //                          Reclamos
  //============================================================================
  
  
  const listClaim = await repoOrderClaim
    .createQueryBuilder("oc")
    .leftJoinAndSelect("oc.store_variant_order", "svo")
    .leftJoinAndSelect("oc.status_order_claim", "soc")
    .leftJoinAndSelect("oc.customer", "c")
    .leftJoinAndSelect("svo.store_variant", "sxv")
    .leftJoinAndSelect("sxv.store", "s")
    .leftJoinAndSelect("sxv.variant", "v")
    .where("oc.status_order_claim_id = :status", { status: "UNSOLVED_ID" })
    .select([
      "oc.id AS id",
      "soc.status AS status_order_claim",
      "oc.created_at AS created_at",
      "svo.quantity AS quantity",
      "svo.store_order_id AS number_order",
      "svo.unit_price AS price_unit",
      "s.name AS store_name",
      "v.title AS product_name",
      "c.first_name AS customer_name",
      "c.last_name AS customer_last_name",
      "c.email AS customer_email",
    ])
    .getRawMany();
  //============================================================================
     
  //============================================================================
  //                          Tickets
  //============================================================================
  const listTikets = await TicketRepository.createQueryBuilder("t")
  .innerJoinAndSelect("t.customer", "c")
  .innerJoinAndSelect("t.status", "s")
  .where("t.status_id = :status", { status: "OPEN_ID" })
  .select([
    "t.id AS id",
    "t.subject AS subject",
    "s.status AS status",
    "c.first_name AS first_name",
    "c.last_name AS last_name",
    "t.created_at AS created_at",
  ])
  .orderBy("t.created_at", "DESC")
  .getRawMany();
  //============================================================================

  const listStore = await repoStore.find({
    where: [{ payment_request: true }],
  });



  const dataNotificationDashboardAdmin = {
        NotifiReqProd: listAllReqProd.length ? true : false,
        NotifiSellerApplication: getList.length ? true : false,
        NotifiClaim: listClaim.length ? true : false,
        NotifiTicket: listTikets.length ? true : false,
        NotifiStore: listStore.length ? true : false,
      };
    

      return dataNotificationDashboardAdmin;
      
    } catch (error) {
      console.log("Error al obtener las notificaciones del panl administrativo", error);
      return null;
    }
    
  }
}
