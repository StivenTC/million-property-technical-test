
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PropertySearchScreen from './PropertySearchScreen';
import * as api from '@/lib/api';
import { PropertyDto } from '@/types/property';

vi.mock('@/lib/api');

const mockInitialProperties: PropertyDto[] = [
  { id: '1', name: 'Casa de Playa', address: '123 Beach Rd', price: 750000, owner: 'Jane Doe', year: 2020, imageUrl: '' },
  { id: '2', name: 'Apartamento Urbano', address: '456 City Ave', price: 400000, owner: 'John Smith', year: 2018, imageUrl: '' },
];

const mockSearchResults: PropertyDto[] = [
  { id: '3', name: 'Villa Lujosa', address: '789 Luxury Ln', price: 1500000, owner: 'Rich Guy', year: 2021, imageUrl: '' },
];

describe('PropertySearchScreen', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render initial properties correctly', () => {
    render(<PropertySearchScreen initialProperties={mockInitialProperties} />);
    expect(screen.getByText('Casa de Playa')).toBeInTheDocument();
    expect(screen.getByText('Apartamento Urbano')).toBeInTheDocument();
  });

  it('should allow filtering and display search results', async () => {
    const getPropertyListMock = vi.spyOn(api, 'getPropertyList').mockResolvedValue(mockSearchResults);

    render(<PropertySearchScreen initialProperties={[]} />);

    const nameInput = screen.getByPlaceholderText('Buscar por nombre');
    fireEvent.change(nameInput, { target: { value: 'Villa' } });

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    fireEvent.click(searchButton);

    expect(screen.getByText('Cargando propiedades...')).toBeInTheDocument();

    await waitFor(() => {
      expect(getPropertyListMock).toHaveBeenCalledWith({ name: 'Villa', address: '', minPrice: '', maxPrice: '' });
    });

    await waitFor(() => {
      expect(screen.getByText('Villa Lujosa')).toBeInTheDocument();
    });
  });

  it('should display an error message if the search fails', async () => {
    vi.spyOn(api, 'getPropertyList').mockRejectedValue(new Error('API Error'));

    render(<PropertySearchScreen initialProperties={[]} />);

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Ocurrió un error al realizar la búsqueda.')).toBeInTheDocument();
    });
  });

  it('should display a message when no results are found', async () => {
    vi.spyOn(api, 'getPropertyList').mockResolvedValue([]);

    render(<PropertySearchScreen initialProperties={[]} />);

    const searchButton = screen.getByRole('button', { name: /buscar/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('No se encontraron propiedades. Intenta ajustar tus filtros.')).toBeInTheDocument();
    });
  });

  it('should sort properties by price', async () => {
    render(<PropertySearchScreen initialProperties={mockInitialProperties} />);

    const sortSelect = screen.getByLabelText('Ordenar por');
    fireEvent.change(sortSelect, { target: { value: 'price-asc' } });

    const propertyCards = screen.getAllByRole('link');

    const firstPropertyName = propertyCards[0].querySelector('h3')?.textContent;
    expect(firstPropertyName).toBe('Apartamento Urbano');
  });

  it('should reset filters and results', async () => {
    vi.spyOn(api, 'getPropertyList').mockResolvedValue(mockSearchResults);
    render(<PropertySearchScreen initialProperties={mockInitialProperties} />);

    const nameInput = screen.getByPlaceholderText('Buscar por nombre');
    fireEvent.change(nameInput, { target: { value: 'Some filter' } });

    const resetButton = screen.getByRole('button', { name: /limpiar/i });
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);

    expect(nameInput).toHaveValue('');
    expect(screen.getByText('Casa de Playa')).toBeInTheDocument();
    expect(screen.queryByText('Villa Lujosa')).not.toBeInTheDocument();
  });
});
