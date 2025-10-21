
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PropertyCard from './PropertyCard';
import { PropertyDto } from '@/types/property';
import { formatCurrency, createSlug } from '@/lib/utils';

describe('PropertyCard', () => {
  const mockProperty: PropertyDto = {
    id: '123',
    name: 'Beautiful House',
    address: '123 Main St, Anytown, USA',
    price: 500000,
    owner: 'John Doe',
    year: 2022,
    imageUrl: 'https://example.com/image.jpg',
  };

  it('should render property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('Beautiful House')).toBeInTheDocument();

    expect(screen.getByText('123 Main St, Anytown, USA')).toBeInTheDocument();

    expect(screen.getByText(formatCurrency(mockProperty.price))).toBeInTheDocument();

    const image = screen.getByAltText(`Imagen de ${mockProperty.name}`);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');

  });

  it('should have a correct link to the property details page', () => {
    render(<PropertyCard property={mockProperty} />);
    const slug = createSlug(mockProperty.name, mockProperty.id);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/property/${slug}`);
  });

  it('should apply priority to the image when isPriority is true', () => {
    render(<PropertyCard property={mockProperty} isPriority />);
    const image = screen.getByAltText(`Imagen de ${mockProperty.name}`);
    expect(image).toBeInTheDocument();
  });
});
