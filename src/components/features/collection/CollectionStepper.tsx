import React from 'react';
import { SupportedAttributeTypes } from '../../../models/share/collection/CollectionBaseSchema';
import { AttributeSettingTypes } from '../../../models/share/collection/AttributeTypeSettings';
import CollectionBaseInfoForm from './forms/CollectionBaseInfoForm';
import {
	Box,
	Button,
	Typography,
	Stepper,
	Step,
	StepLabel
} from '@mui/material';
import { CollectionInfo } from '../../../models/forms/auth/CollectionForm';
import { CollectionAttribute } from '../../../models/share/collection/CollectionAttributes';
import { CollectionApiService } from '../../../services/ApiService';
import AttributeTypesGrid from './AttributeTypesGrid';
import { CollectionBuilder } from './CollectionBuilder';
import { AttributeTypesForm } from './forms/AttributeTypesForm';
import {
	TextContentTypes,
	TextTypes
} from '../../../models/share/collection/BaseSchema';

interface CollectionFormControllerProps {
	onNameChange?: React.Dispatch<React.SetStateAction<string>>;
	onDescriptionChange?: React.Dispatch<React.SetStateAction<string>>;
	onSubdirectoryChange?: React.Dispatch<React.SetStateAction<string>>;
	onAttributeTypeSettingsChange?: React.Dispatch<
		React.SetStateAction<CollectionAttribute[]>
	>;
}

interface CollectionFormValueProps {
	name?: string;
	description?: string;
	subdirectory?: string;
	attributeTypeSettings?: CollectionAttribute[];
}

interface AdvancedSettingFormControlProps {
	value: number;
	onValueChange: React.Dispatch<React.SetStateAction<number>>;
}

class AdvancedTypeSettingsFormControl {
	public settingValue: number;
	public onSettingValueChangeCallback: React.Dispatch<
		React.SetStateAction<number>
	>;

	constructor(
		value: number,
		onValueChangeCallback: React.Dispatch<React.SetStateAction<number>>
	) {
		this.settingValue = value;
		this.onSettingValueChangeCallback = onValueChangeCallback;
	}
}

class TypeSettingsFormControlBase extends AdvancedTypeSettingsFormControl {
	public name: string;
	public onNameChangeCallback: React.Dispatch<React.SetStateAction<string>>;

	constructor(
		name: string,
		onNameChangeCallback: React.Dispatch<React.SetStateAction<string>>,
		advancedSettingValue: number = 0,
		onAdvancedSettingValueChangeCallback: React.Dispatch<
			React.SetStateAction<number>
		>
	) {
		super(advancedSettingValue, onAdvancedSettingValueChangeCallback);
		this.name = name;
		this.onNameChangeCallback = onNameChangeCallback;
	}

	public onNameChange = (value: string) => {
		this.name = value;
		this.onNameChangeCallback(value);
	};

	public onSettingValueChange = (value: number) => {
		this.settingValue = value;
		this.onSettingValueChangeCallback(value);
	};
}

interface TextTypeSettingFormControlValuesProps {
	name: string;
	maxLength: number;
	minLength: number;
	subtype?: TextContentTypes;
}

interface TextTypeSettingFormControlOnChangesProps {
	onNameChange: React.Dispatch<React.SetStateAction<string>>;
	onMaxLengthChange: React.Dispatch<React.SetStateAction<number>>;
	onMinLengthChange: React.Dispatch<React.SetStateAction<number>>;
	onSubtypeChange: React.Dispatch<React.SetStateAction<string>>;
}

export class TextTypeSettingsFormControl extends TypeSettingsFormControlBase {
	public subtype: TextContentTypes;
	public maxLength: number;
	public minLength: number;
	public onMaxLengthChangeCallback: React.Dispatch<
		React.SetStateAction<number>
	>;
	public onMinLengthChangeCallback: React.Dispatch<
		React.SetStateAction<number>
	>;
	public onSubtypeChangeCallback: React.Dispatch<
		React.SetStateAction<string>
	>;

	constructor({
		values,
		onChanges,
		advancedSettingCtrl
	}: TextTypeSettingControlProps) {
		super(
			values.name,
			onChanges.onNameChange,
			advancedSettingCtrl.value,
			advancedSettingCtrl.onValueChange
		);
		this.maxLength = values.maxLength;
		this.minLength = values.minLength;
		this.subtype = 'short_text';
		this.onMaxLengthChangeCallback = onChanges.onMaxLengthChange;
		this.onMinLengthChangeCallback = onChanges.onMinLengthChange;
		this.onSubtypeChangeCallback = onChanges.onSubtypeChange;
	}

	public onMaxLengthChange = (value: number) => {
		this.maxLength = value;
		this.onMaxLengthChangeCallback(value);
	};

	public onMinLengthChange = (value: number) => {
		this.minLength = value;
		this.onMinLengthChangeCallback(value);
	};
	public onSubtypeChange = (value: string) => {
		this.subtype = value as TextContentTypes;
		this.onSubtypeChangeCallback(value);
	};
}

interface TextTypeSettingControlProps {
	values: TextTypeSettingFormControlValuesProps;
	onChanges: TextTypeSettingFormControlOnChangesProps;
	advancedSettingCtrl: AdvancedSettingFormControlProps;
}

interface TypeSettingsControls {
	textCtrl?: TextTypeSettingsFormControl;
}
export class CollectionFormController {
	private collectionBuilder: CollectionBuilder;
	public onNameChangeCallback?: React.Dispatch<React.SetStateAction<string>>;
	public onDescriptionChangeCallback?: React.Dispatch<
		React.SetStateAction<string>
	>;
	public onSubdirectoryChangeCallback?: React.Dispatch<
		React.SetStateAction<string>
	>;
	public onAttributeTypeSettingsChangeCallback?: React.Dispatch<
		React.SetStateAction<CollectionAttribute[]>
	>;

	public typeSettingsControls?: TypeSettingsControls;

	constructor(
		{
			name,
			description,
			subdirectory,
			attributeTypeSettings
		}: CollectionFormValueProps = {},
		{
			onNameChange,
			onDescriptionChange,
			onSubdirectoryChange,
			onAttributeTypeSettingsChange
		}: CollectionFormControllerProps = {},
		typeSettingsControls: TypeSettingsControls = {}
	) {
		this.collectionBuilder = new CollectionBuilder();

		// Set initial values
		this.collectionBuilder.setCollectionInfo(
			name ?? '',
			description,
			subdirectory
		);
		this.collectionBuilder.setAttributeTypeSettings(
			attributeTypeSettings ?? []
		);

		// Set callbacks
		this.onNameChangeCallback = onNameChange;
		this.onDescriptionChangeCallback = onDescriptionChange;
		this.onSubdirectoryChangeCallback = onSubdirectoryChange;
		this.onAttributeTypeSettingsChangeCallback =
			onAttributeTypeSettingsChange;
		this.typeSettingsControls = typeSettingsControls;
	}

	get collectionInfo() {
		return this.collectionBuilder.collectionInfo;
	}

	get collectionAttributeTypeSettings() {
		return this.collectionBuilder.collectionAttributeTypeSettings;
	}

	get formBuilder() {
		return this.collectionBuilder;
	}

	onNameChange = (value: string) => {
		this.collectionBuilder.setCollectionInfo(
			value,
			this.collectionInfo.description,
			this.collectionInfo.subdirectory
		);
		this.onNameChangeCallback?.(value);
	};

	onDescriptionChange = (value: string) => {
		this.collectionBuilder.setCollectionInfo(
			this.collectionInfo.name,
			value,
			this.collectionInfo.subdirectory
		);
		this.onDescriptionChangeCallback?.(value);
	};

	onSubdirectoryChange = (value: string) => {
		this.collectionBuilder.setCollectionInfo(
			this.collectionInfo.name,
			this.collectionInfo.description,
			value
		);
		this.onSubdirectoryChangeCallback?.(value);
	};

	onAttributeTypeSettingsChange = (settings: CollectionAttribute[]) => {
		this.collectionBuilder.setAttributeTypeSettings(settings);
		this.onAttributeTypeSettingsChangeCallback?.(settings);
	};
}
export const CreateCollectionStepper = (
	controller?: CollectionFormController
) => {
	// Stepper control
	const [previousStepDisabled, setPreviousStepDisabled] =
		React.useState(true);
	const [nextStepDisabled, setNextStepDisabled] = React.useState(true);
	const [activeStep, setActiveStep] = React.useState(0);

	const [collectionNameInput, setCollectionNameInput] = React.useState(
		controller?.collectionInfo.name ?? ''
	);
	const [collectionSubdirectoryInput, setCollectionSubdirectoryInput] =
		React.useState(controller?.collectionInfo.subdirectory ?? '');
	const [collectionDescriptionInput, setCollectionDescriptionInput] =
		React.useState(controller?.collectionInfo.description ?? '');
	const [
		collectionAttributeTypeSettings,
		setCollectionAttributeTypeSettings
	] = React.useState(controller?.collectionAttributeTypeSettings ?? []);

	const [ctrl] = React.useState<CollectionFormController>(
		controller ?? new CollectionFormController()
	);

	// state
	const [selectedAttributeType, setSelectedAttributeType] =
		React.useState<SupportedAttributeTypes | null>(null);

	// type setting controls
	const [advancedSettingValue, setAdvancedSettingValue] = React.useState(0);
	const [typeName, setTypeName] = React.useState('');
	const [typeMaxLength, setTypeMaxLength] = React.useState(0);
	const [typeMinLength, setTypeMinLength] = React.useState(0);
	const [subtype, setSubtype] = React.useState<string>('short_text');

	const steps = ['Configuration', 'Select type', 'Review'];

	React.useEffect(() => {
		if (ctrl.onNameChangeCallback === undefined) {
			ctrl.onNameChangeCallback = setCollectionNameInput;
		}
		if (ctrl.onDescriptionChangeCallback === undefined) {
			ctrl.onDescriptionChangeCallback = setCollectionDescriptionInput;
		}
		if (ctrl.onSubdirectoryChangeCallback === undefined) {
			ctrl.onSubdirectoryChangeCallback = setCollectionSubdirectoryInput;
		}
		if (ctrl.onAttributeTypeSettingsChangeCallback === undefined) {
			ctrl.onAttributeTypeSettingsChangeCallback =
				setCollectionAttributeTypeSettings;
		}

		if (ctrl.typeSettingsControls === undefined) {
			ctrl.typeSettingsControls = {
				textCtrl: new TextTypeSettingsFormControl({
					values: {
						name: typeName,
						maxLength: typeMaxLength,
						minLength: typeMinLength,
						subtype: subtype as TextContentTypes
					},
					onChanges: {
						onNameChange: setTypeName,
						onMaxLengthChange: setTypeMaxLength,
						onMinLengthChange: setTypeMinLength,
						onSubtypeChange: setSubtype
					},
					advancedSettingCtrl: {
						value: advancedSettingValue,
						onValueChange: setAdvancedSettingValue
					}
				})
			};
		} else {
			if (ctrl.typeSettingsControls.textCtrl === undefined) {
				ctrl.typeSettingsControls.textCtrl =
					new TextTypeSettingsFormControl({
						values: {
							name: typeName,
							maxLength: typeMaxLength,
							minLength: typeMinLength,
							subtype: subtype as TextContentTypes
						},
						onChanges: {
							onNameChange: setTypeName,
							onMaxLengthChange: setTypeMaxLength,
							onMinLengthChange: setTypeMinLength,
							onSubtypeChange: setSubtype
						},
						advancedSettingCtrl: {
							value: advancedSettingValue,
							onValueChange: setAdvancedSettingValue
						}
					});
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCollectionNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = event.target.value.trim();
		ctrl.onNameChange(value);

		if (value === '') {
			setNextStepDisabled(true);
		} else {
			setNextStepDisabled(false);
		}
	};
	const handleCollectionDescriptionChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		ctrl.onDescriptionChange(event.target.value.trim());
	};

	const handleCollectionSubdirectoryChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		ctrl.onSubdirectoryChange(event.target.value.trim());
	};

	const handleNext = () => {
		switch (activeStep) {
			case 0:
				// validation
				break;
			case 1:
				break;
			case 2:
				CollectionApiService.createCollection(ctrl.formBuilder.build());
				break;
		}
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	React.useEffect(() => {
		switch (activeStep) {
			// Base collection settings from step 1
			case 0:
				if (ctrl.collectionInfo.name.trim() === '') {
					setNextStepDisabled(true);
				} else {
					setNextStepDisabled(false);
				}

				setPreviousStepDisabled(false);
				break;
			case 1:
				if (ctrl.collectionAttributeTypeSettings.length === 0) {
					setNextStepDisabled(true);
				} else {
					setNextStepDisabled(false);
				}

				break;
			case 2:
				// Review step
				break;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeStep]);

	const handleBack = () => {
		setActiveStep((prevActiveStep) => {
			if (prevActiveStep === 1) {
				setPreviousStepDisabled(true);
				setNextStepDisabled(false);
			}
			return prevActiveStep - 1;
		});
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	const handleAddAnotherAttribute = (settings: AttributeSettingTypes) => {
		ctrl.formBuilder.addAttributeTypeSetting(settings);
		setSelectedAttributeType(null);
		setNextStepDisabled(false);
	};

	const handleAttributeTypeSelect = (type: SupportedAttributeTypes) => {
		setSelectedAttributeType(type);
	};

	const StepContent = (step: number) => {
		switch (step) {
			case 0:
				// collection base setup
				return (
					<CollectionBaseInfoForm
						values={{
							name: collectionNameInput,
							description: collectionDescriptionInput,
							subdirectory: collectionSubdirectoryInput
						}}
						onChanges={{
							onNameChange: handleCollectionNameChange,
							onDescriptionChange:
								handleCollectionDescriptionChange,
							onSubdirectoryChange:
								handleCollectionSubdirectoryChange
						}}
					/>
				);
			// attribute type selection
			case 1:
				return selectedAttributeType !== null ? (
					<AttributeTypesForm
						onSubmit={handleAddAnotherAttribute}
						type={selectedAttributeType}
						controller={ctrl.typeSettingsControls!.textCtrl!}
					/>
				) : (
					<AttributeTypesGrid onClick={handleAttributeTypeSelect} />
				);

			case 2:
				return (
					<StepReview
						info={ctrl.collectionInfo}
						attributes={ctrl.collectionAttributeTypeSettings}
					/>
				);
			default:
				return 'Unknown step';
		}
	};

	const StepControl = ({
		disablePrevious = false,
		disableNext = false,
		previousStepDisplayName = 'Back',
		nextStepDisplayName = 'Next',
		finalStepDisplayName = 'Finish'
	}: {
		disablePrevious?: boolean;
		disableNext?: boolean;
		previousStepDisplayName?: string;
		nextStepDisplayName?: string;
		finalStepDisplayName?: string;
	} = {}) => {
		return (
			<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
				<Button
					color="inherit"
					disabled={disablePrevious}
					onClick={handleBack}
					sx={{ mr: 1 }}
				>
					{previousStepDisplayName}
				</Button>
				<Box sx={{ flex: '1 1 auto' }} />

				<Button onClick={handleNext} disabled={disableNext}>
					{activeStep === steps.length - 1
						? finalStepDisplayName
						: nextStepDisplayName}
				</Button>
			</Box>
		);
	};

	const StepReview = ({
		info,
		attributes
	}: {
		info: CollectionInfo;
		attributes: CollectionAttribute[];
	}) => {
		return (
			<div>
				<Typography variant="h6">Review</Typography>
				<Typography variant="body1">Name: {info.name}</Typography>
				<Typography variant="body1">
					Description: {info.description}
				</Typography>
				<Typography variant="body1">Attributes:</Typography>
				{attributes.map((attr, index) => (
					<Button key={index} variant="outlined">
						{attr.setting.name}
					</Button>
				))}
			</div>
		);
	};

	const StepFinish = () => {
		return (
			<>
				<Typography variant="h6">
					Collection created successfully!
				</Typography>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						pt: 2
					}}
				>
					<Box sx={{ flex: '1 1 auto' }} />
					<Button onClick={handleReset}>Reset</Button>
				</Box>
			</>
		);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Stepper activeStep={activeStep}>
				{steps.map((label, _index) => {
					const stepProps: { completed?: boolean } = {};
					const labelProps: {
						optional?: React.ReactNode;
					} = {};

					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>
			{activeStep === steps.length ? (
				<StepFinish />
			) : (
				<>
					{StepContent(activeStep)}
					<StepControl
						disablePrevious={previousStepDisabled}
						disableNext={nextStepDisabled}
					/>
				</>
			)}
		</Box>
	);
};
