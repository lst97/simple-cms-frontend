import React, { useContext, useEffect, useState } from 'react';
import { SupportedAttributeTypes } from '../../../models/share/collection/CollectionBaseSchema';
import {
	Box,
	Button,
	Typography,
	Stepper,
	Step,
	StepLabel
} from '@mui/material';
import { CollectionForm } from '../../../models/forms/auth/CollectionForm';
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
import { FormikProps, useFormik } from 'formik';
import DebugFormik from '../../debug/DebugFormik';
import { CollectionApiService } from '../../../services/ApiService';
import { CollectionDbModel } from '../../../models/share/collection/Collection';

interface StepControlProps {
	disablePrevious?: boolean;
	disableNext?: boolean;
	previousStepLabel?: string;
	nextStepLabel?: string;
	finalStepLabel?: string;
	resultStepLabel?: string;
	activeStep?: number;
}

class StepControlData {
	disablePrevious: boolean = true;
	disableNext: boolean = true;
	previousStepLabel: string = 'Back';
	nextStepLabel: string = 'Next';
	finalStepLabel: string = 'Finish';
	resultStepLabel: string = 'Done';
	activeStep: number = 0;
}

const StepControl = (props: {
	steps: string[];
	onPreviousClick: (activeStep: number) => void;
	onNextClick: (activeStep: number) => void;
	disablePrevious?: boolean;
	disableNext?: boolean;
	onReset?: () => void;
	initialValues?: StepControlProps;
}) => {
	const [stepControlData, setStepControlData] = useState(
		new StepControlData()
	);

	useEffect(() => {
		if (!props.initialValues) {
			setStepControlData(new StepControlData());
		} else {
			setStepControlData((prev) => {
				return {
					...prev,
					disablePrevious:
						props.initialValues?.disablePrevious ?? true,
					disableNext: props.initialValues?.disableNext ?? true,
					nextStepLabel: props.initialValues?.nextStepLabel ?? 'Next',
					previousStepLabel:
						props.initialValues?.previousStepLabel ?? 'Back',
					finalStepLabel:
						props.initialValues?.finalStepLabel ?? 'Finish',
					resultStepLabel:
						props.initialValues?.resultStepLabel ?? 'Done',
					activeStep: props.initialValues?.activeStep ?? 0
				};
			});
		}
	}, []);

	const handleNext = async () => {
		props.onNextClick(stepControlData.activeStep);
		setStepControlData((prev) => {
			return {
				...prev,
				activeStep: prev.activeStep + 1
			};
		});
	};

	const handleBack = async () => {
		props.onPreviousClick(stepControlData.activeStep);
		setStepControlData((prev) => {
			return {
				...prev,
				activeStep: prev.activeStep - 1
			};
		});
	};

	const handleReset = () => {
		setStepControlData(new StepControlData());

		if (props.onReset) {
			props.onReset();
		}
	};

	useEffect(() => {
		setStepControlData((prev) => {
			return {
				...prev,
				disablePrevious: props.disablePrevious ?? true,
				disableNext: props.disableNext ?? true
			};
		});
	}, [props.disablePrevious, props.disableNext]);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
			{stepControlData.activeStep < props.steps.length ? (
				<>
					<Button
						color="inherit"
						disabled={stepControlData.disablePrevious}
						onClick={handleBack}
						sx={{ mr: 1 }}
					>
						{stepControlData.previousStepLabel}
					</Button>
					<Box sx={{ flex: '1 1 auto' }} />
					<Button
						onClick={handleNext}
						disabled={stepControlData.disableNext}
					>
						{stepControlData.activeStep === props.steps.length - 1
							? stepControlData.finalStepLabel
							: stepControlData.nextStepLabel}
					</Button>
				</>
			) : (
				<Button onClick={handleReset}>
					{stepControlData.resultStepLabel}
				</Button>
			)}
		</Box>
	);
};

interface StepContentValues {
	step: number;
	formik: FormikProps<CollectionForm>;
	collectionBaseInfo: CollectionBaseInfoFormValues;
	selectedAttributeType: SupportedAttributeTypes | null;
}

interface StepContentOnChange {
	setCollectionBaseInfo: React.Dispatch<
		React.SetStateAction<CollectionBaseInfoFormValues>
	>;
	setSelectedAttributeType: React.Dispatch<SupportedAttributeTypes | null>;
	setDisablePrevious: React.Dispatch<React.SetStateAction<boolean>>;
	setDisableNext: React.Dispatch<React.SetStateAction<boolean>>;
}

const StepContent = (props: {
	values: StepContentValues;
	onChanges: StepContentOnChange;
}) => {
	switch (props.values.step) {
		case 0:
			// collection base setup
			return (
				<CollectionBaseInfoForm
					initialValues={props.values.collectionBaseInfo}
					onValuesChange={(values) => {
						props.onChanges.setCollectionBaseInfo(values);
						if (values.collectionName !== '') {
							props.onChanges.setDisableNext(false);
						} else {
							props.onChanges.setDisableNext(true);
						}
					}}
				/>
			);
		// attribute type selection
		case 1:
			switch (props.values.selectedAttributeType) {
				case 'text':
				case 'media':
					return (
						<AttributeTypesForm
							onSubmit={(values: AttributeInfoFormValues) => {
								props.values.formik.setFieldValue(
									'attributes',
									[
										...props.values.formik.values
											.attributes,
										new CollectionAttribute(values)
									]
								);
								props.onChanges.setDisableNext(false);
								props.onChanges.setSelectedAttributeType(null);
							}}
							type={props.values.selectedAttributeType}
							submitLabel="Add another attribute"
						/>
					);
				case 'post':
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
								onClick={(type: SupportedAttributeTypes) => {
									props.onChanges.setSelectedAttributeType(
										type
									);
								}}
							/>
							<DebugFormik formik={props.values.formik} />
						</>
					);
			}

		case 2:
			return <StepReview collection={props.values.formik.values} />;
		case 3:
			return <StepResult />;
		default:
			return 'Unknown step';
	}
};

const StepReview = (props: { collection: CollectionForm }) => {
	return (
		<div>
			<Typography variant="h6">Review</Typography>
			<Typography variant="body1">
				Collection name: {props.collection.info.name}
			</Typography>
			<Typography variant="body1">
				Description: {props.collection.info.description}
			</Typography>
			<Typography variant="body1">Attributes:</Typography>
			{props.collection.attributes.map((attr) => (
				<Button key={attr.setting.name} variant="outlined">
					{attr.setting.name}
				</Button>
			))}
		</div>
	);
};

const StepResult = () => {
	return (
		<Typography variant="h6">Collection created successfully!</Typography>
	);
};
export const CreateCollectionStepper = () => {
	const formik = useFormik({
		initialValues: new CollectionForm(),
		onSubmit: (values: CollectionForm) => {
			console.log(values);
		}
	});

	const [selectedAttributeType, setSelectedAttributeType] =
		React.useState<SupportedAttributeTypes | null>(null);

	// step control buttons state
	const [disableNext, setDisableNext] = React.useState(true);
	const [disablePrevious, setDisablePrevious] = React.useState(true);
	const [activeStep, setActiveStep] = React.useState(0);

	// change when user press next, remember the state incase user goes back
	const [collectionBaseInfo, setCollectionBaseInfo] =
		React.useState<CollectionBaseInfoFormValues>(
			new CollectionBaseInfoFormValues()
		);

	// update the collection context with the new collection, can use redux?
	const { collections, setCollections } = useContext(CollectionContext);

	const steps = ['Configuration', 'Select type', 'Review'];

	const handlePreviousClick = (activeStep: number) => {
		// the activate step is going to -1 some time soon (async)
		switch (activeStep) {
			case 1:
				setDisablePrevious(true);
				setSelectedAttributeType(null);
				break;
			default:
				setDisablePrevious(false);
				break;
		}

		setActiveStep(activeStep - 1);
	};

	const handleNextClick = async (activeStep: number) => {
		switch (activeStep) {
			case 0:
				formik.setFieldValue('info', {
					name: collectionBaseInfo.collectionName,
					description: collectionBaseInfo.collectionDescription,
					subdirectory: collectionBaseInfo.collectionSubdirectory
				});
				if (formik.values.attributes.length === 0) {
					setDisableNext(true);
				} else {
					setDisableNext(false);
				}
				setDisablePrevious(false);
				break;
			case 1:
				break;
			case 2: {
				// api call to create collection
				const newCollection =
					await CollectionApiService.createCollection(formik.values);
				setCollections([
					...collections,
					newCollection as CollectionDbModel
				]);

				console.log(newCollection);

				break;
			}
			default:
				setDisablePrevious(false);
				break;
		}

		setActiveStep(activeStep + 1);
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
			{/* Conditional rendering */}
			<StepContent
				values={{
					step: activeStep,
					formik,
					collectionBaseInfo,
					selectedAttributeType
				}}
				onChanges={{
					setCollectionBaseInfo,
					setSelectedAttributeType,
					setDisablePrevious,
					setDisableNext
				}}
			/>
			<StepControl
				steps={steps}
				onNextClick={handleNextClick}
				onPreviousClick={handlePreviousClick}
				disableNext={disableNext}
				disablePrevious={disablePrevious}
			/>
		</Box>
	);
};
