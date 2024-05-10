import { Badge, Button, IconButton, Stack, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CollectionViewer from './CollectionViewer';
import { useContext, useState } from 'react';
import { CreateCollectionDialog } from './CollectionComponents';
import {
	AttributeSettingTypes,
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
	get collectionAttributeTypeSettings(): CollectionAttribute[];
	build(): CollectionForm;
}

/**
 * Data for creating a collection in the dialog.
 */
export class CollectionBuilder implements ICollectionBuilder {
	private form: CollectionForm = new CollectionForm();

	reset(): CollectionBuilder {
		this.form = new CollectionForm();
		return this;
	}

	get collectionInfo(): CollectionInfo {
		return this.form.info;
	}

	get collectionAttributeTypeSettings(): CollectionAttribute[] {
		return this.form.attributes;
	}

	setCollectionInfo(
		name: string,
		description: string = '',
		subdirectory: string = ''
	): CollectionBuilder {
		this.form.info = {
			name: name,
			description: description,
			subdirectory: subdirectory
		};
		return this;
	}

	setAttributeTypeSettings(
		settings: CollectionAttribute[]
	): CollectionBuilder {
		this.form.attributes = settings;
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

	removeAttributeTypeSetting(name: string): CollectionBuilder {
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
		<div>
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
						<CollectionViewer slug={selectedCollection.slug} />
					) : null}
				</div>
			</div>

			<CreateCollectionDialog
				open={addCollectionDialogOpen}
				onFinish={() => {}}
				onClose={handleCloseAddCollectionDialog}
			/>
		</div>
	);
};

export default CollectionBuilderComponent;
