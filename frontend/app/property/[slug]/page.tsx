import { getPropertyDetail } from '@/lib/api';
import { extractIdFromSlug } from '@/lib/utils';
import PropertyDetailScreen from '@/screens/PropertyDetailScreen';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const id = extractIdFromSlug(params.slug);
  if (!id) {
    return { title: 'Propiedad no encontrada' };
  }

  const property = await getPropertyDetail(id);

  if (!property) {
    return { title: 'Propiedad no encontrada' };
  }

  return {
    title: `${property.name} | Million`,
    description: `Detalles de ${property.name}, ubicada en ${property.address}`,
  };
}

export default async function PropertyDetailPage(props: Props) {
  const params = await props.params;
  const { slug } = params;

  const id = extractIdFromSlug(slug);

  if (!id) {
    notFound();
  }

  const property = await getPropertyDetail(id);

  if (!property) {
    notFound();
  }

  return (
    <PropertyDetailScreen property={property} />
  );
}