import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout';
import {
  TicketListPage,
  CreateTicketPage,
  TicketDetailPage,
} from '../features/tickets/pages';

/**
 * Application route definitions.
 * All routes render inside AppLayout (Header + PageContainer).
 *
 * /tickets          → Ticket list (home)
 * /tickets/new      → Create ticket form
 * /tickets/:id      → Ticket detail view
 * /                 → Redirects to /tickets
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/tickets" element={<TicketListPage />} />
        <Route path="/tickets/new" element={<CreateTicketPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
        <Route path="/" element={<Navigate to="/tickets" replace />} />
      </Route>
    </Routes>
  );
}
