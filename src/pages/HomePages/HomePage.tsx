import Dashboard from '../../components/main/Dashboard';
import { CollectionProvider } from '../../context/CollectionContext';

export default function HomePage() {
	return (
		<CollectionProvider>
			<Dashboard />
		</CollectionProvider>
	);
}
