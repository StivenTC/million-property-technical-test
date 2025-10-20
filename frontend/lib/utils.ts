export const createSlug = (name: string, id: string): string => {
  const slugName = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');

  return `${slugName || 'propiedad'}_${id}`;
};

export const extractIdFromSlug = (slug: string): string | null => {
  const delimiterIndex = slug.lastIndexOf('_');

  if (delimiterIndex === -1) {
    return null;
  }

  return slug.substring(delimiterIndex + 1);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};