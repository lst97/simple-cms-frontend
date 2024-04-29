import { Badge, Button, IconButton, Stack, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CollectionViewer from './CollectionViewer';
import { useContext, useState } from 'react';
import { CreateCollectionDialog } from './CollectionController';
import {
	AttributeSettingTypes,
	TextTypeSetting
} from '../../../models/share/collection/AttributeTypeSettings';
import { CollectionForm } from '../../../models/forms/auth/CollectionForm';
import {
	CollectionAttribute,
	CollectionAttributeDbModel
} from '../../../models/share/collection/CollectionAttributes';
import { BaseContent } from '../../../models/share/collection/AttributeContents';
import { CollectionDbModel } from '../../../models/share/collection/Collection';
import { CollectionContext } from '../../../context/CollectionContext';

interface ICollectionBuilder {
	reset(): CollectionBuilder;
	setCollectionBase(name: string, description: string): CollectionBuilder;
	addAttributeTypeSetting(type: AttributeSettingTypes): CollectionBuilder;
	build(): CollectionBuilder;
}

export class CollectionBuilder implements ICollectionBuilder {
	private form: CollectionForm = new CollectionForm();

	public get collectionForm(): CollectionForm {
		return this.form;
	}

	reset(): CollectionBuilder {
		this.form = new CollectionForm();
		return this;
	}

	setCollectionBase(name: string, description?: string): CollectionBuilder {
		this.form.collectionName = name;
		this.form.info = { displayName: name, description: description };
		return this;
	}
	addAttributeTypeSetting(setting: AttributeSettingTypes): CollectionBuilder {
		switch (setting.constructor) {
			case TextTypeSetting:
				this.form.attributes?.push(
					new CollectionAttribute(
						setting as TextTypeSetting,
						new BaseContent()
					)
				);
				break;
			default:
				console.log('Unknown setting type');
		}
		return this;
	}
	build(): CollectionBuilder {
		throw new Error('Method not implemented.');
	}
}
function CollectionBuilderComponent() {
	const { collections } = useContext(CollectionContext);

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

	function AddCollection() {
		return (
			<div
				className="hover:bg-slate-200 hover:cursor-pointer rounded-md text-sky-600"
				onClick={handleAddCollectionClick}
			>
				<Typography variant="body1" sx={{ padding: 1 }}>
					+ Create new collection
				</Typography>
			</div>
		);
	}

	return (
		<>
			<div className="flex flex-row h-full">
				<div className="basis-1/4 bg-slate-100 w-full">
					<div className="flex flex-col">
						<div className="flex flex-row w-full gap-1 px-8 pt-8 pb-2 justify-between">
							<Badge
								badgeContent={collections.length}
								color="primary"
							>
								<Typography variant="h6">COLLECTION</Typography>
							</Badge>
							<IconButton>
								<SearchIcon />
							</IconButton>
						</div>

						<div className="flex flex-col gap-2 mx-8">
							{collections.map((collection) => (
								<Button
									variant="text"
									key={collection.slug}
									sx={{ justifyContent: 'flex-start' }}
									onClick={() => {
										setSelectedCollection(collection);
									}}
								>
									<Stack
										direction="column"
										spacing={1}
										textAlign="left"
									>
										<Typography variant="body1">
											{collection.collectionName}
										</Typography>
										<Typography
											variant="caption"
											color="gray"
										>
											{collection.slug}
										</Typography>
									</Stack>
								</Button>
							))}
						</div>
						<AddCollection />
					</div>
				</div>
				<div className="basis-3/4 bg-slate-50 w-full">
					{selectedCollection ? (
						<CollectionViewer
							title={selectedCollection?.collectionName || ''}
							description={selectedCollection?.description || ''}
							fields={
								(selectedCollection?.attributes as CollectionAttributeDbModel[]) ||
								[]
							}
						/>
					) : null}
				</div>
			</div>

			<CreateCollectionDialog
				open={addCollectionDialogOpen}
				onFinish={() => {}}
				onClose={handleCloseAddCollectionDialog}
			/>
		</>
	);
}

export default CollectionBuilderComponent;
