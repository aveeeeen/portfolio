import type { EventBlocksResult, ListEventInput, ListEventResult, Pagination, PaginationInput } from "./event.service.types";
import * as EventRepository from "./event.repository";

export const listEvents = async (input: ListEventInput): Promise<ListEventResult[]> => {
  console.log(input);
  const result = await EventRepository.getManyEvents(input);
  return result
}

export const getPaginationData = async (input: PaginationInput): Promise<Pagination> => {
  const pagination = await EventRepository.getAllPagesAndCursors(input);
  return pagination
}

export const getEventBlocksById = async (id: string): Promise<EventBlocksResult> => {
  const event = await EventRepository.getEventBlocksById(id);
  return event;
}
