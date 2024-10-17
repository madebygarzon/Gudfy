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
import StoreVariantOrderRepository from "src/repositories/store-variant-order";
import { io } from "../websocket";

class OrderClaimService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly orderClaimRepository_: typeof OrderClaimRepository;
  protected readonly claimCommentRepository_: typeof ClaimCommentRepository;
  protected readonly notificationGudfyRepository_: typeof NotificationGudfyRepository;
  protected readonly storeVariantOrderRepository_: typeof StoreVariantOrderRepository;
  protected readonly eventBusService_: EventBusService;

  // protected readonly commentOwnerRepository_: typeof ClaimCommentRepository;

  constructor(container) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.orderClaimRepository_ = container.orderClaimRepository;
    this.claimCommentRepository_ = container.claimCommentRepository;
    this.notificationGudfyRepository_ = container.notificationGudfyRepository;
    this.storeVariantOrderRepository_ = container.storeVariantOrderRepository;
    this.eventBusService_ = container.eventBusService;
  }

  async addClaim(claim, idCustoemr) {
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

    await this.addComment({
      comment: claim.comment,
      comment_owner_id: "COMMENT_CUSTOMER_ID",
      order_claim_id: claimSave.id,
      customer_id: idCustoemr,
    });

    const selecSeller = await repoStoreVariantOrder
      .createQueryBuilder("svo")
      .leftJoinAndSelect("svo.store_variant", "sxv")
      .leftJoinAndSelect("sxv.store", "s")
      .leftJoinAndSelect("s.members", "c")
      .where("svo.id = :store_variant_order_id", {
        store_variant_order_id: claim.store_variant_order_id,
      })
      .select(["c.id AS seller_id"])
      .getRawMany();

    const newNotification = await repoNotification.create({
      order_claim_id: claimSave.id,
      customer_id: selecSeller[0].seller_id,
      notification_type_id: "NOTI_CLAIM_SELLER_ID",
      seen_status: true,
    });
    await repoNotification.save(newNotification);

    io.emit("new_notification", {
      customer_id: selecSeller[0].seller_id,
      notification: repoNotification,
    });
  }

  async retriverListClaimAdmin() {
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
        "sxv.price AS price_unit",
        "s.name AS store_name",
        "v.title AS product_name",
        "c.first_name AS customer_name",
        "c.last_name AS customer_last_name",
        "c.email AS customer_email",
      ])
      .getRawMany();
    return listClaim;
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
        "sxv.price AS price_unit",
        "s.name AS store_name",
        "v.title AS product_name",
      ])
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
      .leftJoinAndSelect("oc.customer", "c")
      .where("s.id = :store_id", { store_id: idStore })
      .select([
        "oc.id AS id",
        "oc.status_order_claim_id AS status_order_claim_id",
        "oc.created_at AS created_at",
        "svo.quantity AS quantity",
        "svo.store_order_id AS number_order",
        "sxv.price AS price_unit",
        "s.name AS store_name",
        "v.title AS product_name",
        "c.first_name AS customer_name",
        "c.last_name AS customer_last_name",
        "c.email AS customer_email",
      ])
      .getRawMany();

    return listClaim;
  }

  async addComment(dataComment) {
    const repoClaimComment = this.activeManager_.withRepository(
      this.claimCommentRepository_
    );

    const createComment = await repoClaimComment.create({
      comment: dataComment.comment,
      comment_owner_id: dataComment.comment_owner_id,
      order_claim_id: dataComment.order_claim_id,
      customer_id: dataComment.customer_id,
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
    const repoOrderClaim = this.activeManager_.withRepository(
      this.orderClaimRepository_
    );

    const update = await repoOrderClaim.update(idClaim, {
      status_order_claim_id: status,
    });
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
}

export default OrderClaimService;
