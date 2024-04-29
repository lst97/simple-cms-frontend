import CollectionBaseSchema, {
	CollectionInfo
} from '../../share/collection/CollectionBaseSchema';
import { CollectionAttribute } from '../../share/collection/CollectionAttributes';

export class CollectionForm implements CollectionBaseSchema {
	kind: 'collection';
	collectionName?: string; // db key name and path name
	info?: CollectionInfo;
	attributes: CollectionAttribute[];

	constructor() {
		this.attributes = [];
		this.kind = 'collection';
	}
}
