// DataContext.js
import { createContext, useState, useEffect } from 'react';
import { CollectionDbModel } from '../models/share/collection/Collection';
import { CollectionApiService, PostsApiService } from '../services/ApiService';

type Props = {
	children?: React.ReactNode;
};

type ICollectionContext = {
	collections: CollectionDbModel[];
	setCollections: React.Dispatch<React.SetStateAction<CollectionDbModel[]>>;
};

const initialCollectionContext: ICollectionContext = {
	collections: [],
	setCollections: () => {}
};

const CollectionContext = createContext<ICollectionContext>(
	initialCollectionContext
);

const CollectionProvider = ({ children }: Props) => {
	const [collections, setCollections] = useState(
		initialCollectionContext.collections
	);

	const fetchCollections = async () => {
		const collections = await CollectionApiService.getCollections();
		const postsCollections = await PostsApiService.getPostsCollections();
		setCollections([...collections, ...postsCollections]);
	};

	useEffect(() => {
		fetchCollections();
	}, []);

	return (
		<CollectionContext.Provider value={{ collections, setCollections }}>
			{children}
		</CollectionContext.Provider>
	);
};

export { CollectionProvider, CollectionContext };
