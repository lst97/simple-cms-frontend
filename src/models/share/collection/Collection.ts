import { CollectionAttributeDbModel } from './CollectionAttributes';

export interface PostCollectionSettingProps {
	comment: boolean;
	reaction: boolean;
}
export interface ICollectionDbModel {
	kind: 'collection' | 'post' | 'posts';
	username: string;
	collectionName: string;
	description?: string;
	slug: string;
	setting?: PostCollectionSettingProps;
	attributes: CollectionAttributeDbModel[] | ICollectionDbModel[];
	createdAt: Date;
	updatedAt: Date;
}
/**
 * Collection model, mainly used to store collection data from the api response.
 */
export class CollectionDbModel {
	kind!: 'collection' | 'post' | 'posts';
	username!: string;
	collectionName!: string;
	description!: string;
	slug!: string;
	setting!: PostCollectionSettingProps;
	attributes: (CollectionAttributeDbModel | CollectionDbModel)[] = [];
	createdAt!: Date;
	updatedAt!: Date;
	_id!: string;
}
