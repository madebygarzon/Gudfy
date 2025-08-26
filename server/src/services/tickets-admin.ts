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
      .orderBy("t.created_at", "DESC")
      .getRawMany();

    return listTikets;
  }

  async addTicketMessage(ticket_id, owner_id, image, message) {
    try {
      const TicketMessagesRepository = this.activeManager_.withRepository(
        this.ticketMessagesRepository_
      );
      const addMessage = await TicketMessagesRepository.create({
        image: image?.path
          ? `${
              process.env.BACKEND_URL ?? `http://localhost:${
                process.env.BACKEND_PORT ?? 9000
              }`
            }/${image.path}`
          : null,
        message,
        ticket_id,
        owner_id,
      });
      const saveMessage = await TicketMessagesRepository.save(addMessage);

      return saveMessage;
    } catch (error) {
      console.log(
        "error al agregar el mensage al tikect de parte del admin",
        error
      );
    }
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

  async updateTikectStatus(ticket_id, status) {
    try {
      const TicketRepository = this.activeManager_.withRepository(
        this.ticketsRepository_
      );
      const updateTicket = await TicketRepository.update(ticket_id, {
        status_id: status,
      });

      return updateTicket;
    } catch (error) {
      console.log("error en la actualizacion del ticket", error);
    }
  }
}
