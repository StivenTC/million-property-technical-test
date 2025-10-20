import { getPropertyList } from '@/lib/api';
import PropertySearchScreen from '@/screens/PropertySearchScreen';

export default async function HomePage() {
  const initialProperties = await getPropertyList();

  return (
    <PropertySearchScreen initialProperties={initialProperties} />
  );
}