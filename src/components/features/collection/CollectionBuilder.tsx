import {
	Badge,
	Box,
	Button,
	Grid,
	IconButton,
	Paper,
	Stack,
	Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CollectionViewer from './CollectionViewer';
import { ReactNode, useContext, useEffect, useState } from 'react';
import { CreateCollectionDialog } from './CollectionComponents';
import {
	AttributeSettingTypes,
	MediaTypeSetting,
	PostTypeSetting,
	PostsTypeSetting,
	TextTypeSetting
} from '../../../models/share/collection/AttributeTypeSettings';
import {
	CollectionForm,
	CollectionInfo
} from '../../../models/forms/auth/CollectionForm';
import { CollectionAttribute } from '../../../models/share/collection/CollectionAttributes';
import { BaseContent } from '../../../models/share/collection/AttributeContents';
import { CollectionDbModel } from '../../../models/share/collection/Collection';
import { CollectionContext } from '../../../context/CollectionContext';

interface ICollectionBuilder {
	reset(): CollectionBuilder;
	setCollectionInfo(
		name: string,
		description?: string,
		subdirectory?: string
	): CollectionBuilder;
	get collectionInfo(): CollectionInfo;
	addAttributeTypeSetting(type: AttributeSettingTypes): CollectionBuilder;
	removeAttributeTypeSetting(name: string): CollectionBuilder;
	setAttributeTypeSettings(
		settings: CollectionAttribute[]
	): CollectionBuilder;
	get collectionAttributes(): CollectionAttribute[];
	build(): CollectionForm;
}

/**
 * Data for creating a collection in the dialog.
 */
export class CollectionBuilder implements ICollectionBuilder {
	private form: CollectionForm = new CollectionForm();

	reset(): this {
		this.form = new CollectionForm();
		return this;
	}

	get collectionInfo(): CollectionInfo {
		return this.form.info;
	}

	get collectionAttributes(): CollectionAttribute[] {
		return this.form.attributes;
	}

	setCollectionInfo(
		name: string,
		description: string = '',
		subdirectory: string = ''
	): this {
		this.form.info = {
			name: name,
			description: description,
			subdirectory: subdirectory
		};
		return this;
	}

	setAttributeTypeSettings(settings: CollectionAttribute[]): this {
		this.form.attributes = settings;
		return this;
	}
	addAttributeTypeSetting(setting: AttributeSettingTypes): this {
		switch (setting.constructor) {
			case TextTypeSetting:
				this.form.attributes?.push(
					new CollectionAttribute(
						setting as TextTypeSetting,
						new BaseContent()
					)
				);
				break;
			case MediaTypeSetting:
				this.form.attributes?.push(
					new CollectionAttribute(
						setting as MediaTypeSetting,
						new BaseContent()
					)
				);
				break;
			case PostTypeSetting:
				this.form.attributes?.push(
					new CollectionAttribute(
						setting as PostTypeSetting,
						new BaseContent()
					)
				);
				break;

			case PostsTypeSetting:
				this.form.attributes?.push(
					new CollectionAttribute(
						setting as PostsTypeSetting,
						new BaseContent()
					)
				);
				break;
			default:
				console.log('Unknown setting type');
		}
		return this;
	}

	removeAttributeTypeSetting(name: string): this {
		this.form.attributes = this.form.attributes.filter(
			(attribute) => attribute.setting.name !== name
		);
		return this;
	}
	build(): CollectionForm {
		return this.form;
	}
}
const CollectionBuilderComponent = () => {
	const { collections, setCollections } = useContext(CollectionContext);
	const [filteredCollections, setFilteredCollections] = useState(
		collections.filter((collection) => collection.ref === undefined)
	);

	const [expendedPostsCollection, setExpendedPostsCollection] = useState('');

	const [selectedCollection, setSelectedCollection] =
		useState<CollectionDbModel | null>(null);

	const [addCollectionDialogOpen, setAddCollectionDialogOpen] =
		useState(false);
	const handleAddCollectionClick = () => {
		setAddCollectionDialogOpen(true);
	};
	const handleCloseAddCollectionDialog = () => {
		setAddCollectionDialogOpen(false);
	};

	const AddCollection = () => {
		return (
			<Button onClick={handleAddCollectionClick}>
				<Typography variant="body1" sx={{ padding: 1 }}>
					+ Create new collection
				</Typography>
			</Button>
		);
	};

	const renderButtonsByPostsCollection = (
		postsCollection: CollectionDbModel
	): ReactNode => {
		const postSlugs = postsCollection.attributes.map(
			(attr) => attr.content.value
		);

		const posts: CollectionDbModel[] = [];
		collections.forEach((collection) => {
			if (postSlugs.includes(collection.slug)) {
				posts.push(collection);
			}
		});

		return (
			<Box sx={{ marginLeft: '20px' }}>
				{posts.map((post) => renderButton(post))}
			</Box>
		);
	};

	const handlePostsExpandClick = (slug: string) => {
		console.log('handlePostsExpandClick', slug);
		if (expendedPostsCollection === slug) {
			setExpendedPostsCollection('');
		} else {
			setExpendedPostsCollection(slug);
		}
	};

	const renderButton = (collection: CollectionDbModel) => {
		const defaultButton = (
			<Button
				fullWidth
				variant="text"
				key={collection.slug}
				sx={{ justifyContent: 'flex-start' }}
				onClick={() => {
					setSelectedCollection(collection);
				}}
			>
				<Stack direction="column" spacing={1} alignItems="flex-start">
					<Typography variant="body1">
						{collection.collectionName}
					</Typography>
					<Typography variant="caption" color="text.secondary">
						{collection.slug}
					</Typography>
				</Stack>
			</Button>
		);

		switch (collection.kind) {
			case 'posts':
				return (
					<>
						<Grid container>
							<Grid item xs={10}>
								{defaultButton}
							</Grid>
							<Grid
								item
								xs={2}
								container
								alignItems="center"
								justifyContent="center"
							>
								<Button
									variant="text"
									sx={{ height: '100%' }}
									onClick={() => {
										handlePostsExpandClick(collection.slug);
									}}
								>
									{expendedPostsCollection === '' ? '▼' : '▲'}
								</Button>
							</Grid>
						</Grid>
						<>
							{expendedPostsCollection !== ''
								? renderButtonsByPostsCollection(collection)
								: null}
						</>
					</>
				);
			default:
				return defaultButton;
		}
	};

	useEffect(() => {
		setFilteredCollections(
			collections.filter((collection) => collection.ref === undefined)
		);
	}, [collections]);

	return (
		<Box>
			<Grid container sx={{ height: '100%' }}>
				<Grid item xs={3} component={Paper} elevation={0} square>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							backgroundColor: '#f1f5f9' // bg-slate-100
						}}
					>
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								p: 2
							}}
						>
							<Badge
								badgeContent={filteredCollections.length}
								color="primary"
							>
								<Typography variant="h6">COLLECTION</Typography>
							</Badge>
							<IconButton>
								<SearchIcon />
							</IconButton>
						</Box>

						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
								px: 2
							}}
						>
							{filteredCollections.map((collection) => (
								<>{renderButton(collection)}</>
							))}
						</Box>
						<AddCollection />
					</Box>
				</Grid>
				<Grid item xs={9} component={Paper} elevation={0} square>
					{selectedCollection ? (
						<CollectionViewer
							slug={selectedCollection.slug}
							onDeleted={(slug) => {
								setCollections(
									filteredCollections.filter(
										(collection) => collection.slug !== slug
									)
								);
								setSelectedCollection(null);
							}}
						/>
					) : null}
				</Grid>
			</Grid>

			<CreateCollectionDialog
				open={addCollectionDialogOpen}
				onFinish={() => {}}
				onClose={handleCloseAddCollectionDialog}
			/>
		</Box>
	);
};

export default CollectionBuilderComponent;
