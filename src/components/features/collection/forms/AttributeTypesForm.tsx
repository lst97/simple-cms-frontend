import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {
	SupportedAttributeTypes,
	SupportedAttributes
} from '../../../../models/share/collection/CollectionBaseSchema';
import Grid from '@mui/material/Unstable_Grid2';
import {
	MediaContentTypes,
	MediaTypes,
	TextContentTypes,
	TextTypes
} from '../../../../models/share/collection/BaseSchema';
import {
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	Radio,
	RadioGroup,
	TextField,
	Typography
} from '@mui/material';
import {
	AttributeSettingTypes,
	TextTypeSetting,
	SupportedAdvancedSettingTypes,
	SupportedAdvancedSettings,
	TypeSetting,
	MediaTypeSetting,
	PostTypeSetting,
	PostsTypeSetting
} from '../../../../models/share/collection/AttributeTypeSettings';
import Validator from '../../../../utils/Validator';
import {
	AdvancedSettingFormControlProps,
	MediaTypeSettingControlProps,
	MediaTypeSettingFormControl,
	PostTypeSettingControlProps,
	PostTypeSettingsFormControl,
	PostsTypeSettingsFormControl,
	TextTypeSettingControlProps,
	TextTypeSettingsFormControl
} from '../CollectionStepper';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function SettingsTabPanel(props: Readonly<TabPanelProps>) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`
	};
}
// included all the props for the form controller, can be safely convert
interface FormControllerProps {
	values: {
		name: string;
		subtype: TextContentTypes | MediaContentTypes | '';
		maxLength: number;
		minLength: number;
		maxSize: number;
		minSize: number;
		comment: boolean;
		reaction: boolean;
	};
	advancedSettingCtrl: AdvancedSettingFormControlProps;
	onChanges: {
		onNameChange: (name: string) => void;
		onSubtypeChange: (
			subtype: TextContentTypes | MediaContentTypes | ''
		) => void;
		onMaxLengthChange: (maxLength: number) => void;
		onMinLengthChange: (minLength: number) => void;
		onMaxSizeChange: (maxSize: number) => void;
		onMinSizeChange: (minSize: number) => void;
		onCommentChange: (comment: boolean) => void;
		onReactionChange: (reaction: boolean) => void;
	};
}
// determine which controller to use
const initFormController = (
	props: FormControllerProps,
	type?: SupportedAttributeTypes,
	controller?:
		| TextTypeSettingsFormControl
		| MediaTypeSettingFormControl
		| PostTypeSettingsFormControl
		| PostsTypeSettingsFormControl
) => {
	if (controller === undefined) {
		switch (type) {
			case 'text':
				return new TextTypeSettingsFormControl(
					props as TextTypeSettingControlProps
				);
			case 'media':
				return new MediaTypeSettingFormControl(
					props as MediaTypeSettingControlProps
				);
			case 'post':
				return new PostTypeSettingsFormControl(
					props as PostTypeSettingControlProps
				);
			default:
				return new TextTypeSettingsFormControl(
					props as TextTypeSettingControlProps
				);
		}
	}

	return controller;
};

const initSubType = (type?: SupportedAttributeTypes) => {
	switch (type) {
		case 'text':
			return TextTypes.short_text;
		case 'media':
			return MediaTypes.image;
		default:
			return '';
	}
};

export const AttributeTypesForm = ({
	onSubmit,
	controller,
	type,
	attributeId,
	submitButtonLabel
}: {
	onSubmit?: (settings: TypeSetting, attributeId?: string) => void;
	controller?:
		| TextTypeSettingsFormControl
		| MediaTypeSettingFormControl
		| PostTypeSettingsFormControl
		| PostsTypeSettingsFormControl;
	attributeId?: string;
	type?: SupportedAttributeTypes;
	submitButtonLabel?: string;
}) => {
	// default values hook
	const [name, setName] = React.useState(controller?.name ?? '');
	const [subtype, setSubtype] = React.useState<
		TextContentTypes | MediaContentTypes | ''
	>(initSubType(type));
	const [advancedSettingFlag, setAdvancedSettingFlag] = React.useState(
		controller?.settingValue ?? 0
	);
	const [maxLength, setMaxLength] = React.useState(0);
	const [minLength, setMinLength] = React.useState(0);

	const [maxSize, setMaxSize] = React.useState(0);
	const [minSize, setMinSize] = React.useState(0);

	const [comment, setComment] = React.useState(true);
	const [reaction, setReaction] = React.useState(true);

	const [ctrl] = React.useState<
		| TextTypeSettingsFormControl
		| MediaTypeSettingFormControl
		| PostTypeSettingsFormControl
		| PostsTypeSettingsFormControl
	>(
		initFormController(
			{
				values: {
					name,
					subtype,
					maxLength,
					minLength,
					maxSize,
					minSize,
					comment,
					reaction
				},
				advancedSettingCtrl: {
					value: advancedSettingFlag,
					onValueChange: setAdvancedSettingFlag
				},
				onChanges: {
					onNameChange: setName,
					onSubtypeChange: setSubtype,
					onMaxLengthChange: setMaxLength,
					onMinLengthChange: setMinLength,
					onMaxSizeChange: setMaxSize,
					onMinSizeChange: setMinSize,
					onCommentChange: setComment,
					onReactionChange: setReaction
				}
			},
			type,
			controller
		)
	);

	const [submitButtonEnable, setSubmitButtonEnable] = React.useState(false);

	// required, unique, maxLength, minLength
	const [tabValue, setTabValue] = React.useState(0);
	// const [fileType, setFileType] = React.useState<
	// 	ImageExtensions | AudioExtensions | VideoExtensions | MediaExtensions
	// >();

	const [setting, setSetting] = React.useState<AttributeSettingTypes>();

	React.useEffect(() => {
		switch (type) {
			case SupportedAttributes.text:
				setSetting(new TextTypeSetting('short_text'));
				break;
			case SupportedAttributes.media:
				setSetting(new MediaTypeSetting('image'));
				break;
			case SupportedAttributes.post:
				setSetting(new PostTypeSetting());
				break;
			case SupportedAttributes.posts:
				setSetting(new PostsTypeSetting());
				break;
		}
	}, [type]);

	const handleSubmit = () => {
		if (setting) {
			if (setting instanceof TextTypeSetting) {
				setting.isRequire = !!(advancedSettingFlag & 1);
				setting.isUnique = !!(advancedSettingFlag & 2);
				setting.textSubType = subtype as TextContentTypes;
				setting.name = name;

				ctrl.onNameChange(name);
				(ctrl as TextTypeSettingsFormControl).onSubtypeChange(
					subtype as TextContentTypes
				);
				ctrl.onSettingValueChange(advancedSettingFlag);
			}

			if (setting instanceof MediaTypeSetting) {
				setting.isRequire = !!(advancedSettingFlag & 1);
				setting.isUnique = !!(advancedSettingFlag & 2);
				setting.mediaSubType = subtype as MediaContentTypes;
				setting.name = name;

				ctrl.onNameChange(name);
				(ctrl as MediaTypeSettingFormControl).onSubtypeChange(
					subtype as MediaContentTypes
				);
				ctrl.onSettingValueChange(advancedSettingFlag);
			}

			if (setting instanceof PostTypeSetting) {
				setting.comment = comment;
				setting.reaction = reaction;
				setting.name = name;

				ctrl.onNameChange(name);
				(ctrl as PostTypeSettingsFormControl).onCommentChange(comment);
				(ctrl as PostTypeSettingsFormControl).onReactionChange(
					reaction
				);
			}

			if (setting instanceof PostsTypeSetting) {
				setting.name = name;
				ctrl.onNameChange(name);
			}

			onSubmit?.(setting as TypeSetting, attributeId);
		}
	};
	const handleSubTypeChange = (
		_event: React.ChangeEvent<HTMLInputElement>,
		value: string
	) => {
		switch (value) {
			case TextTypes.short_text:
			case TextTypes.long_text:
			case TextTypes.reach_text:
				(ctrl as TextTypeSettingsFormControl).onSubtypeChange(value);
				break;
			case MediaTypes.image:
			case MediaTypes.audio:
			case MediaTypes.video:
				(ctrl as MediaTypeSettingFormControl).onSubtypeChange(value);
				break;
			case 'code':
				break;
		}
	};

	const handleTypeNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = event.target.value;
		const isValid = Validator.isValidName(value);
		setSubmitButtonEnable(isValid);
		setName(value);
		ctrl.onNameChange(value);
		controller?.onNameChange(value);
	};

	const handleAdvancedSettingsChange = (
		advancedSettingTypes: SupportedAdvancedSettingTypes,
		value: boolean
	) => {
		const prev = advancedSettingFlag;
		switch (advancedSettingTypes) {
			case SupportedAdvancedSettings.require:
				ctrl.onSettingValueChange(value ? prev | 1 : prev & ~1);
				setAdvancedSettingFlag(value ? prev | 1 : prev & ~1);
				break;
			case SupportedAdvancedSettings.unique:
				ctrl.onSettingValueChange(value ? prev | 2 : prev & ~2);
				setAdvancedSettingFlag(value ? prev | 2 : prev & ~2);
				break;
			case SupportedAdvancedSettings.max_length:
				ctrl.onSettingValueChange(value ? prev | 4 : prev & ~4);
				setAdvancedSettingFlag(value ? prev | 4 : prev & ~4);
				break;
			case SupportedAdvancedSettings.min_length:
				ctrl.onSettingValueChange(value ? prev | 8 : prev & ~8);
				setAdvancedSettingFlag(value ? prev | 8 : prev & ~8);
				break;
		}
	};
	const textSubTypeOptions = () => {
		return (
			<RadioGroup
				row
				aria-labelledby="text-type-radio-buttons-group-label"
				onChange={handleSubTypeChange}
				value={(ctrl as TextTypeSettingsFormControl).subtype}
				name="text-type-radio-buttons-group"
			>
				<FormControlLabel
					value={TextTypes.short_text}
					control={<Radio />}
					label={
						<React.Fragment>
							<Typography variant="body1">Short Text</Typography>
							<Typography variant="caption">
								Best for titles, names, and links(URL).
							</Typography>
						</React.Fragment>
					}
				/>
				<FormControlLabel
					value={TextTypes.long_text}
					control={<Radio />}
					label={
						<React.Fragment>
							<Typography variant="body1">Long Text</Typography>
							<Typography variant="caption">
								Best for descriptions, biography.
							</Typography>
						</React.Fragment>
					}
				/>
				<FormControlLabel
					value={TextTypes.reach_text}
					control={<Radio />}
					label={
						<React.Fragment>
							<Typography variant="body1">Reach Text</Typography>
							<Typography variant="caption">
								Best for blog posts, articles, and notes.
							</Typography>
						</React.Fragment>
					}
				/>
			</RadioGroup>
		);
	};

	const mediaSubTypeOptions = () => {
		return (
			<RadioGroup
				row
				aria-labelledby="media-type-radio-buttons-group-label"
				onChange={handleSubTypeChange}
				value={(ctrl as MediaTypeSettingFormControl).subtype}
				name="media-type-radio-buttons-group"
			>
				<FormControlLabel
					value={MediaTypes.image}
					control={<Radio />}
					label={
						<React.Fragment>
							<Typography variant="body1">Image</Typography>
							<Typography variant="caption">
								jpg, png, gif, svg.
							</Typography>
						</React.Fragment>
					}
				/>
				<FormControlLabel
					value={MediaTypes.audio}
					control={<Radio />}
					label={
						<React.Fragment>
							<Typography variant="body1">Audio</Typography>
							<Typography variant="caption">
								mp3, wav, ogg.
							</Typography>
						</React.Fragment>
					}
				/>
				<FormControlLabel
					value={MediaTypes.video}
					control={<Radio />}
					label={
						<React.Fragment>
							<Typography variant="body1">Video</Typography>
							<Typography variant="caption">
								mp4, webm, ogg
							</Typography>
						</React.Fragment>
					}
				/>
			</RadioGroup>
		);
	};
	const getSubTypeOptions = (type: SupportedAttributeTypes) => {
		switch (type) {
			case SupportedAttributes.text:
				return textSubTypeOptions();
			case SupportedAttributes.media:
				return mediaSubTypeOptions();
		}
	};

	const getAdditionalBaseOptions = (type: SupportedAttributeTypes) => {
		switch (type) {
			case 'post':
				return (
					<FormGroup>
						<FormControlLabel
							value="comment"
							control={
								<Checkbox
									checked={comment}
									onChange={(e) => {
										(
											ctrl as PostTypeSettingsFormControl
										).onCommentChange(e.target.checked);
									}}
								/>
							}
							label="Comment"
						/>
						<FormControlLabel
							value="reaction"
							control={
								<Checkbox
									checked={reaction}
									onChange={(e) => {
										(
											ctrl as PostTypeSettingsFormControl
										).onReactionChange(e.target.checked);
									}}
								/>
							}
							label="Reaction"
						/>
					</FormGroup>
				);
		}
	};

	const BaseSettings = () => {
		if (type) {
			return (
				<Box>
					<FormControl>
						<TextField
							id="type-name-input"
							label="Name"
							required={true}
							helperText="No spaces allowed"
							value={name}
							variant="outlined"
							onChange={handleTypeNameChange}
						/>
						{getSubTypeOptions(type)}
						{getAdditionalBaseOptions(type)}
					</FormControl>
				</Box>
			);
		}
	};

	const AdvancedSettings = ({
		required,
		unique,
		maxLength,
		minLength
	}: {
		required?: boolean;
		unique?: boolean;
		maxLength?: boolean;
		minLength?: boolean;
	}) => {
		switch (type) {
			case SupportedAttributes.text:
			case SupportedAttributes.media:
				return (
					<Box>
						<FormGroup>
							<Grid container spacing={2}>
								{required !== undefined && (
									<Grid xs={6}>
										<FormControlLabel
											value={
												SupportedAdvancedSettings.require
											}
											control={
												<Checkbox
													checked={
														!!(
															advancedSettingFlag &
															1
														)
													}
													onChange={(e) => {
														handleAdvancedSettingsChange(
															SupportedAdvancedSettings.require,
															e.target.checked
														);
													}}
												/>
											}
											label="Required"
										/>
									</Grid>
								)}
								{unique !== undefined && (
									<Grid xs={6}>
										<FormControlLabel
											value={
												SupportedAdvancedSettings.unique
											}
											control={
												<Checkbox
													checked={
														!!(
															advancedSettingFlag &
															2
														)
													}
													onChange={(e) => {
														handleAdvancedSettingsChange(
															SupportedAdvancedSettings.unique,
															e.target.checked
														);
													}}
												/>
											}
											label="Unique"
										/>
									</Grid>
								)}
								{maxLength !== undefined && (
									<Grid xs={6}>
										<FormControlLabel
											value={
												SupportedAdvancedSettings.max_length
											}
											control={
												<Checkbox
													checked={
														!!(
															advancedSettingFlag &
															4
														)
													}
													onChange={(e) => {
														handleAdvancedSettingsChange(
															SupportedAdvancedSettings.max_length,
															e.target.checked
														);
													}}
												/>
											}
											label="Max length"
										/>
									</Grid>
								)}
								{minLength !== undefined && (
									<Grid xs={6}>
										<FormControlLabel
											value={
												SupportedAdvancedSettings.min_length
											}
											control={
												<Checkbox
													checked={
														!!(
															advancedSettingFlag &
															8
														)
													}
													onChange={(e) => {
														handleAdvancedSettingsChange(
															SupportedAdvancedSettings.min_length,
															e.target.checked
														);
													}}
												/>
											}
											label="Min length"
										/>
									</Grid>
								)}
							</Grid>
						</FormGroup>
					</Box>
				);
		}
	};

	const SettingTabs = () => {
		const handleChange = (
			_event: React.SyntheticEvent,
			newValue: number
		) => {
			setTabValue(newValue);
		};

		return (
			<Box sx={{ width: '100%' }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs
						value={tabValue}
						onChange={handleChange}
						aria-label="setting tabs"
					>
						<Tab label="BASE SETTINGS" {...a11yProps(0)} />
						<Tab label="ADVANCED SETTINGS" {...a11yProps(1)} />
					</Tabs>
				</Box>
				<SettingsTabPanel value={tabValue} index={0}>
					{BaseSettings()}
				</SettingsTabPanel>
				<SettingsTabPanel value={tabValue} index={1}>
					<AdvancedSettings
						required={false}
						unique={false}
						maxLength={false}
						minLength={false}
					/>
				</SettingsTabPanel>
				{onSubmit && (
					<Button
						onClick={handleSubmit}
						variant="contained"
						disabled={!submitButtonEnable}
					>
						{submitButtonLabel ?? 'Submit'}
					</Button>
				)}
			</Box>
		);
	};

	return <>{ctrl ? <Box>{SettingTabs()}</Box> : null}</>;
};
