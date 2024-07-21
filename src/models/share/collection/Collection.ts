import { CollectionAttributeDbModel } from './CollectionAttributes';

export type SupportedCollectionKind = 'collection' | 'post' | 'posts';
export interface ICollectionDbModel {
	_id: string;
	kind: SupportedCollectionKind;
	username: string;
	collectionName: string;
	description?: string;
	slug: string;
	ref?: string;
	attributes: CollectionAttributeDbModel[];
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
	ref!: string;
	attributes: CollectionAttributeDbModel[] = [];
	createdAt!: string;
	updatedAt!: string;
	_id!: string;
}
