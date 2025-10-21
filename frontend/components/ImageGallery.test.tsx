
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ImageGallery from './ImageGallery';

const mockImages = [
  { id: '1', file: 'https://example.com/image1.jpg', enabled: true },
  { id: '2', file: 'https://example.com/image2.jpg', enabled: true },
  { id: '3', file: 'https://example.com/image3.jpg', enabled: false },
];

describe('ImageGallery', () => {
  it('should render a placeholder when no enabled images are provided', () => {
    render(<ImageGallery images={[]} />);
    const placeholder = screen.getByAltText('No hay imagen disponible');
    expect(placeholder).toBeInTheDocument();
  });

  it('should render the main image and thumbnails when images are provided', () => {
    render(<ImageGallery images={mockImages} />);
    
    const mainImage = screen.getByAltText('Imagen principal de la propiedad');
    expect(mainImage).toBeInTheDocument();

    const thumbnails = screen.getAllByRole('button');
    expect(thumbnails).toHaveLength(2);
  });

  it('should change the main image when a thumbnail is clicked', () => {
    render(<ImageGallery images={mockImages} />);
    
    const mainImage = screen.getByAltText('Imagen principal de la propiedad');
    expect(mainImage).toHaveAttribute('src', mockImages[0].file);

    const thumbnail2 = screen.getByLabelText('Ver imagen 2');
    fireEvent.click(thumbnail2);

    const newMainImage = screen.getByAltText('Imagen principal de la propiedad');
    expect(newMainImage).toHaveAttribute('src', mockImages[1].file);
  });

  it('should not render thumbnails if only one image is enabled', () => {
    const singleImage = [mockImages[0]];
    render(<ImageGallery images={singleImage} />);
    
    const thumbnails = screen.queryAllByRole('button');
    expect(thumbnails).toHaveLength(0);
  });
});
