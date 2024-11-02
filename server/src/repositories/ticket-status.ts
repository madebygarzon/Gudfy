import { TicketStatus } from "../models/ticket-status";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

const TicketStatusRepository = dataSource.getRepository(TicketStatus);

export default TicketStatusRepository;
