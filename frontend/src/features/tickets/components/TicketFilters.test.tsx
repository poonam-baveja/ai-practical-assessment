import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { TicketFilters } from './TicketFilters';

describe('TicketFilters', () => {
  const defaultProps = {
    search: '',
    status: '',
    onSearchChange: vi.fn(),
    onStatusChange: vi.fn(),
    onClear: vi.fn(),
  };

  it('renders search input and status dropdown', () => {
    renderWithProviders(<TicketFilters {...defaultProps} />);

    expect(screen.getByLabelText('Search tickets')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by status')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in search input', () => {
    const onSearchChange = vi.fn();
    renderWithProviders(<TicketFilters {...defaultProps} onSearchChange={onSearchChange} />);

    const input = screen.getByLabelText('Search tickets');
    fireEvent.change(input, { target: { value: 'login' } });

    expect(onSearchChange).toHaveBeenCalledWith('login');
  });

  it('calls onStatusChange when selecting a status', () => {
    const onStatusChange = vi.fn();
    renderWithProviders(<TicketFilters {...defaultProps} onStatusChange={onStatusChange} />);

    const select = screen.getByLabelText('Filter by status');
    fireEvent.change(select, { target: { value: 'OPEN' } });

    expect(onStatusChange).toHaveBeenCalledWith('OPEN');
  });

  it('does not show Clear Filters button when no filters active', () => {
    renderWithProviders(<TicketFilters {...defaultProps} />);

    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
  });

  it('shows Clear Filters button when search is active', () => {
    renderWithProviders(<TicketFilters {...defaultProps} search="login" />);

    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  it('shows Clear Filters button when status is active', () => {
    renderWithProviders(<TicketFilters {...defaultProps} status="OPEN" />);

    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  it('calls onClear when Clear Filters is clicked', () => {
    const onClear = vi.fn();
    renderWithProviders(<TicketFilters {...defaultProps} search="test" onClear={onClear} />);

    fireEvent.click(screen.getByText('Clear Filters'));

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
