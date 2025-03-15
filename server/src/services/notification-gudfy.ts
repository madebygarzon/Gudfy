import {
  EventBusService,
  TransactionBaseService,
  Customer,
} from "@medusajs/medusa";
import { NotificationGudfyRepository } from "../repositories/notification-gudfy";

import { io } from "../websocket";

export default class NotificationGudfyService extends TransactionBaseService {
  protected readonly notificationGudfyRepository_: typeof NotificationGudfyRepository;
  protected readonly eventBusService_: EventBusService;
  protected readonly loggedInCustomer_: Customer | null;

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.notificationGudfyRepository_ = container.notificationGudfyRepository;
    this.eventBusService_ = container.eventBusService;
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
}
