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
  const initialFilters = {
    name: '',
    address: '',
    minPrice: '',
    maxPrice: '',
  };

  const [filters, setFilters] = useState(initialFilters);
  const [properties, setProperties] = useState(initialProperties);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setSearchPerformed(true);
    setError(null);
    setProperties([]);
    try {
      const results = await getPropertyList(filters);
      setProperties(results);
    } catch (err) {
      setError('Ocurrió un error al realizar la búsqueda.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setProperties(initialProperties);
    setSearchPerformed(false);
    setError(null);
  };

  const isFilterActive = Object.values(filters).some((val) => val !== '');

  return (
    <section aria-labelledby="main-heading">
      <h1 id="main-heading" className={styles.mainTitle}>
        Encuentra tu Propiedad Ideal
      </h1>

      <div role="search" className={styles.searchContainer}>
        <form
          className={styles.filterGrid}
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className={styles.filterGroup}>
            <label htmlFor="name" className="sr-only">Nombre de la propiedad</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Buscar por nombre"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="address" className="sr-only">Dirección</label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="¿Dónde?"
              value={filters.address}
              onChange={handleFilterChange}
            />
          </div>

          <div className={styles.priceRangeContainer}>
            <div className={`${styles.filterGroup} ${styles.priceFilter}`}>
              <label htmlFor="minPrice" className="sr-only">Precio Mínimo</label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                placeholder="Precio mín."
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </div>

            <div className={`${styles.filterGroup} ${styles.priceFilter}`}>
              <label htmlFor="maxPrice" className="sr-only">Precio Máximo</label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="Precio máx."
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className={styles.buttonContainer}>
            {isFilterActive && (
              <button
                type="button"
                onClick={handleReset}
                className={styles.clearButton}>
                Limpiar
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={styles.searchButton}
              aria-label="Buscar"
            >
              <span className={styles.searchButtonIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" />
                </svg>
              </span>
              <span className={styles.searchButtonText}>Buscar</span>
            </button>
          </div>
        </form>
      </div>

      {isLoading && (
        <div role="status" className={styles.loading}>
          Cargando propiedades...
        </div>
      )}

      {!isLoading && error && (
        <div role="alert" className={styles.error}>
          {error}
        </div>
      )}

      {!isLoading && !error && searchPerformed && properties.length === 0 && (
        <div className={styles.noResults}>
          No se encontraron propiedades. Intenta ajustar tus filtros.
        </div>
      )}

      {!isLoading && !error && properties.length > 0 && (
        <section aria-labelledby="results-heading">
          <h2 id="results-heading" className={styles.resultsTitle}>
            Resultados
          </h2>
          <div className={styles.resultsGrid}>
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                isPriority={index < 2}
              />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}