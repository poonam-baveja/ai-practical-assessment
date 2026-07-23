/**
 * Ticket feature — public barrel export.
 * Only expose what other parts of the app need.
 */
export { TicketListPage, CreateTicketPage, TicketDetailPage } from './pages';
export type { Ticket, Comment, User } from './types';
export { Status, Priority } from './types';
