import { PostsTypeSetting } from './AttributeTypeSettings';
import { AttributeInfoFormValues } from '../../../components/features/collection/forms/AttributeTypesForm';
import {
	TextSchema,
	CodeSchema,
	MediaExtensions,
	DocumentExtensions,
	DocumentSchema,
	DateFormats,
	NumberSchema,
	DecimalSchema,
	DateSchema,
	TextContentTypes,
	CodeLanguageTypes,
	MediaContentTypes,
	ImageSchema,
	AudioSchema,
	VideoSchema
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
	static readonly require: SupportedAdvancedSettingTypes = 'require';
	static readonly unique: SupportedAdvancedSettingTypes = 'unique';
	static readonly max_length: SupportedAdvancedSettingTypes = 'max_length';
	static readonly min_length: SupportedAdvancedSettingTypes = 'min_length';
	static readonly isPrivate: SupportedAdvancedSettingTypes = 'private';
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
	subType: TextContentTypes;
}

export interface MediaTypeSettingDbModel extends TypeSettingDbModel {
	maxLength: number;
	minLength: number;
	maxSize: number;
	minSize: number;
	subType: MediaContentTypes;
}

export interface PostsTypeSettingDbModel extends TypeSettingDbModel {}

export type AttributeSettingTypes =
	| TypeSetting
	| TextTypeSetting
	| PostTypeSetting
	| PostsTypeSetting
	// | CodeTypeSetting
	| MediaTypeSetting
	| DocumentTypeSetting
	| DateTypeSetting
	| DecimalTypeSetting
	| NumberTypeSetting
	| BooleanTypeSetting
	| DynamicTypeSetting;
export class TypeSetting {
	public name: string;
	public type: SupportedAttributeTypes;
	public isRequire: boolean;
	public isUnique: boolean;
	public isPrivate: boolean;

	constructor({
		name,
		type,
		isRequire,
		isUnique,
		isPrivate
	}: {
		name: string;
		type: SupportedAttributeTypes;
		isRequire?: boolean;
		isUnique?: boolean;
		isPrivate?: boolean;
	}) {
		this.name = name;
		this.type = type;
		this.isRequire = isRequire ?? false;
		this.isUnique = isUnique ?? false;
		this.isPrivate = isPrivate ?? false;
	}
}

export class TextTypeSetting extends TypeSetting {
	public subType: TextContentTypes;
	public maxLength: number;
	public minLength: number;

	constructor(subType: TextContentTypes, values?: Partial<TextTypeSetting>) {
		super({
			name: values?.name ?? '',
			type: values?.type ?? 'text',
			isPrivate: values?.isPrivate,
			isRequire: values?.isRequire,
			isUnique: values?.isUnique
		});
		// default setting base on subType
		this.minLength = values?.minLength ?? 0;
		this.subType = subType;
		switch (subType) {
			case 'short_text':
				if (
					values?.maxLength === 0 ||
					values?.maxLength === undefined
				) {
					this.maxLength = TextSchema.maxLength;
				} else {
					this.maxLength = values?.maxLength;
				}
				break;
			case 'long_text':
			case 'reach_text':
				if (
					values?.maxLength === 0 ||
					values?.maxLength === undefined
				) {
					this.maxLength = 65535;
				} else {
					this.maxLength = values?.maxLength;
				}

				break;
		}
	}
}

export class MediaTypeSetting extends TypeSetting {
	// allowed extension
	public subType;
	public mediaExtension: MediaExtensions | ''; // set when upload file
	public maxSize!: number;
	public minSize: number;
	public maxLength!: number;
	public minLength: number;

	constructor(
		subType: MediaContentTypes,
		values?: Partial<MediaTypeSetting>
	) {
		super({
			name: values?.name ?? '',
			type: values?.type ?? 'media',
			isPrivate: values?.isPrivate,
			isRequire: values?.isRequire,
			isUnique: values?.isUnique
		});
		this.mediaExtension = '';
		this.minSize = 0;
		this.minLength = 0;
		this.subType = subType;

		switch (subType) {
			case 'image':
				if (values?.maxSize === 0 || values?.maxSize === undefined) {
					this.maxSize = ImageSchema.maxSize; // 4 MB
				} else {
					this.maxSize = values?.maxSize;
				}
				break;
			case 'audio':
				if (values?.maxSize === 0 || values?.maxSize === undefined) {
					this.maxSize = AudioSchema.maxSize; // 32 MB
				} else {
					this.maxSize = values?.maxSize;
				}

				if (
					values?.maxLength === 0 ||
					values?.maxLength === undefined
				) {
					this.maxLength = AudioSchema.maxLength;
				} else {
					this.maxLength = values?.maxLength;
				}
				break;
			case 'video':
				if (values?.maxSize === 0 || values?.maxSize === undefined) {
					this.maxSize = VideoSchema.maxSize; // 512 MB
				} else {
					this.maxSize = values?.maxSize;
				}

				if (
					values?.maxLength === 0 ||
					values?.maxLength === undefined
				) {
					this.maxLength = VideoSchema.maxLength;
				} else {
					this.maxLength = values?.maxLength;
				}
				break;
		}
	}

	public static toMediaTypeSetting(values: AttributeInfoFormValues) {
		const mediaSetting = new MediaTypeSetting(
			values.baseSettings.subType as MediaContentTypes,
			{
				name: values.baseSettings.attributeName,
				isRequire: values.advancedSettings.required,
				isUnique: values.advancedSettings.unique,
				isPrivate: values.advancedSettings.private,
				maxLength: values.advancedSettings.maxLength,
				minLength: values.advancedSettings.minLength,
				maxSize: values.advancedSettings.maxSize,
				minSize: values.advancedSettings.minSize
			}
		);

		return mediaSetting;
	}
}

export class PostTypeSetting extends TypeSetting {
	public comment: boolean;
	public reaction: boolean;

	constructor() {
		super();
		this.type = 'post';
		this.comment = true;
		this.reaction = true;
	}
}

export class PostsTypeSetting extends TypeSetting {
	constructor() {
		super();
		this.type = 'posts';
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
