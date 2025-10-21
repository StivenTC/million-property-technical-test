
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PropertyDetailScreen from './PropertyDetailScreen';
import { PropertyDetailDto } from '@/types/property';
import { formatCurrency } from '@/lib/utils';

const mockProperty: PropertyDetailDto = {
  id: 'prop1',
  name: 'Casa de Lujo con Vista al Mar',
  address: '123 Ocean View, Paradise City',
  price: 1200000,
  year: 2021,
  codeInternal: 'XYZ-123',
  owner: {
    id: 'owner1',
    name: 'Juan Pérez',
    address: '456 Safe St',
    photo: 'https://example.com/owner.jpg',
    birthday: new Date('1980-05-15'),
  },
  images: [
    { id: 'img1', file: 'https://example.com/main.jpg', enabled: true },
    { id: 'img2', file: 'https://example.com/living.jpg', enabled: true },
  ],
  traces: [
    {
      id: 'trace1',
      name: 'Venta Inicial',
      dateSale: new Date('2021-01-10'),
      value: 1100000,
      tax: 55000,
    },
    {
      id: 'trace2',
      name: 'Reventa',
      dateSale: new Date('2023-03-20'),
      value: 1200000,
      tax: 60000,
    },
  ],
};

describe('PropertyDetailScreen', () => {
  it('should render all property details correctly', () => {
    render(<PropertyDetailScreen property={mockProperty} />);

    const header = screen.getByRole('heading', { name: mockProperty.name }).parentElement;
    expect(within(header).getByText(mockProperty.name)).toBeInTheDocument();
    expect(within(header).getByText(mockProperty.address)).toBeInTheDocument();
    expect(within(header).getByText(formatCurrency(mockProperty.price))).toBeInTheDocument();

    expect(screen.getByLabelText('Ver imagen 1')).toBeInTheDocument();

    expect(screen.getByText(mockProperty.year)).toBeInTheDocument();
    expect(screen.getByText(mockProperty.codeInternal)).toBeInTheDocument();

    expect(screen.getByTitle('Mapa de la propiedad')).toBeInTheDocument();

    const historySection = screen.getByRole('region', { name: /historial de transacciones/i });
    expect(within(historySection).getByText('Venta Inicial')).toBeInTheDocument();
    expect(within(historySection).getByText(formatCurrency(1100000))).toBeInTheDocument();
    expect(within(historySection).getByText('Reventa')).toBeInTheDocument();
    expect(within(historySection).getByText(formatCurrency(1200000))).toBeInTheDocument();

    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByAltText('Foto de Juan Pérez')).toBeInTheDocument();
  });

  it('should display a message if there is no transaction history', () => {
    const propertyWithoutTraces = { ...mockProperty, traces: [] };
    render(<PropertyDetailScreen property={propertyWithoutTraces} />);
    expect(screen.getByText('No hay historial disponible.')).toBeInTheDocument();
  });
});
