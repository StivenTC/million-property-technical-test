'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/modules/ImageGallery.module.scss';

interface Props {
  images: {
    id: string;
    file: string;
    enabled: boolean;
  }[];
}

export default function ImageGallery({ images }: Props) {
  const enabledImages = images.filter(img => img.enabled);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!enabledImages || enabledImages.length === 0) {
    return (
      <div className={styles.gallery}>
        <div className={styles.mainImageWrapper}>
          <Image
            src="/placeholder-image.jpg"
            alt="No hay imagen disponible"
            fill
            className={styles.mainImage}
            sizes="60vw"
          />
        </div>
      </div>
    );
  }

  const activeImage = enabledImages[activeIndex];

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper}>
        <Image
          key={activeImage.id}
          src={activeImage.file}
          alt="Imagen principal de la propiedad"
          fill
          sizes="60vw"
          className={styles.mainImage}
          priority
        />
      </div>

      {enabledImages.length > 1 && (
        <div className={styles.thumbnailList}>
          {enabledImages.map((image, index) => (
            <button
              key={image.id}
              className={`${styles.thumbnail} ${index === activeIndex ? styles.thumbnailActive : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={image.file}
                alt={`Miniatura ${index + 1}`}
                fill
                sizes="10vw"
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}