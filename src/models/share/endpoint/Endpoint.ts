export interface CollectionEndpointParams {
	prefix: string;
	slug: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
	status: 'published' | 'draft';
	visibility: 'public' | 'private';
}

export interface IEndpoint {
	prefix: string;
	slug: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
	status: 'published' | 'draft';
	visibility: 'public' | 'private';
	createdAt: Date;
	updatedAt: Date;
}

export interface ICollectionEndpoint {
	username: string;
	prefix: string;
	slug: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
	status: 'published' | 'draft';
	visibility: 'public' | 'private';
	createdAt: Date;
	updatedAt: Date;
}
