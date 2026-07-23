import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout';
import {
  DashboardPage,
  TicketListPage,
  CreateTicketPage,
  TicketDetailPage,
  EditTicketPage,
} from '../features/tickets/pages';

/**
 * Application route definitions.
 * All routes render inside AppLayout (Header + PageContainer).
 *
 * /                   → Dashboard (home)
 * /tickets            → Ticket list
 * /tickets/new        → Create ticket form
 * /tickets/:id        → Ticket detail view
 * /tickets/:id/edit   → Edit ticket form
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tickets" element={<TicketListPage />} />
        <Route path="/tickets/new" element={<CreateTicketPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
        <Route path="/tickets/:id/edit" element={<EditTicketPage />} />
      </Route>
    </Routes>
  );
}
