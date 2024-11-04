import { TransactionBaseService, Customer } from "@medusajs/medusa";
import TicketsRepository from "../repositories/tickets";
import TicketMessagesRepository from "../repositories/ticket-messages";
import { Lifetime } from "awilix";
import { io } from "../websocket";

export default class TicketsAdminService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly ticketsRepository_: typeof TicketsRepository;
  protected readonly ticketMessagesRepository_: typeof TicketMessagesRepository;
  protected readonly loggedInCustomer_: Customer | null | undefined;

  constructor({ ticketsRepository, ticketMessagesRepository }) {
    // @ts-expect-error prefer-rest-params
    super(...arguments);
    this.ticketsRepository_ = ticketsRepository;
    this.ticketMessagesRepository_ = ticketMessagesRepository;
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
