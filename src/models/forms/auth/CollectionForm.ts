import { CollectionAttribute } from '../../share/collection/CollectionAttributes';
interface CollectionFormProps {
	kind: 'collection' | 'post' | 'posts';
	info: CollectionInfo;
	attributes: CollectionAttribute[];
}

export interface CollectionInfo {
	name: string;
	description: string;
	subdirectory: string;
}

export class CollectionForm implements CollectionFormProps {
	kind: 'collection' | 'post' | 'posts';
	info: CollectionInfo;
	attributes: CollectionAttribute[];

	constructor() {
		this.kind = 'collection';
		this.info = { name: '', description: '', subdirectory: '' };
		this.attributes = [];
	}

	public setCollectionInfo({
		name,
		description,
		subdirectory
	}: CollectionInfo) {
		this.info = { name, description, subdirectory };
	}

	public addAttribute(attribute: CollectionAttribute) {
		this.attributes.push(attribute);
	}
}
