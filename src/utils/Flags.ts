import { SupportedAdvancedSettingsBit } from '../models/share/collection/AttributeTypeSettings';

interface CollectionAdvancedSettingFlagParams {
	required?: boolean;
	unique?: boolean;
	maxLength?: boolean;
	minLength?: boolean;
	private?: boolean;
}

export const getCollectionAdvancedSettingFlag = (
	params: CollectionAdvancedSettingFlagParams
) => {
	let settingFlag = 0;
	if (params.required) settingFlag |= SupportedAdvancedSettingsBit.REQUIRE;
	if (params.unique) settingFlag |= SupportedAdvancedSettingsBit.UNIQUE;
	if (params.maxLength)
		settingFlag |= SupportedAdvancedSettingsBit.MAX_LENGTH;
	if (params.minLength)
		settingFlag |= SupportedAdvancedSettingsBit.MIN_LENGTH;
	if (params.private) settingFlag |= SupportedAdvancedSettingsBit.PRIVATE;

	return settingFlag;
};
