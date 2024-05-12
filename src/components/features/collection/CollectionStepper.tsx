import React, { useContext, useEffect } from 'react';
import { SupportedAttributeTypes } from '../../../models/share/collection/CollectionBaseSchema';
import { AttributeSettingTypes } from '../../../models/share/collection/AttributeTypeSettings';
import CollectionBaseInfoForm, {
	CollectionBaseInfoFormControl
} from './forms/CollectionBaseInfoForm';
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
import { CollectionContext } from '../../../context/CollectionContext';
import { CollectionDbModel } from '../../../models/share/collection/Collection';

interface AdvancedSettingFormControlProps {
	value: number;
	onValueChange: React.Dispatch<React.SetStateAction<number>>;
}

class AdvancedTypeSettingsFormControl {
	public settingValue: number;
	public onSettingValueChange: React.Dispatch<React.SetStateAction<number>>;

	constructor(
		values: { value: number },
		onChanges: {
			onValueChange: React.Dispatch<React.SetStateAction<number>>;
		}
	) {
		this.settingValue = values.value;
		this.onSettingValueChange = onChanges.onValueChange;
	}
}

class TypeSettingsFormControlBase extends AdvancedTypeSettingsFormControl {
	public id?: string;
	public name: string;
	public onNameChange: React.Dispatch<React.SetStateAction<string>>;

	constructor(
		values: { name: string; advancedSettingValue: number },
		onChanges: {
			onNameChange: React.Dispatch<React.SetStateAction<string>>;
			onAdvancedSettingValueChange: React.Dispatch<
				React.SetStateAction<number>
			>;
		},
		id?: string
	) {
		super(
			{ value: values.advancedSettingValue },
			{ onValueChange: onChanges.onAdvancedSettingValueChange }
		);
		this.id = id;
		this.name = values.name;
		this.onNameChange = onChanges.onNameChange;
	}

	public onNameChangeCallback = (value: string) => {
		this.name = value;
		this.onNameChange(value);
	};

	public onSettingValueChangeCallback = (value: number) => {
		this.settingValue = value;
		this.onSettingValueChange(value);
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

export type AttributeTypeSettingsControl = TextTypeSettingsFormControl;
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
	}: TextTypeSettingControlProps = {}) {
		super(
			{
				name: values?.name ?? '',
				advancedSettingValue: advancedSettingCtrl?.value ?? 0
			},
			{
				onNameChange: onChanges?.onNameChange ?? (() => {}),
				onAdvancedSettingValueChange: () => {}
			}
		);
		this.maxLength = values?.maxLength ?? 0;
		this.minLength = values?.minLength ?? 0;
		this.subtype = values?.subtype ?? TextTypes.short_text;
		this.name = values?.name ?? '';

		this.onMaxLengthChangeCallback =
			onChanges?.onMaxLengthChange ?? (() => {});
		this.onMinLengthChangeCallback =
			onChanges?.onMinLengthChange ?? (() => {});
		this.onSubtypeChangeCallback = onChanges?.onSubtypeChange ?? (() => {});
		this.onNameChangeCallback = onChanges?.onNameChange ?? (() => {});
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

	public setValues = (values: TextTypeSettingFormControlValuesProps) => {
		this.name = values.name;
		this.maxLength = values.maxLength;
		this.minLength = values.minLength;
		this.subtype = values.subtype ?? TextTypes.short_text;

		this.onNameChangeCallback(values.name);
		this.onMaxLengthChangeCallback(values.maxLength);
		this.onMinLengthChangeCallback(values.minLength);
		this.onSubtypeChangeCallback(values.subtype ?? TextTypes.short_text);
	};

	public setAdvancedSettingCtrlValue = (value: number) => {
		this.settingValue = value;
		this.onSettingValueChangeCallback(value);
	};
}

interface TextTypeSettingControlProps {
	values?: TextTypeSettingFormControlValuesProps;
	onChanges?: TextTypeSettingFormControlOnChangesProps;
	advancedSettingCtrl?: AdvancedSettingFormControlProps;
}

interface CollectionFormControllersProps {
	collectionBaseInfoController: CollectionBaseInfoFormControl;
	attributeTypeSettingsController: AttributeTypeSettingsControl;
}

export class CollectionFormController {
	private collectionBaseInfoCtrl: CollectionBaseInfoFormControl;
	private collectionAttributeSettingFormCtrl: AttributeTypeSettingsControl;

	// Collection from which send to backend
	private collectionBuilder: CollectionBuilder;

	constructor(
		collectionBaseInfoController: CollectionBaseInfoFormControl,
		attributeTypeSettingsController: AttributeTypeSettingsControl
	) {
		// Collection from which send to backend
		this.collectionBuilder = new CollectionBuilder();

		// Set controllers
		this.collectionBaseInfoCtrl = collectionBaseInfoController;
		this.collectionAttributeSettingFormCtrl =
			attributeTypeSettingsController;
	}
	get collectionBaseInfoController() {
		return this.collectionBaseInfoCtrl;
	}

	get attributeTypeSettingsController() {
		return this.collectionAttributeSettingFormCtrl;
	}

	get collectionInfo() {
		return this.collectionBuilder.collectionInfo;
	}

	get collectionAttributesSettings() {
		return this.collectionBuilder.collectionAttributes.map(
			(attribute) => attribute.setting
		);
	}

	get collectionAttributes() {
		return this.collectionBuilder.collectionAttributes;
	}

	get formBuilder() {
		return this.collectionBuilder;
	}
}
export const CreateCollectionStepper = (
	props?: CollectionFormControllersProps
) => {
	// Stepper control
	const [previousStepDisabled, setPreviousStepDisabled] =
		React.useState(true);
	const [nextStepDisabled, setNextStepDisabled] = React.useState(true);
	const [activeStep, setActiveStep] = React.useState(0);

	// Collection base info hook
	const [collectionNameInput, setCollectionNameInput] = React.useState(
		props?.collectionBaseInfoController?.values.name ?? ''
	);
	const [collectionSubdirectoryInput, setCollectionSubdirectoryInput] =
		React.useState(
			props?.collectionBaseInfoController?.values.subdirectory ?? ''
		);
	const [collectionDescriptionInput, setCollectionDescriptionInput] =
		React.useState(
			props?.collectionBaseInfoController?.values.description ?? ''
		);

	// state
	const [selectedAttributeType, setSelectedAttributeType] =
		React.useState<SupportedAttributeTypes | null>(null);

	// type setting hook
	const [attributeName, setAttributeName] = React.useState('');
	const [advancedSettingValue, setAdvancedSettingValue] = React.useState(
		props?.attributeTypeSettingsController.settingValue ?? 0
	);
	const [typeMaxLength, setTypeMaxLength] = React.useState(0);
	const [typeMinLength, setTypeMinLength] = React.useState(0);
	const [subtype, setSubtype] = React.useState<string>('short_text');

	// update the collection context with the new collection
	const { collections, setCollections } = useContext(CollectionContext);

	// default controllers
	const [collectionBaseInfoCtrl] = React.useState(
		props?.collectionBaseInfoController ??
			new CollectionBaseInfoFormControl({
				values: {
					name: collectionNameInput,
					description: collectionDescriptionInput,
					subdirectory: collectionSubdirectoryInput
				},
				onChanges: {
					onNameChange: setCollectionNameInput,
					onDescriptionChange: setCollectionDescriptionInput,
					onSubdirectoryChange: setCollectionSubdirectoryInput
				}
			})
	);
	const [collectionAttributeSettingFormCtrl] = React.useState(
		props?.attributeTypeSettingsController ??
			new TextTypeSettingsFormControl({
				values: {
					name: attributeName,
					maxLength: typeMaxLength,
					minLength: typeMinLength,
					subtype: subtype as TextContentTypes
				},
				onChanges: {
					onNameChange: setAttributeName,
					onMaxLengthChange: setTypeMaxLength,
					onMinLengthChange: setTypeMinLength,
					onSubtypeChange: setSubtype
				},
				advancedSettingCtrl: {
					value: advancedSettingValue,
					onValueChange: setAdvancedSettingValue
				}
			})
	);

	const [ctrl] = React.useState(
		new CollectionFormController(
			collectionBaseInfoCtrl,
			collectionAttributeSettingFormCtrl
		)
	);

	useEffect(() => {
		ctrl.formBuilder.setCollectionInfo(
			collectionNameInput,
			collectionDescriptionInput,
			collectionSubdirectoryInput
		);
	}, [
		collectionDescriptionInput,
		collectionNameInput,
		collectionSubdirectoryInput,
		ctrl.formBuilder
	]);

	const steps = ['Configuration', 'Select type', 'Review'];

	const handleNext = async () => {
		let newCollection: CollectionDbModel;

		switch (activeStep) {
			case 0:
				// validation
				ctrl.formBuilder.setCollectionInfo(
					collectionNameInput,
					collectionDescriptionInput,
					collectionSubdirectoryInput
				);
				break;
			case 1:
				break;
			case 2:
				newCollection = await CollectionApiService.createCollection(
					ctrl.formBuilder.build()
				);
				setCollections([...collections, newCollection]);
				break;
		}
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	React.useEffect(() => {
		switch (activeStep) {
			// Base collection settings from step 1
			case 0:
				if (collectionNameInput.trim() === '') {
					setNextStepDisabled(true);
				} else {
					setNextStepDisabled(false);
				}

				setPreviousStepDisabled(false);
				break;
			case 1:
				if (ctrl.collectionAttributes.length === 0) {
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

	useEffect(() => {
		if (collectionNameInput.trim() === '') {
			setNextStepDisabled(true);
		} else {
			setNextStepDisabled(false);
		}
	}, [collectionNameInput]);

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
						controller={collectionBaseInfoCtrl}
					/>
				);
			// attribute type selection
			case 1:
				return selectedAttributeType !== null ? (
					<AttributeTypesForm
						onSubmit={handleAddAnotherAttribute}
						type={selectedAttributeType}
						controller={collectionAttributeSettingFormCtrl}
						submitButtonLabel="Add another attribute"
					/>
				) : (
					<AttributeTypesGrid onClick={handleAttributeTypeSelect} />
				);

			case 2:
				return (
					<StepReview
						info={ctrl.collectionInfo}
						attributes={ctrl.collectionAttributes}
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
