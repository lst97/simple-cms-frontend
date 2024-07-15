import { CollectionAttributeDbModel } from './CollectionAttributes';

export type SupportedCollectionKind = 'collection' | 'post' | 'posts';
export interface PostCollectionSettingProps {
	comment: boolean;
	reaction: boolean;
}
export interface ICollectionDbModel {
	kind: SupportedCollectionKind;
	username: string;
	collectionName: string;
	description?: string;
	slug: string;
	setting?: PostCollectionSettingProps;
	attributes: CollectionAttributeDbModel[] | ICollectionDbModel[];
	createdAt: string;
	updatedAt: string;
}
/**
 * Collection model, mainly used to store collection data from the api response.
 */
export class CollectionDbModel {
	kind!: SupportedCollectionKind;
	username!: string;
	collectionName!: string;
	description!: string;
	slug!: string;
	setting!: PostCollectionSettingProps;
	attributes: (CollectionAttributeDbModel | CollectionDbModel)[] = [];
	createdAt!: string;
	updatedAt!: string;
	_id!: string;
}
