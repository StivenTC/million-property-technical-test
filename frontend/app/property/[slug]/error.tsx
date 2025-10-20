'use client';

import styles from '@/styles/modules/PropertySearchScreen.module.scss';

export default function PropertyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.error}>
      <h2>Algo salió mal al cargar la propiedad.</h2>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
      >
        Intentar de nuevo
      </button>
    </div>
  );
}