import { CollectionAttributeDbModel } from './CollectionAttributes';

export interface ICollectionDbModel {
	username: string;
	collectionName: string;
	description?: string;
	slug: string;
	attributes: CollectionAttributeDbModel[];
	createdAt: Date;
	updatedAt: Date;
}
/**
 * Collection model, mainly used to store collection data from the api response.
 */
export class CollectionDbModel {
	username!: string;
	collectionName!: string;
	description!: string;
	slug!: string;
	attributes: CollectionAttributeDbModel[] = [];
	createdAt!: Date;
	updatedAt!: Date;
}
