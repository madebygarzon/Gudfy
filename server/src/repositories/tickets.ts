import { Ticket } from "../models/tickets";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const TicketRepository = dataSource.getRepository(Ticket);

export default TicketRepository;
