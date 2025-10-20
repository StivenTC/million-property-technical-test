'use client';

import { PropertyDetailDto } from '@/types/property';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import ImageGallery from '@/components/ImageGallery';
import styles from '@/styles/modules/PropertyDetailScreen.module.scss';

interface Props {
  property: PropertyDetailDto;
}

export default function PropertyDetailScreen({ property }: Props) {
  return (
    <article className={styles.detailContainer}>
      <header className={styles.header}>
        <h1 className={styles.name}>{property.name}</h1>
        <p className={styles.address}>{property.address}</p>
        <p className={styles.price}>{formatCurrency(property.price)}</p>
      </header>

      <div className={styles.content}>
        <main className={styles.leftColumn}>
          <section>
            <h2 className={styles.sectionTitle}>Galería</h2>
            <ImageGallery images={property.images} />
          </section>

          <section>
            <h2 className={styles.sectionTitle}>Información Adicional</h2>
            <p><strong>Año:</strong> {property.year}</p>
            <p><strong>Código Interno:</strong> {property.codeInternal}</p>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>Historial (Traces)</h2>
            <div className={styles.tracesTableWrapper}>
              <table className={styles.tracesTable}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Fecha Venta</th>
                    <th>Valor</th>
                    <th>Impuesto</th>
                  </tr>
                </thead>
                <tbody>
                  {property.traces.length > 0 ? (
                    property.traces.map((trace) => (
                      <tr key={trace.id}>
                        <td>{trace.name}</td>
                        <td>{new Date(trace.dateSale).toLocaleDateString()}</td>
                        <td>{formatCurrency(trace.value)}</td>
                        <td>{formatCurrency(trace.tax)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>No hay historial disponible.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <aside className={styles.rightColumn}>
          <section className={styles.ownerCard}>
            <h2 className={styles.sectionTitle}>Propietario</h2>
            <Image
              src={property.owner.photo || '/placeholder-avatar.png'}
              alt={`Foto de ${property.owner.name}`}
              width={100}
              height={100}
              className={styles.ownerPhoto}
            />
            <p className={styles.ownerName}>{property.owner.name}</p>
          </section>
        </aside>
      </div>
    </article>
  );
}