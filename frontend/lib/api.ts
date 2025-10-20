import { PropertyDto, PropertyDetailDto } from '@/types/property';
import { notFound } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    'NEXT_PUBLIC_API_URL no está definida en .env.local'
  );
}

export async function getPropertyList(
  filters: {
    name?: string;
    address?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
  } = {}
): Promise<PropertyDto[]> {
  
  const cleanedFilters: Record<string, string> = {};
  if (filters.name) cleanedFilters.name = filters.name;
  if (filters.address) cleanedFilters.address = filters.address;
  if (filters.minPrice) cleanedFilters.minPrice = String(filters.minPrice);
  if (filters.maxPrice) cleanedFilters.maxPrice = String(filters.maxPrice);

  const params = new URLSearchParams(cleanedFilters);

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/properties?${params.toString()}`,
      {
        cache: 'no-store' 
      }
    );

    if (!res.ok) {
      throw new Error('Error al obtener la lista de propiedades');
    }
    return res.json();
  } catch (error) {
    console.error('API Error (getPropertyList):', error);
    return [];
  }
}

export async function getPropertyDetail(
  id: string
): Promise<PropertyDetailDto | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/properties/${id}`, {
      next: { revalidate: 3600 }
    });

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error('Error al obtener el detalle de la propiedad');
    }

    return res.json();
  } catch (error) {
    console.error('API Error (getPropertyDetail):', error);
    if (error && typeof error === 'object' && 'digest' in error && (error as { digest: string }).digest === 'NEXT_NOT_FOUND') {
      notFound();
    }
    throw new Error('Error de red o del servidor.');
  }
}