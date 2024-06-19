import { Box, Button, Paper, Typography } from '@mui/material';
import { useContext } from 'react';
import { CollectionContext } from '../../../context/CollectionContext';
import AttributeContentEditor from './AttributeContentEditor';
import { CollectionApiService } from '../../../services/ApiService';
import { LoadingIndicatorContext } from '@lst97/react-common-accessories';

export const AttributesController = ({
	selectedCollectionIndex
}: {
	selectedCollectionIndex: number;
}) => {
	const { collections } = useContext(CollectionContext);

	const { showIndicator } = useContext(LoadingIndicatorContext)!;
	CollectionApiService.useIndicator(showIndicator);

	const handlePublish = () => {
		// const publishCollection = async () => {
		// 	await CollectionApiService.updateCollectionAttributes(
		// 		collections[selectedCollectionIndex].slug,
		// 		collections[selectedCollectionIndex].attributes
		// 	);
		// };
		// publishCollection();
	};

	return (
		<>
			<Paper sx={{ m: 4 }}>
				<Box sx={{ p: 1 }}>
					<Typography variant="h4">
						{collections[selectedCollectionIndex].collectionName}
					</Typography>
					<Typography variant="body2">
						{collections[selectedCollectionIndex].description}
					</Typography>
					<Typography variant="subtitle2" sx={{ color: 'gray' }}>
						{collections[selectedCollectionIndex].slug}
					</Typography>
				</Box>

				{collections[selectedCollectionIndex].attributes.map(
					(attribute, index) => (
						<AttributeContentEditor
							key={'subtypes_' + index}
							selectedCollectionIndex={selectedCollectionIndex}
							selectedAttributeIndex={index}
							slug={collections[selectedCollectionIndex].slug}
							attribute={attribute}
						/>
					)
				)}
			</Paper>
			<Button variant="contained" sx={{ m: 4 }} onClick={handlePublish}>
				Publish
			</Button>
		</>
	);
};
