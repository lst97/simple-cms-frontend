import { SupportedAttributes } from './CollectionBaseSchema';

export type TextContentTypes = 'short_text' | 'long_text' | 'reach_text';
export class TextTypes {
	static short_text: TextContentTypes = 'short_text';
	static long_text: TextContentTypes = 'long_text';
	static reach_text: TextContentTypes = 'reach_text';
}

export class MediaTypes {
	static image: MediaContentTypes = 'image';
	static audio: MediaContentTypes = 'audio';
	static video: MediaContentTypes = 'video';
}
export class TextSchema {
	static type = SupportedAttributes.text;
	static textType: TextContentTypes = TextTypes.short_text;
	static maxLength: number = 255;
	static minLength: number = 0;
}

export type CodeLanguageTypes = 'javascript' | 'python' | 'java' | 'plaintext';
export class CodeSchema {
	static type = 'code';
	static language: CodeLanguageTypes = 'plaintext';
	static maxLength: number = 65535;
	static minLength: number = 0;
}

export class ImageExtensions {
	static jpg: string = 'jpg';
	static png: string = 'png';
	static gif: string = 'gif';
	static svg: string = 'svg';
}

export class AudioExtensions {
	static mp3: string = 'mp3';
	static wav: string = 'wav';
	static ogg: string = 'ogg';
}

export class VideoExtensions {
	static mp4: string = 'mp4';
	static webm: string = 'webm';
	static ogg: string = 'ogg';
}

export type MediaContentTypes = 'image' | 'audio' | 'video';
export type ImageExtensionTypes = 'jpg' | 'jpeg' | 'png' | 'gif' | 'svg';
export type AudioExtensionTypes = 'mp3' | 'wav' | 'ogg';
export type VideoExtensionTypes = 'mp4' | 'webm' | 'ogg';
export type MediaExtensions =
	| 'jpg'
	| 'jpeg'
	| 'png'
	| 'gif'
	| 'svg'
	| 'mp3'
	| 'wav'
	| 'ogg'
	| 'mp4';
export class ImageSchema {
	static type = 'media';
	static mediaType: MediaContentTypes = 'image';
	static extension: MediaExtensions = 'jpg';
	static maxSize: number = 4194304; // 4MB
	static maxLength: number = 16; // 16 images per attribute
}

export class AudioSchema {
	static type = 'media';
	static mediaType: MediaContentTypes = 'audio';
	static extension: MediaExtensions = 'mp3';
	static maxSize: number = 33554432; // 32MB
	static maxLength: number = 300; // 300 seconds per attribute
}

export class VideoSchema {
	static type = 'media';
	static mediaType: MediaContentTypes = 'video';
	static extension: MediaExtensions = 'mp4';
	static maxSize: number = 536870912; // 512MB
	static maxLength: number = 900; // 900 seconds per attribute
}

export type DocumentExtensions =
	| 'pdf'
	| 'doc'
	| 'docx'
	| 'xls'
	| 'xlsx'
	| 'ppt'
	| 'pptx'
	| 'txt'
	| 'csv'
	| 'json'
	| 'xml';

export class DocumentSchema {
	static type = 'document';
	static extension: DocumentExtensions = 'pdf';
	static maxSize: number = 1048576; // 10MB
}

export type DateFormats =
	| 'YYYY-MM-DD'
	| 'YYYY-MM-DDTHH:mm:ssZ'
	| 'DD-MM-YYYY'
	| 'DD-MM-YYYYTHH:mm:ssZ';
export class DateSchema {
	static type = 'date';
	static format: DateFormats = 'DD-MM-YYYYTHH:mm:ssZ';
}

export class NumberSchema {
	static type = 'number';
	static min: number = -Infinity;
	static max: number = Infinity;
}

export class DecimalSchema {
	static type = 'decimal';
	static min: number = -Infinity;
	static max: number = Infinity;
	static precision: [number, number] = [0, 0];
}

export class BooleanSchema {
	static type = 'boolean';
}

export class DynamicSchema {
	static type = 'dynamic';
	static content = {};
}
