import {
	Box,
	Button,
	IconButton,
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
	TextTypeSetting,
	TextTypeSettingDbModel
} from '../../../models/share/collection/AttributeTypeSettings';
import { useContext, useEffect, useState } from 'react';
import { EditAttributeDialog } from './CollectionComponents';
import { CollectionDbModel } from '../../../models/share/collection/Collection';
import { CollectionContext } from '../../../context/CollectionContext';
import {
	SupportedAttributeTypes,
	SupportedAttributes
} from '../../../models/share/collection/CollectionBaseSchema';
import { ConfirmationDialog, PlainDialog } from '../../common/dialogs/Dialogs';
import { CollectionApiService } from '../../../services/ApiService';
import { BaseContent } from '../../../models/share/collection/AttributeContents';
import AttributeTypesGrid from './AttributeTypesGrid';
import { AttributeTypesForm } from './forms/AttributeTypesForm';

import SettingsIcon from '@mui/icons-material/Settings';

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

	const handleAddAttribute = async (settings: AttributeSettingTypes) => {
		if (!pendingAddAttributeType) return;

		if (pendingAddAttributeType === SupportedAttributes.text) {
			const newAttribute = new CollectionAttribute(
				new TextTypeSetting(),
				new BaseContent()
			);

			newAttribute.setting = settings as TextTypeSetting;

			const updatedCollection: CollectionDbModel =
				await CollectionApiService.addCollectionAttribute(
					collection.slug,
					newAttribute
				);

			const attributeToAdd = updatedCollection.attributes.find(
				(a) => a.setting.name === newAttribute.setting.name
			);

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

	return (
		<div className="flex flex-col gap-2 m-8 rounded-md bg-white shadow-sm">
			<div className="flex flex-row justify-between">
				<Typography variant="h6">
					{collection.attributes?.length ?? 0} Attributes
				</Typography>
				<div className="flex flex-row gap-2">
					<Button
						variant="contained"
						color="primary"
						onClick={handleAddPendingAttribute}
					>
						+ Add attribute
					</Button>
				</div>
			</div>
			{collection.attributes && collection.attributes.length !== 0 ? (
				<Stack direction="column" spacing={1}>
					{collection.attributes.map((attribute) => (
						<div key={'attribute_' + attribute.setting.name}>
							<Stack direction="row" spacing={1}>
								<div>
									<Typography variant="h6">
										Attribute name: {attribute.setting.name}
									</Typography>
									<Typography variant="subtitle1">
										Type: {attribute.setting.type},
										Sub-Type:{' '}
										{attribute.setting.type ===
										SupportedAttributes.text
											? (
													attribute.setting as TextTypeSettingDbModel
											  ).textType
											: null}
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
												handleEditAttribute(attribute);
											}}
										>
											Edit
										</Button>
										<Button
											variant="outlined"
											color="warning"
											onClick={() => {
												handlePendingDeleteAttribute(
													attribute
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
			) : (
				<Typography variant="body1">No fields added yet</Typography>
			)}

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
							submitButtonLabel="Submit"
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

const CollectionViewer = ({ slug }: { slug: string }) => {
	const { collections } = useContext(CollectionContext);

	const [collection, setCollection] = useState<CollectionDbModel | null>();

	const [pendingDeleteCollection, setPendingDeleteCollection] =
		useState<CollectionDbModel | null>(null);

	const [selectedEditCollection, setSelectedEditCollection] =
		useState<CollectionDbModel | null>(null);

	const [isEditCollectionDialogOpen, setIsEditCollectionDialogOpen] =
		useState(false);

	useEffect(() => {
		const selectedCollection = collections.find(
			(collection) => collection.slug === slug
		);
		if (selectedCollection) setCollection(selectedCollection);
	}, [collections, slug]);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const collectionMenuOpen = Boolean(anchorEl);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleEditCollection = () => {
		setAnchorEl(null);
	};

	const handleDeleteCollection = () => {
		setAnchorEl(null);
	};

	const handleCollectionSettingClick = (
		event: React.MouseEvent<HTMLElement>
	) => {
		setAnchorEl(event.currentTarget);
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
						onConfirm={() => {}}
						title="Delete Collection"
						content={
							<Typography>
								Are you sure you want to delete the collection -{' '}
								{pendingDeleteCollection?.collectionName}?
							</Typography>
						}
						onFinish={() => {}}
					/>
				</div>
			) : null}
		</>
	);
};

export default CollectionViewer;
