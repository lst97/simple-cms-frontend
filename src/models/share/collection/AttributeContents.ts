export interface IBaseContent {
	_id?: string;
	value?: ContentValue;
}

export type ContentValue = string | IMediaContent | IMediaContent[];

export interface BaseContentProps {
	value?: ContentValue;
	sessionId?: string;
	total?: number;
	groupId?: string;
}

export class BaseContent implements IBaseContent {
	_id?: string;
	value?: ContentValue;
}

export interface IParallelFilesUploadContent {
	sessionId: string;
	total: number;
	groupId?: string;
	value?: IMediaContent[];
}

export interface IMediaContent {
	url: string;
	file?: string; // base64
	fileName: string;
}
