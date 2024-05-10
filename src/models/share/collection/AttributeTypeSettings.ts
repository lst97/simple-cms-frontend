import {
	TextSchema,
	CodeSchema,
	MediaTypes,
	MediaExtensions,
	DocumentExtensions,
	DocumentSchema,
	DateFormats,
	NumberSchema,
	DecimalSchema,
	MediaSchema,
	DateSchema,
	TextContentTypes,
	CodeLanguageTypes
} from './BaseSchema';
import { SupportedAttributeTypes } from './CollectionBaseSchema';

export type SupportedAdvancedSettingTypes =
	| 'require' // 1
	| 'unique' // 2
	| 'max_length' // 4
	| 'min_length' // 8
	| 'private'; // 16

export enum SupportedAdvancedSettingsBit {
	REQUIRE = 1,
	UNIQUE = 2,
	MAX_LENGTH = 4,
	MIN_LENGTH = 8,
	PRIVATE = 16
}

export class SupportedAdvancedSettings {
	static require: SupportedAdvancedSettingTypes = 'require';
	static unique: SupportedAdvancedSettingTypes = 'unique';
	static max_length: SupportedAdvancedSettingTypes = 'max_length';
	static min_length: SupportedAdvancedSettingTypes = 'min_length';
	static isPrivate: SupportedAdvancedSettingTypes = 'private';
}
export interface TypeSettingDbModel {
	_id: string;
	name: string;
	type: SupportedAttributeTypes;
	isRequire: boolean;
	isUnique: boolean;
	private: boolean;
}
export interface TextTypeSettingDbModel extends TypeSettingDbModel {
	maxLength: number;
	minLength: number;
	textType: TextContentTypes;
}

export type AttributeSettingTypes =
	| TypeSetting
	| TextTypeSetting
	| CodeTypeSetting
	| MediaTypeSetting
	| DocumentTypeSetting
	| DateTypeSetting
	| DecimalTypeSetting
	| NumberTypeSetting
	| BooleanTypeSetting
	| DynamicTypeSetting;
export class TypeSetting {
	public name: string = '';
	public type: string = '';
	public isRequire: boolean = false;
	public isUnique: boolean = false;
	public private: boolean = false;
}

export class TextTypeSetting extends TypeSetting {
	public maxLength: number = 0;
	public minLength: number = 0;
	private textType: TextContentTypes = 'short_text';

	constructor() {
		super();
		this.type = TextSchema.type;
		this.maxLength = TextSchema.maxLength;
		this.minLength = TextSchema.minLength;
		this.textType = TextSchema.textType;
	}

	public getTextType(): TextContentTypes {
		return this.textType;
	}

	public setTextType(value: TextContentTypes) {
		switch (value) {
			case 'short_text':
				this.maxLength = 255;
				break;
			case 'long_text':
			case 'reach_text':
				this.maxLength = 65535;
				break;
		}

		this.textType = value;
	}
}

export class CodeTypeSetting extends TextTypeSetting {
	private _language: CodeLanguageTypes;

	constructor() {
		super();
		this.type = CodeSchema.type;
		this._language = CodeSchema.language;
		this.maxLength = CodeSchema.maxLength;
		this.minLength = CodeSchema.minLength;
	}

	public set language(value: CodeLanguageTypes) {
		this._language = value;
	}
}

export class MediaTypeSetting extends TypeSetting {
	private _mediaType: MediaTypes;
	private _mediaExtension: MediaExtensions;
	private _maxSize: number;

	constructor() {
		super();
		this.type = MediaSchema.type;
		this._mediaExtension = MediaSchema.extension;
		this._mediaType = MediaSchema.mediaType;
		this._maxSize = MediaSchema.maxSize;
	}

	public set mediaType(value: MediaTypes) {
		this._mediaType = value;
	}

	public set mediaExtension(value: MediaExtensions) {
		this._mediaExtension = value;
	}

	public set maxSize(value: number) {
		this._maxSize = value;
	}
}

export class DocumentTypeSetting extends TypeSetting {
	private _documentExtension: DocumentExtensions;
	private _maxSize: number;
	constructor() {
		super();
		this.type = DocumentSchema.type;
		this._documentExtension = DocumentSchema.extension;
		this._maxSize = DocumentSchema.maxSize;
	}

	public set documentExtension(value: DocumentExtensions) {
		this._documentExtension = value;
	}

	public set maxSize(value: number) {
		this._maxSize = value;
	}
}

export class DateTypeSetting extends TypeSetting {
	private _format: DateFormats;
	constructor() {
		super();
		this.type = DateSchema.type;
		this._format = DateSchema.format;
	}

	public set format(value: DateFormats) {
		this._format = value;
	}
}

export class NumberTypeSetting extends TypeSetting {
	private _min: number;
	private _max: number;
	constructor() {
		super();
		this.type = NumberSchema.type;
		this._min = NumberSchema.min;
		this._max = NumberSchema.max;
	}

	public set min(value: number) {
		this._min = value;
	}

	public set max(value: number) {
		this._max = value;
	}
}

export class DecimalTypeSetting extends TypeSetting {
	private _min: number;
	private _max: number;
	private _precision: [number, number];
	constructor() {
		super();
		this.type = DecimalSchema.type;
		this._min = DecimalSchema.min;
		this._max = DecimalSchema.max;
		this._precision = DecimalSchema.precision;
	}

	public set min(value: number) {
		this._min = value;
	}

	public set max(value: number) {
		this._max = value;
	}

	public set precision(value: [number, number]) {
		this._precision = value;
	}
}

export class BooleanTypeSetting {
	private _isRequire: boolean = false;
	private _private: boolean = false;

	public set isRequire(value: boolean) {
		this._isRequire = value;
	}

	public set private(value: boolean) {
		this._private = value;
	}
}

export class DynamicTypeSetting extends TypeSetting {
	private _content: unknown = {};

	constructor() {
		super();
	}

	public set content(value: unknown) {
		this._content = value;
	}
}
