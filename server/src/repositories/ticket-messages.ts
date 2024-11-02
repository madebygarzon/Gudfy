import { TicketMessages } from "../models/ticket-messages";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const TicketMessagesRepository = dataSource.getRepository(TicketMessages);

export default TicketMessagesRepository;
