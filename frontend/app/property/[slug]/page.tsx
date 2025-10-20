import { getPropertyDetail } from '@/lib/api';
import { extractIdFromSlug } from '@/lib/utils';
import PropertyDetailScreen from '@/screens/PropertyDetailScreen';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = extractIdFromSlug(params.slug);
  if (!id) {
    return { title: 'Propiedad no encontrada' };
  }

  const property = await getPropertyDetail(id);

  return {
    title: `${property.name} | Million`,
    description: `Detalles de ${property.name}, ubicada en ${property.address}`,
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = params;

  const id = extractIdFromSlug(slug);

  if (!id) {
    notFound();
  }

  const property = await getPropertyDetail(id);

  return (
    <PropertyDetailScreen property={property} />
  );
}