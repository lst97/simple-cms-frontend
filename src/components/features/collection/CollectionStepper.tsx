import React, { useContext } from 'react';
import { SupportedAttributeTypes } from '../../../models/share/collection/CollectionBaseSchema';
import {
	Box,
	Button,
	Typography,
	Stepper,
	Step,
	StepLabel
} from '@mui/material';
import {
	CollectionForm,
	CollectionInfo
} from '../../../models/forms/auth/CollectionForm';
import { CollectionAttribute } from '../../../models/share/collection/CollectionAttributes';
import AttributeTypesGrid from './AttributeTypesGrid';
import {
	AttributeInfoFormValues,
	AttributeTypesForm
} from './forms/AttributeTypesForm';
import { CollectionContext } from '../../../context/CollectionContext';
import CollectionBaseInfoForm, {
	CollectionBaseInfoFormValues
} from './forms/CollectionBaseInfoForm';
import { useFormik } from 'formik';
import DebugFormik from '../../debug/DebugFormik';
export const CreateCollectionStepper = () => {
	// Stepper control
	const [previousStepDisabled, setPreviousStepDisabled] =
		React.useState(true);
	const [nextStepDisabled, setNextStepDisabled] = React.useState(true);
	const [activeStep, setActiveStep] = React.useState(0);

	// state
	const [selectedAttributeType, setSelectedAttributeType] =
		React.useState<SupportedAttributeTypes | null>(null);

	const formik = useFormik({
		initialValues: new CollectionForm(),
		onSubmit: (values: CollectionForm) => {
			console.log(values);
		}
	});

	// change when CollectionBaseInfoForm is changing
	const [collectionBaseInfo, setCollectionBaseInfo] =
		React.useState<CollectionBaseInfoFormValues>();

	// change when AttributeTypesForm is submitted
	const [attributeInfo, setAttributeInfo] =
		React.useState<AttributeInfoFormValues>();

	// update the collection context with the new collection, can use redux?
	const { collections, setCollections } = useContext(CollectionContext);

	const steps = ['Configuration', 'Select type', 'Review'];

	const handleNext = async () => {
		switch (activeStep) {
			case 0:
				// validation
				break;
			case 1:
				break;
			case 2:
				// newCollection = await CollectionApiService.createCollection(
				// 	ctrl.formBuilder.build()
				// );
				// setCollections([...collections, newCollection]);
				break;
		}
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	React.useEffect(() => {
		switch (activeStep) {
			// Base collection settings from step 1
			case 0:
				// if (collectionNameInput.trim() === '') {
				// 	setNextStepDisabled(true);
				// } else {
				// 	setNextStepDisabled(false);
				// }

				setPreviousStepDisabled(false);
				break;
			case 1:
				// if (ctrl.collectionAttributes.length === 0) {
				// 	setNextStepDisabled(true);
				// } else {
				// 	setNextStepDisabled(false);
				// }

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

	const handleAttributeTypeSelect = (type: SupportedAttributeTypes) => {
		setSelectedAttributeType(type);
	};

	const StepContent = (step: number) => {
		switch (step) {
			case 0:
				// collection base setup
				return (
					<CollectionBaseInfoForm
						onValuesChange={(values) => {
							setCollectionBaseInfo(values);
							if (values.collectionName !== '') {
								setNextStepDisabled(false);
							} else {
								setNextStepDisabled(true);
							}
						}}
					/>
				);
			// attribute type selection
			case 1:
				switch (selectedAttributeType) {
					case 'text':
					case 'media':
					case 'post':
						return (
							<AttributeTypesForm
								onSubmit={(values: AttributeInfoFormValues) => {
									formik.setFieldValue('attributes', [
										...formik.values.attributes,
										values
									]);
									setSelectedAttributeType(null);
								}}
								type={selectedAttributeType}
								submitButtonLabel="Add another attribute"
							/>
						);
					case 'posts':
						return (
							<></>
							// <AttributeTypesForm
							// 	onSubmit={handleAddAnotherAttribute}
							// 	type={selectedAttributeType}
							// 	controller={collectionAttributeSettingFormCtrl}
							// />
						);
					default:
						return (
							<>
								<AttributeTypesGrid
									onClick={handleAttributeTypeSelect}
								/>
								<DebugFormik formik={formik} />
							</>
						);
				}

			case 2:
				return (
					<></>
					// <StepReview
					// 	info={ctrl.collectionInfo}
					// 	attributes={ctrl.collectionAttributes}
					// />
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
