import { Box, Button, Paper, Typography } from '@mui/material';
import { useContext } from 'react';
import { CollectionContext } from '../../../context/CollectionContext';
import {
	AttributeContentEditor,
	PostAttributeContentEditor
} from './AttributeContentEditor';
import { CollectionApiService } from '../../../services/ApiService';
import { LoadingIndicatorContext } from '@lst97/react-common-accessories';
import { ICollectionDbModel } from '../../../models/share/collection/Collection';

const AttributesController = (props: {
	selectedCollection: ICollectionDbModel;
}) => {
	const { collections } = useContext(CollectionContext);
	const { selectedCollection } = props;

	const selectedCollectionIndex = collections.findIndex(
		(collection) => collection.slug === selectedCollection.slug
	);

	const { showIndicator } = useContext(LoadingIndicatorContext)!;
	CollectionApiService.useIndicator(showIndicator);

	const handlePublish = () => {
		const publishCollection = async () => {
			const updatedCollection = collections.find((collection) =>
				collection.attributes.find(
					(attribute) =>
						attribute.content.value === selectedCollection.slug
				)
			);
			if (updatedCollection) {
				await CollectionApiService.updateCollectionAttributes(
					updatedCollection.slug,
					updatedCollection.attributes
				);
			}
		};

		if (selectedCollection.kind === 'collection' || 'post') {
			publishCollection();
		}
	};

	return (
		<>
			<Paper sx={{ m: 4 }}>
				<Box sx={{ p: 1 }}>
					<Typography variant="h4">
						{selectedCollection.collectionName}
					</Typography>
					<Typography variant="body2">
						{selectedCollection.description}
					</Typography>
					<Typography variant="subtitle2" sx={{ color: 'gray' }}>
						{selectedCollection.slug}
					</Typography>
				</Box>

				{selectedCollection.kind === 'collection' &&
					selectedCollection.attributes.map((attribute, index) => (
						<AttributeContentEditor
							key={attribute._id}
							selectedIndies={{
								collectionIndex: selectedCollectionIndex,
								attributeIndex: index
							}}
							collection={selectedCollection}
							attribute={attribute}
						/>
					))}

				{selectedCollection.kind === 'post' &&
					selectedCollection.attributes.map((attribute) => (
						<PostAttributeContentEditor
							key={attribute._id}
							postSlug={selectedCollection.slug}
							attribute={attribute}
						/>
					))}
			</Paper>
			<Button variant="contained" sx={{ m: 4 }} onClick={handlePublish}>
				Publish
			</Button>
		</>
	);
};

export { AttributesController };
