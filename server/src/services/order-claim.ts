import { Lifetime } from "awilix";
import { LessThan } from "typeorm";
import {
  AdminPostCollectionsCollectionReq,
  TransactionBaseService,
  EventBusService,
} from "@medusajs/medusa";
import { OrderClaimRepository } from "../repositories/order-claim";
import { ClaimCommentRepository } from "../repositories/claim-comment";
import { NotificationGudfyRepository } from "../repositories/notification-gudfy";
import StoreVariantOrderRepository from "../repositories/store-variant-order";
import StoreOrderRepository from "../repositories/store-order";
import { io } from "../websocket";
import {
  EmailCreateClaimOrderCustomer,
  EmailCreateClaimOrderSeller,
  EmailOrderClaimAdmin,
} from "../admin/components/email/claim-order";

class OrderClaimService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly orderClaimRepository_: typeof OrderClaimRepository;
  protected readonly claimCommentRepository_: typeof ClaimCommentRepository;
  protected readonly notificationGudfyRepository_: typeof NotificationGudfyRepository;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly storeOrderRepository_: typeof StoreOrderRepository;

  protected readonly eventBusService_: EventBusService;

  // protected readonly commentOwnerRepository_: typeof ClaimCommentRepository;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.orderClaimRepository_ = container.orderClaimRepository;
    this.claimCommentRepository_ = container.claimCommentRepository;
    this.notificationGudfyRepository_ = container.notificationGudfyRepository;
    this.storeVariantOrderRepository_ = container.storeVariantOrderRepository;
    this.storeOrderRepository_ = container.storeOrderRepository;

    this.eventBusService_ = container.eventBusService;
  }

  async addClaim(claim, idCustoemr, image) {
    try {
      const repoOrderClaim = this.activeManager_.withRepository(
        this.orderClaimRepository_
      );
      const repoStoreVariantOrder = this.activeManager_.withRepository(
        this.storeVariantOrderRepository_
      );
      const repoNotification = this.activeManager_.withRepository(
        this.notificationGudfyRepository_
      );

      const add = await repoOrderClaim.create({
        store_variant_order_id: claim.store_variant_order_id,
        customer_id: idCustoemr,
        status_order_claim_id: "OPEN_ID",
      });
      const claimSave = await repoOrderClaim.save(add);

      await this.addComment(
        {
          comment: claim.comment,
          comment_owner_id: "COMMENT_CUSTOMER_ID",
          order_claim_id: claimSave.id,
          customer_id: idCustoemr,
        },
        image
      );

      const selecSeller = await repoStoreVariantOrder
        .createQueryBuilder("svo")
        .leftJoinAndSelect("svo.store_variant", "sxv")
        .innerJoinAndSelect("svo.store_order", "so")
        .innerJoinAndSelect("so.customer", "cus")
        .leftJoinAndSelect("sxv.store", "s")
        .leftJoinAndSelect("s.members", "c")
        .where("svo.id = :store_variant_order_id", {
          store_variant_order_id: claim.store_variant_order_id,
        })
        .select([
          "c.id AS seller_id",
          "s.name AS store_name",
          "c.email AS seller_email",
          "so.id AS order_id",
          "cus.first_name AS customer_name",
          "cus.last_name AS customer_last_name",
          "cus.email AS customer_email",
        ])
        .getRawMany();

      const newNotification = await repoNotification.create({
        order_claim_id: claimSave.id,
        customer_id: selecSeller[0].seller_id,
        notification_type_id: "NOTI_CLAIM_SELLER_ID",
        seen_status: true,
      });
      const saveNoti = await repoNotification.save(newNotification);

      await repoStoreVariantOrder.update(claim.store_variant_order_id, {
        variant_order_status_id: "Discussion_ID",
      });

      await EmailCreateClaimOrderCustomer({
        order_id: selecSeller[0].order_id,
        customer_name:
          selecSeller[0].customer_name +
          " " +
          selecSeller[0].customer_last_name,

        customer_email: selecSeller[0].customer_email,
      });

      await EmailCreateClaimOrderSeller({
        order_id: selecSeller[0].order_id,
        seller_email: selecSeller[0].seller_email,
        store_name: selecSeller[0].store_name,
      });

      io.emit("new_notification", {
        customer_id: selecSeller[0].seller_id,
        notification: saveNoti,
      });
    } catch (error) {
      console.log("error en la addicion de la reclamacion", error);
    }
  }

  async retriverListClaimAdmin() {
    try {
      const repoOrderClaim = this.activeManager_.withRepository(
        this.orderClaimRepository_
      );

      const listClaim = await repoOrderClaim
        .createQueryBuilder("oc")
        .leftJoinAndSelect("oc.store_variant_order", "svo")
        .leftJoinAndSelect("oc.status_order_claim", "soc")
        .leftJoinAndSelect("oc.customer", "c")
        .leftJoinAndSelect("svo.store_variant", "sxv")
        .leftJoinAndSelect("sxv.store", "s")
        .leftJoinAndSelect("sxv.variant", "v")
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
        .orderBy("oc.created_at", "DESC")
        .getRawMany();

      return listClaim;
    } catch (error) {
      console.log(
        "error en la obtencion de la lista de reclamaciones en el servicio",
        error
      );
    }
  }

  async retriveListClaimCustomer(idCustomer) {
    const repoOrderClaim = this.activeManager_.withRepository(
      this.orderClaimRepository_
    );
    const listClaim = await repoOrderClaim
      .createQueryBuilder("oc")
      .leftJoinAndSelect("oc.store_variant_order", "svo")
      .leftJoinAndSelect("svo.store_variant", "sxv")
      .leftJoinAndSelect("sxv.store", "s")
      .leftJoinAndSelect("sxv.variant", "v")
      .where("oc.customer_id = :customer_id", { customer_id: idCustomer })
      .select([
        "oc.id AS id",
        "oc.status_order_claim_id AS status_order_claim_id",
        "oc.created_at AS created_at",
        "svo.quantity AS quantity",
        "svo.store_order_id AS number_order",
        "svo.unit_price AS price_unit",
        "s.name AS store_name",
        "v.title AS product_name",
      ])
      .orderBy("oc.created_at", "DESC")
      .getRawMany();

    return listClaim;
  }

  async retriveListClaimSeller(idStore) {
    const repoOrderClaim = this.activeManager_.withRepository(
      this.orderClaimRepository_
    );

    const listClaim = await repoOrderClaim
      .createQueryBuilder("oc")
      .leftJoinAndSelect("oc.store_variant_order", "svo")
      .leftJoinAndSelect("svo.store_variant", "sxv")
      .leftJoinAndSelect("sxv.store", "s")
      .leftJoinAndSelect("sxv.variant", "v")
      .where("s.id = :store_id", { store_id: idStore })
      .select([
        "oc.id AS id",
        "oc.status_order_claim_id AS status_order_claim_id",
        "oc.created_at AS created_at",
        "svo.quantity AS quantity",
        "svo.store_order_id AS number_order",
        "svo.unit_price AS price_unit",
        "s.name AS store_name",
        "v.title AS product_name",
      ])
      .orderBy("oc.created_at", "DESC")
      .getRawMany();

    return listClaim;
  }

  async addComment(dataComment, image) {
    const repoClaimComment = this.activeManager_.withRepository(
      this.claimCommentRepository_
    );

    const createComment = await repoClaimComment.create({
      comment: dataComment.comment,
      comment_owner_id: dataComment.comment_owner_id,
      order_claim_id: dataComment.order_claim_id,
      customer_id: dataComment.customer_id,
      image: image?.path
        ? `${
            process.env.BACKEND_URL ?? `http://localhost:${
              process.env.BACKEND_PORT ?? 9000
            }`
          }/${image.path}`
        : null,
    });

    const saveClaimComment = await repoClaimComment.save(createComment);
    await this.addNotification(
      dataComment.order_claim_id,
      dataComment.comment_owner_id
    );
    io.emit("new_comment", {
      order_claim_id: dataComment.order_claim_id,
    });
  }

  async retriverClaimComments(idOrderClaim) {
    const repoClaimComment = this.activeManager_.withRepository(
      this.claimCommentRepository_
    );

    const listClaimCommnets = await repoClaimComment.find({
      where: { order_claim_id: idOrderClaim },
    });

    return listClaimCommnets;
  }

  async updateClaimStatus(idClaim, status) {
   
    try {
      const repoOrderClaim = this.activeManager_.withRepository(
        this.orderClaimRepository_
      );
      const repoNotification = this.activeManager_.withRepository(
        this.notificationGudfyRepository_
      );
      const repoStoreVariantOrder = this.activeManager_.withRepository(
        this.storeVariantOrderRepository_
      );
  
      const dataClaim = await repoOrderClaim
        .createQueryBuilder("oc")
        .innerJoinAndSelect("oc.store_variant_order", "svo")
        .innerJoinAndSelect("oc.customer", "c")
        .innerJoinAndSelect("svo.store_variant", "sv")
        .innerJoinAndSelect("sv.variant", "pv")
        .innerJoinAndSelect("sv.store", "s")
        .where("oc.id = :id", { id: idClaim })
        .select([
          "pv.title AS product_name",
          "c.first_name AS customer_name",
          "c.last_name AS customer_last_name",
          "s.name AS store_name",
        ])
        .getRawMany();
  
      if (status == "UNSOLVED_ID") {
        const update = await repoOrderClaim.update(idClaim, {
          status_order_claim_id: status,
        });
  
        const newNotification = await repoNotification.create({
          order_claim_id: idClaim,
          notification_type_id: "NOTI_CLAIM_ADMIN_ID",
          seen_status: true,
        });
  
        await repoNotification.save(newNotification);
  
        await EmailOrderClaimAdmin({
          product_name: dataClaim[0].product_name,
          customer_name:
            dataClaim[0].customer_name + " " + dataClaim[0].customer_last_name,
          store_name: dataClaim[0].store_name,
        });
      }
      if (status == "CANCEL_ID") {
        //estado de la reclamacion si es CANCEL_ID significa que se cierra la reclamacion
        //  y su estado pasa a finalizado
        
        const updateCla = await repoOrderClaim.update(idClaim, {
          status_order_claim_id: status,
        });
  
        const getClaim = await repoOrderClaim.findOne({
          where: {
            id: idClaim,
          },
        });
        const svo = await repoStoreVariantOrder.findOne({
          where: {
            id: getClaim.store_variant_order_id,
          },
        });
  
        const update = await repoStoreVariantOrder.update(svo.id, {
          variant_order_status_id: "Finished_ID",
        });
        if (update) this.validateOrderreadyToComplete(svo.store_order_id);
      }
      
    } catch (error) {
      console.log("error en la actualizacion de la reclamacion", error);
    }
    
  }

  async validateOrderreadyToComplete(store_order_id) {
    const repoStoreOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );

    const repoStoreVariantOrder = this.activeManager_.withRepository(
      this.storeVariantOrderRepository_
    );

    const getClamis = await repoStoreVariantOrder.find({
      where: {
        store_order_id: store_order_id,
        variant_order_status_id: "Discussion_ID",
      },
    });

    if (!getClamis.length) {
      await repoStoreOrder.update(store_order_id, {
        order_status_id: "Completed_ID",
      });
      await this.validateOrderreadyToFinished(store_order_id);
    }
  }

  async listProductsInClaim(idStore) {
    const repoOrderClaim = this.activeManager_.withRepository(
      this.orderClaimRepository_
    );

    const listProductInClame = await repoOrderClaim
      .createQueryBuilder("oc")
      .leftJoinAndSelect("oc.store_variant_order", "svo")
      .where("svo.store_order_id = :store_order_id", {
        store_order_id: idStore,
      })
      .select(["svo.id "])
      .getRawMany();

    return listProductInClame.map((e) => e.id);
  }

  private async addNotification(idOrderClaim, CommentOwner) {
    const repoOrderClaim = this.activeManager_.withRepository(
      this.orderClaimRepository_
    );
    const repoNotification = this.activeManager_.withRepository(
      this.notificationGudfyRepository_
    );

    // Obtener la lista de reclamaciones
    const listClaim = await repoOrderClaim
      .createQueryBuilder("oc")
      .leftJoinAndSelect("oc.store_variant_order", "svo")
      .leftJoinAndSelect("svo.store_variant", "sxv")
      .leftJoinAndSelect("sxv.store", "s")
      .leftJoinAndSelect("sxv.variant", "v")
      .leftJoinAndSelect("oc.customer", "c")
      .where("oc.id = :order_claim_id", { order_claim_id: idOrderClaim })
      .select(["c.id AS customer_id", "s.id AS store_id"])
      .getRawMany();

    const notificationType =
      CommentOwner === "COMMENT_STORE_ID"
        ? "NOTI_CLAIM_CUSTOMER_ID"
        : "NOTI_CLAIM_SELLER_ID";

    const retriever = await repoNotification.findOne({
      where: {
        order_claim_id: idOrderClaim,
        notification_type_id: notificationType,
      },
    });

    if (retriever) {
      // Actualizar notificación existente
      await repoNotification.update(retriever.id, { seen_status: true });
    } else if (CommentOwner === "COMMENT_STORE_ID") {
      // Crear nueva notificación solo si el dueño del comentario es la tienda
      const createNotifica = await repoNotification.create({
        order_claim_id: idOrderClaim,
        customer_id: listClaim[0].customer_id,
        notification_type_id: "NOTI_CLAIM_CUSTOMER_ID",
        seen_status: true,
      });
      await repoNotification.save(createNotifica);
    }
    io.emit("new_notification");
  }

  async validateOrderreadyToFinished(store_order_id) {
    const repoStoreOrder = this.activeManager_.withRepository(
      this.storeOrderRepository_
    );

    const repoStoreVariantOrder = this.activeManager_.withRepository(
      this.storeVariantOrderRepository_
    );

    const getClamis = await repoStoreVariantOrder.find({
      where: {
        store_order_id: store_order_id,
        variant_order_status_id: "Completed_ID",
      },
    });

    if (!getClamis.length) {
      await repoStoreOrder.update(store_order_id, {
        order_status_id: "Finished_ID",
      });
    }
  }
}

export default OrderClaimService;
