import {
	Box,
	Button,
	IconButton,
	Link,
	Menu,
	MenuItem,
	Stack,
	Typography
} from '@mui/material';
import {
	CollectionAttribute,
	CollectionAttributeDbModel
} from '../../../models/share/collection/CollectionAttributes';
import {
	AttributeSettingTypes,
	MediaTypeSettingDbModel,
	TextTypeSetting,
	TextTypeSettingDbModel,
	TypeSetting,
	TypeSettingDbModel
} from '../../../models/share/collection/AttributeTypeSettings';
import { useContext, useEffect, useState } from 'react';
import { EditAttributeDialog } from './CollectionComponents';
import {
	CollectionDbModel,
	SupportedCollectionKind
} from '../../../models/share/collection/Collection';
import { CollectionContext } from '../../../context/CollectionContext';
import {
	SupportedAttributeTypes,
	SupportedAttributes
} from '../../../models/share/collection/CollectionBaseSchema';
import { ConfirmationDialog, PlainDialog } from '../../common/dialogs/Dialogs';
import {
	CollectionApiService,
	EndpointApiService
} from '../../../services/ApiService';
import { BaseContent } from '../../../models/share/collection/AttributeContents';
import AttributeTypesGrid from './AttributeTypesGrid';
import {
	AttributeInfoFormValues,
	AttributeSettingsHelper,
	AttributeTypesForm
} from './forms/AttributeTypesForm';

import SettingsIcon from '@mui/icons-material/Settings';
import { ICollectionEndpoint } from '../../../models/share/endpoint/Endpoint';

import { Config as ApiServiceConfig } from '@lst97/common-restful';
import { PostsCollectionAttributesViewer } from '../attribute/PostsCollectionAttributesViewer';
const FieldsViewer = ({ collection }: { collection: CollectionDbModel }) => {
	const [selectedAttribute, setSelectedAttribute] =
		useState<CollectionAttributeDbModel | null>(null);
	const [pendingDeleteAttribute, setPendingDeleteAttribute] =
		useState<CollectionAttributeDbModel | null>(null);

	const [isAddAttributeDialogOpen, setIsAddAttributeDialogOpen] =
		useState(false);

	const [pendingAddAttributeType, setPendingAddAttributeType] =
		useState<SupportedAttributeTypes | null>(null);

	const { setCollections } = useContext(CollectionContext);

	const handleEditAttribute = (attribute: CollectionAttributeDbModel) => {
		setSelectedAttribute(attribute);
	};

	const handleAddAttribute = async (settings: AttributeInfoFormValues) => {
		if (!pendingAddAttributeType) return;

		if (pendingAddAttributeType === SupportedAttributes.text) {
			const newAttribute = new CollectionAttribute({
				setting: AttributeSettingsHelper.toTextTypeSetting(settings),
				content: new BaseContent()
			});

			const updatedCollection: CollectionDbModel =
				await CollectionApiService.addCollectionAttribute(
					collection.slug,
					newAttribute
				);

			const attributeToAdd: CollectionAttributeDbModel | undefined =
				updatedCollection.attributes.find(
					(a) =>
						(a.setting as TypeSettingDbModel).name ===
						(newAttribute.setting as TextTypeSetting).name
				) as CollectionAttributeDbModel;

			if (attributeToAdd) {
				setCollections((prev: CollectionDbModel[]) => {
					const updatedCollection = prev.find(
						(c) => c.slug === collection.slug
					);
					if (updatedCollection) {
						updatedCollection.attributes.push(attributeToAdd);
					}
					return prev;
				});
			}

			setIsAddAttributeDialogOpen(false);
		}
	};

	const handlePendingDeleteAttribute = (
		attribute: CollectionAttributeDbModel
	) => {
		setPendingDeleteAttribute(attribute);
	};

	const handleDeleteAttribute = async () => {
		if (pendingDeleteAttribute) {
			// Delete attribute
			await CollectionApiService.deleteCollectionAttribute(
				collection.slug,
				pendingDeleteAttribute._id
			);

			// Update collection
			setCollections((prev: CollectionDbModel[]) => {
				const updatedCollection = prev.find(
					(c) => c.slug === collection.slug
				);
				if (updatedCollection) {
					updatedCollection.attributes =
						updatedCollection.attributes.filter(
							(a) => a._id !== pendingDeleteAttribute._id
						);
				}
				return prev;
			});

			setPendingDeleteAttribute(null);
		}
	};

	const handleAddPendingAttribute = () => {
		setIsAddAttributeDialogOpen(true);
	};

	const onAttributeTypeSelected = (
		attributeType: SupportedAttributeTypes
	) => {
		setPendingAddAttributeType(attributeType);
	};

	const getSubTypeName = (attribute: CollectionAttributeDbModel) => {
		switch (attribute.setting.type) {
			case SupportedAttributes.text:
				return (attribute.setting as TextTypeSettingDbModel).subType;
			case SupportedAttributes.media:
				return (attribute.setting as MediaTypeSettingDbModel).subType;
			default:
				return null;
		}
	};

	const renderAttributes = (kind: SupportedCollectionKind) => {
		if (
			kind === 'collection' &&
			collection.attributes &&
			collection.attributes.length !== 0 &&
			(collection.attributes[0].setting as any).type !== undefined
		) {
			return (
				<Stack direction="column" spacing={1}>
					{collection.attributes.map((attribute) => (
						<div
							key={
								'attribute_' +
								(attribute.setting as unknown as TypeSetting)
									.name
							}
						>
							<Stack direction="row" spacing={1}>
								<div>
									<Typography variant="h6">
										Attribute name:{' '}
										{
											(
												attribute.setting as unknown as TypeSetting
											).name
										}
									</Typography>
									<Typography variant="subtitle1">
										Type:{' '}
										{
											(
												attribute.setting as unknown as TypeSetting
											).type
										}
										, Sub-Type:{' '}
										{getSubTypeName(
											attribute as CollectionAttributeDbModel
										)}
									</Typography>
								</div>
								<div>
									<Box
										sx={{
											display: 'flex',
											alignItems: 'flex-start',
											flexDirection: 'row',
											justifyContent: 'flex-end',
											gap: 1
										}}
									>
										<Button
											variant="outlined"
											color="primary"
											onClick={() => {
												handleEditAttribute(
													attribute as CollectionAttributeDbModel
												);
											}}
										>
											Edit
										</Button>
										<Button
											variant="outlined"
											color="warning"
											onClick={() => {
												handlePendingDeleteAttribute(
													attribute as CollectionAttributeDbModel
												);
											}}
										>
											Delete
										</Button>
									</Box>
								</div>
							</Stack>
						</div>
					))}
				</Stack>
			);
		} else if (kind === 'posts') {
			// render the posts table
			return <PostsCollectionAttributesViewer slug={collection.slug} />;
		} else {
			return <Typography variant="body1">No fields added yet</Typography>;
		}
	};

	return (
		<div className="flex flex-col gap-2 m-8 rounded-md bg-white shadow-sm">
			<div className="flex flex-row justify-between">
				<Typography variant="h6">
					{collection.attributes?.length ?? 0}{' '}
					{collection.kind === 'posts' ? 'Posts' : 'Attributes'}
				</Typography>
				<div className="flex flex-row gap-2">
					<Button
						variant="contained"
						color="primary"
						onClick={handleAddPendingAttribute}
					>
						{collection.kind === 'posts' ? 'Add Post' : 'Add Field'}
					</Button>
				</div>
			</div>
			{renderAttributes(collection.kind)}

			{selectedAttribute ? (
				<EditAttributeDialog
					collection={collection}
					attribute={selectedAttribute}
					open={selectedAttribute !== null}
					onFinish={() => {}}
					onClose={() => {
						setSelectedAttribute(null);
					}}
				/>
			) : null}

			<ConfirmationDialog
				open={pendingDeleteAttribute !== null}
				onClose={() => {
					setPendingDeleteAttribute(null);
				}}
				onConfirm={handleDeleteAttribute}
				title="Delete Attribute"
				content={
					<Typography>
						`Are you sure you want to delete the attribute - $
						{pendingDeleteAttribute?.setting.name}?`
					</Typography>
				}
				onFinish={() => {}}
			/>

			<PlainDialog
				open={isAddAttributeDialogOpen}
				onClose={() => {
					setPendingAddAttributeType(null);
					setIsAddAttributeDialogOpen(false);
				}}
				title="Add an Attribute"
				content={
					pendingAddAttributeType ? (
						<AttributeTypesForm
							onSubmit={handleAddAttribute}
							type={pendingAddAttributeType}
							submitLabel="Submit"
						/>
					) : (
						<AttributeTypesGrid onClick={onAttributeTypeSelected} />
					)
				}
				onFinish={() => {}}
			/>
		</div>
	);
};

const CollectionViewer = ({
	slug,
	onDeleted
}: {
	slug: string;
	onDeleted?: (slug: string) => void;
}) => {
	const { collections } = useContext(CollectionContext);

	const [collection, setCollection] = useState<CollectionDbModel | null>(
		null
	);

	const [pendingDeleteCollection, setPendingDeleteCollection] =
		useState<CollectionDbModel | null>(null);

	const [selectedEditCollection, setSelectedEditCollection] =
		useState<CollectionDbModel | null>(null);

	const [subdirectory, setSubdirectory] = useState<string>('Loading');

	useEffect(() => {
		setSubdirectory('Loading...');
		const fetchEndpointData = async () => {
			const selectedCollection = collections.find(
				(collection) => collection.slug === slug
			);
			if (selectedCollection) {
				setCollection(selectedCollection);
				// get the subdirectory
				const endpoint = (await EndpointApiService.getEndpointBySlug(
					selectedCollection.slug
				)) as ICollectionEndpoint;

				setSubdirectory(endpoint.prefix);
			}
		};

		fetchEndpointData();
	}, [collections, slug]);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const collectionMenuOpen = Boolean(anchorEl);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleEditCollection = () => {
		setAnchorEl(null);
		if (collection) setSelectedEditCollection(collection);
	};

	const handleDeleteCollection = () => {
		setAnchorEl(null);
		if (collection) {
			setPendingDeleteCollection(collection);
		}
	};

	const handleCollectionSettingClick = (
		event: React.MouseEvent<HTMLElement>
	) => {
		setAnchorEl(event.currentTarget);
	};

	const constructUrl = (collection: CollectionDbModel) => {
		switch (collection.kind) {
			case 'posts':
				return `/collections/posts/${collection.slug}`;
			case 'collection':
				return `/collections/${collection.slug}`;
		}
	};

	return (
		<>
			{collection ? (
				<div className="flex flex-col m-8">
					<div className="flex flex-row justify-between">
						<div className="flex flex-col">
							<Typography variant="h5">
								{collection.collectionName}
							</Typography>
							<Typography variant="subtitle1">
								{collection.description}
							</Typography>
							<Link
								href={
									subdirectory === 'Loading...'
										? undefined
										: `${
												ApiServiceConfig.instance()
													.baseUrl
										  }${constructUrl(collection)}`
								}
								variant="subtitle2"
							>{`${subdirectory}`}</Link>
						</div>
						<div>
							<IconButton
								aria-label="setting"
								aria-controls={
									collectionMenuOpen
										? 'positioned-menu'
										: undefined
								}
								aria-haspopup="true"
								aria-expanded={
									collectionMenuOpen ? 'true' : undefined
								}
								onClick={handleCollectionSettingClick}
							>
								<SettingsIcon />
							</IconButton>
							<Menu
								id="positioned-menu"
								aria-labelledby="positioned-button"
								anchorEl={anchorEl}
								open={collectionMenuOpen}
								onClose={handleClose}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'left'
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'left'
								}}
							>
								<MenuItem disabled>
									Collection settings
								</MenuItem>
								<MenuItem onClick={handleEditCollection}>
									Edit
								</MenuItem>
								<MenuItem
									onClick={handleDeleteCollection}
									sx={{ color: 'red' }}
								>
									Delete
								</MenuItem>
							</Menu>
						</div>
					</div>
					<FieldsViewer collection={collection} />
					<ConfirmationDialog
						open={pendingDeleteCollection !== null}
						onClose={() => {
							setPendingDeleteCollection(null);
						}}
						onConfirm={async () => {
							await CollectionApiService.deleteCollection(
								collection.slug
							);
							setPendingDeleteCollection(null);
							onDeleted?.(slug);
						}}
						title="Delete Collection"
						content={
							<Typography>
								Are you sure you want to delete the collection -{' '}
								{pendingDeleteCollection?.collectionName}?
							</Typography>
						}
						onFinish={() => {}}
					/>
					<PlainDialog
						open={selectedEditCollection !== null}
						onClose={() => {
							setSelectedEditCollection(null);
						}}
						title="Edit Collection"
						content={<Typography>Not yet support</Typography>}
						onFinish={() => {}}
					/>
				</div>
			) : null}
		</>
	);
};

export default CollectionViewer;
