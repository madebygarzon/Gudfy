import { TransactionBaseService, Customer } from "@medusajs/medusa";
import TicketsRepository from "../repositories/tickets";
import TicketMessagesRepository from "../repositories/ticket-messages";
import { Lifetime } from "awilix";
import { io } from "../websocket";

export default class TicketsService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly ticketsRepository_: typeof TicketsRepository;
  protected readonly ticketMessagesRepository_: typeof TicketMessagesRepository;
  protected readonly loggedInCustomer_: Customer | null | undefined;

  constructor({
    loggedInCustomer,
    ticketsRepository,
    ticketMessagesRepository,
  }) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);

    this.ticketsRepository_ = ticketsRepository;
    this.ticketMessagesRepository_ = ticketMessagesRepository;
    this.loggedInCustomer_ = loggedInCustomer || null;
  }

  async createdTicket(subject, message, image, customer_id) {
    const TicketRepository = this.activeManager_.withRepository(
      this.ticketsRepository_
    );

    const createdTicket = await TicketRepository.create({
      customer_id: this.loggedInCustomer_.id || customer_id,
      status_id: "Open_ID",
      subject: subject,
    });

    const saveTickerd = await TicketRepository.save(createdTicket);

    const creteMessage = await this.addTicketMessage(
      saveTickerd.id,
      "COMMENT_CUSTOMER_ID",
      image,
      message
    );

    return saveTickerd;
  }

  async retriverListTickets() {
    const TicketRepository = this.activeManager_.withRepository(
      this.ticketsRepository_
    );

    const listTikets = await TicketRepository.createQueryBuilder("t")
      .innerJoinAndSelect("t.customer", "c")
      .innerJoinAndSelect("t.status", "s")
      .where("t.customer_id = :customer_id", {
        customer_id: this.loggedInCustomer_.id,
      })
      .select([
        "t.id AS id",
        "t.subject AS subject",
        "s.status AS status",
        "c.first_name AS first_name",
        "c.last_name AS last_name",
        "t.created_at AS created_at",
      ])
      .getRawMany();

    return listTikets;
  }

  async retriverListAdminTickets() {
    const TicketRepository = this.activeManager_.withRepository(
      this.ticketsRepository_
    );

    const listTikets = await TicketRepository.createQueryBuilder("t")
      .innerJoinAndSelect("t.customer", "c")
      .innerJoinAndSelect("t.status", "s")
      .select([
        "t.id AS id",
        "t.subject AS subject",
        "s.status AS status",
        "c.first_name AS first_name",
        "c.last_name AS last_name",
        "t.created_at AS created_at",
      ])
      .getRawMany();

    return listTikets;
  }

  async addTicketMessage(ticket_id, owner_id, image, message) {
    const TicketMessagesRepository = this.activeManager_.withRepository(
      this.ticketMessagesRepository_
    );

    const addMessage = await TicketMessagesRepository.create({
      image: image.path
        ? `${process.env.BACKEND_URL ?? `http://localhost:9000`}/${image.path}`
        : null,
      message,
      ticket_id,
      owner_id,
    });

    const saveMessage = await TicketMessagesRepository.save(addMessage);

    return saveMessage;
  }

  async retriverTicketMessages(idTicket) {
    const TicketMessagesRepository = this.activeManager_.withRepository(
      this.ticketMessagesRepository_
    );

    const listTiketsMessage = await TicketMessagesRepository.find({
      where: {
        ticket_id: idTicket,
      },
    });

    return listTiketsMessage;
  }
}
