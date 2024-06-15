import { AttributeInfoFormValues } from '../../../components/features/collection/forms/AttributeTypesForm';
import { BaseContent } from './AttributeContents';
import {
	TextTypeSetting,
	TypeSetting,
	TypeSettingDbModel
} from './AttributeTypeSettings';
import { TextContentTypes } from './BaseSchema';

export class CollectionAttribute {
	public setting: TypeSetting;
	public content: BaseContent;

	constructor(setting: TypeSetting, content: BaseContent);
	constructor(values: AttributeInfoFormValues);

	constructor(
		settingOrValues: TypeSetting | AttributeInfoFormValues,
		content?: BaseContent
	) {
		this.setting = new TypeSetting();
		this.content = new BaseContent();

		if (typeof settingOrValues === 'object') {
			// Handle constructor with values parameter
			const values = settingOrValues as AttributeInfoFormValues;

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
