import Link from 'next/link';
import Image from 'next/image';
import { PropertyDto } from '@/types/property';
import { createSlug, formatCurrency } from '@/lib/utils';
import styles from '@/styles/modules/PropertyCard.module.scss';

interface Props {
  property: PropertyDto;
  isPriority?: boolean;
}

export default function PropertyCard({ property, isPriority = false }: Props) {
  const slug = createSlug(property.name, property.id);

  return (
    <Link
      href={`/property/${slug}`}
      className={styles.card}
      aria-label={`Ver propiedad ${property.name}`}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={property.imageUrl || '/placeholder-image.jpg'}
          alt={`Imagen de ${property.name}`}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          className={styles.image}
          priority={isPriority}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{property.name}</h3>
        <p className={styles.address}>{property.address}</p>
        <p className={styles.price}>{formatCurrency(property.price)}</p>
      </div>
    </Link>
  );
}