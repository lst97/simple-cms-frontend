import { BaseContent } from './AttributeContents';
import { TypeSetting, TypeSettingDbModel } from './AttributeTypeSettings';

export class CollectionAttribute {
	public setting: TypeSetting;
	public content: BaseContent;

	constructor(setting: TypeSetting, content: BaseContent) {
		this.setting = setting;
		this.content = content;
	}
}

export interface CollectionAttributeDbModel {
	_id: string;
	setting: TypeSettingDbModel;
	content: BaseContent;
}
