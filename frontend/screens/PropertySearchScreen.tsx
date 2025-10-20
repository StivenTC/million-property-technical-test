'use client';

import { useState } from 'react';
import { PropertyDto } from '@/types/property';
import { getPropertyList } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import styles from '@/styles/modules/PropertySearchScreen.module.scss';

interface Props {
  initialProperties: PropertyDto[];
}

export default function PropertySearchScreen({ initialProperties }: Props) {
  const [filters, setFilters] = useState({
    name: '',
    address: '',
    minPrice: '',
    maxPrice: '',
  });

  const [properties, setProperties] = useState(initialProperties);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setProperties([]); // Limpia resultados anteriores
    try {
      const results = await getPropertyList(filters);
      setProperties(results);
      if (results.length === 0) {
        setError('No se encontraron propiedades con esos filtros.');
      }
    } catch (err) {
      setError('Ocurrió un error al realizar la búsqueda.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className={styles.searchContainer}>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Ej: Casa en el lago"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="address">Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Ej: 123 Calle Falsa"
              value={filters.address}
              onChange={handleFilterChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="minPrice">Precio Mín.</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="Ej: 100000"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="maxPrice">Precio Máx.</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="Ej: 500000"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={styles.searchButton}
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {isLoading && <div className={styles.loading}>Cargando propiedades...</div>}

      {!isLoading && error && <div className={styles.error}>{error}</div>}

      {!isLoading && !error && properties.length > 0 && (
        <div className={styles.resultsGrid}>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}