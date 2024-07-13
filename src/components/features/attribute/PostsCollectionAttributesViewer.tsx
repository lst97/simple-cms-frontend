import { useContext, useEffect, useState } from 'react';
import { CollectionContext } from '../../../context/CollectionContext';
import { ICollectionDbModel } from '../../../models/share/collection/Collection';
import { PostsApiService } from '../../../services/ApiService';
import { PostsEditor } from './AttributeContentEditor';

interface PostsCollectionAttributesViewerProps {
	slug: string;
}
export const PostsCollectionAttributesViewer = (
	props: PostsCollectionAttributesViewerProps
) => {
	const { collections } = useContext(CollectionContext);

	return <PostsEditor slug={props.slug} />;
};
