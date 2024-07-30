import {
	AttributeInfoFormValues,
	AttributeSettingsHelper
} from '../../../components/features/collection/forms/AttributeTypesForm';
import { BaseContent } from './AttributeContents';
import {
	AttributeSettingTypes,
	MediaTypeSetting,
	TypeSetting,
	TypeSettingDbModel
} from './AttributeTypeSettings';

interface Attribute {
	setting: AttributeSettingTypes;
	content: BaseContent;
}
export class CollectionAttribute {
	public setting: AttributeSettingTypes;
	public content: BaseContent;

	constructor(values: AttributeInfoFormValues);
	constructor(attribute: Attribute);

	constructor(values: AttributeInfoFormValues | Attribute) {
		this.content = new BaseContent();

		if (values instanceof AttributeInfoFormValues) {
			// Handle constructor with values parameter
			this.setting = new TypeSetting(
				values.baseSettings.attributeName,
				values.baseSettings.type
			);

			switch (values.baseSettings.type) {
				case 'text': {
					this.setting =
						AttributeSettingsHelper.toTextTypeSetting(values);
					break;
				}
				case 'media': {
					this.setting = MediaTypeSetting.toMediaTypeSetting(values);
					break;
				}
			}
		} else {
			// Handle constructor with setting and content parameters
			this.setting = values.setting;
			if (values.content) {
				this.content = values.content;
			}
		}
	}
}

export interface CollectionAttributeDbModel {
	_id: string;
	setting: TypeSettingDbModel;
	content: BaseContent;
}
