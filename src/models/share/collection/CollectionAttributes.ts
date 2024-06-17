import { AttributeInfoFormValues } from '../../../components/features/collection/forms/AttributeTypesForm';
import { BaseContent } from './AttributeContents';
import {
	AttributeSettingTypes,
	MediaTypeSetting,
	TextTypeSetting,
	TypeSetting,
	TypeSettingDbModel
} from './AttributeTypeSettings';
import { MediaContentTypes, TextContentTypes } from './BaseSchema';

export class CollectionAttribute {
	public setting: AttributeSettingTypes;
	public content: BaseContent;

	constructor(setting: AttributeSettingTypes, content: BaseContent);
	constructor(values: AttributeInfoFormValues);

	constructor(
		settingOrValues: AttributeSettingTypes | AttributeInfoFormValues,
		content?: BaseContent
	) {
		this.setting = new TypeSetting();
		this.content = new BaseContent();

		if (settingOrValues instanceof AttributeInfoFormValues) {
			// Handle constructor with values parameter
			const values = settingOrValues;

			// set basic setting
			this.setting.name = values.baseSettings.attributeName;
			this.setting.type = values.baseSettings.type;

			switch (values.baseSettings.type) {
				case 'text': {
					const textSetting = settingOrValues as TextTypeSetting;
					textSetting.subType = values.baseSettings
						.subType as TextContentTypes;
					textSetting.isPrivate = values.advancedSettings.private;
					textSetting.isRequire = values.advancedSettings.required;
					textSetting.isUnique = values.advancedSettings.unique;
					textSetting.maxLength = values.advancedSettings.maxLength;
					textSetting.minLength = values.advancedSettings.minLength;
					this.setting = textSetting;
					break;
				}
				case 'media': {
					const mediaSetting = settingOrValues as MediaTypeSetting;
					mediaSetting.isPrivate = values.advancedSettings.private;
					mediaSetting.isRequire = values.advancedSettings.required;
					mediaSetting.isUnique = values.advancedSettings.unique;
					mediaSetting.maxLength = values.advancedSettings.maxLength;
					mediaSetting.minLength = values.advancedSettings.minLength;
					mediaSetting.maxSize = values.advancedSettings.maxSize;
					mediaSetting.minSize = values.advancedSettings.minSize;
					mediaSetting.subType = values.baseSettings
						.subType as MediaContentTypes;
				}
			}
		} else {
			// Handle constructor with setting and content parameters
			const setting = settingOrValues as TypeSetting;
			this.setting = setting;
			if (content) {
				this.content = content;
			}
		}
	}
}

export interface CollectionAttributeDbModel {
	_id: string;
	setting: TypeSettingDbModel;
	content: BaseContent;
}
