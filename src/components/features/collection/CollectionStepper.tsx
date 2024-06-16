import React, { useContext, useState } from 'react';
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
import { useFormik } from 'formik';
import DebugFormik from '../../debug/DebugFormik';
import { CollectionApiService } from '../../../services/ApiService';

interface StepControlProps {
	disablePrevious?: boolean;
	disableNext?: boolean;
	disableFinish?: boolean;
	previousStepDisplayName?: string;
	nextStepDisplayName?: string;
	finalStepDisplayName?: string;
	activeStep?: number;
}

class StepControlData {
	disablePrevious: boolean = true;
	disableNext: boolean = true;
	disableFinish: boolean = true;
	previousStepLabel: string = 'Back';
	nextStepLabel: string = 'Next';
	finalStepLabel: string = 'Finish';
	activeStep: number = 0;
}

const StepControl = (props: { initialValues?: StepControlProps }) => {
	const [stepControlData, setStepControlData] = useState(
		new StepControlData()
	);

	if (!props.initialValues) {
		setStepControlData(new StepControlData());
	} else {
		setStepControlData((prev) => {
			return {
				...prev,
				disablePrevious: props.initialValues?.disablePrevious ?? true,
				disableNext: props.initialValues?.disableNext ?? true,
				disableFinish: props.initialValues?.disableFinish ?? true,
				nextStepLabel:
					props.initialValues?.nextStepDisplayName ?? 'Next',
				previousStepLabel:
					props.initialValues?.previousStepDisplayName ?? 'Back',
				finalStepLabel:
					props.initialValues?.finalStepDisplayName ?? 'Finish',
				activeStep: props.initialValues?.activeStep ?? 0
			};
		});
	}

	const handleNext = async () => {
		switch (stepControlData.activeStep) {
			case 0:
				// validation
				break;
			case 1:
				formik.setFieldValue('info', {
					name: collectionBaseInfo!.collectionName,
					description: collectionBaseInfo!.collectionDescription,
					subdirectory: collectionBaseInfo!.collectionSubdirectory
				});
				break;
			case 2: {
				const newCollection =
					await CollectionApiService.createCollection(formik.values);
				setCollections([...collections, newCollection]);
				break;
			}
		}
		setStepControlData((prev) => {
			return {
				...prev,
				activeStep: prev.activeStep + 1
			};
		});
	};

	const handleBack = () => {
		setStepControlData((prev) => {
			if (prev.activeStep === 1) {
				setStepControlData((prev) => {
					return {
						...prev,
						disablePrevious: true,
						disableNext: false
					};
				});
			}
			return {
				...prev,
				activeStep: prev.activeStep - 1
			};
		});
	};

	const handleReset = () => {
		setStepControlData(new StepControlData());
		formik.resetForm();
		setCollectionBaseInfo(undefined);
	};

	const handleAttributeTypeSelect = (type: SupportedAttributeTypes) => {
		setSelectedAttributeType(type);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
			<Button
				color="inherit"
				disabled={stepControlData.disablePrevious}
				onClick={handleBack}
				sx={{ mr: 1 }}
			>
				{stepControlData.previousStepLabel}
			</Button>
			<Box sx={{ flex: '1 1 auto' }} />

			<Button onClick={handleNext} disabled={stepControlData.disableNext}>
				{stepControlData.activeStep === steps.length - 1
					? stepControlData.finalStepLabel
					: stepControlData.nextStepLabel}
			</Button>
		</Box>
	);
};

export const CreateCollectionStepper = () => {
	// Stepper control state

	const [selectedAttributeType, setSelectedAttributeType] =
		React.useState<SupportedAttributeTypes | null>(null);

	const formik = useFormik({
		initialValues: new CollectionForm(),
		onSubmit: (values: CollectionForm) => {
			console.log(values);
		}
	});

	// change when user press next, remember the state incase user goes back
	const [collectionBaseInfo, setCollectionBaseInfo] =
		React.useState<CollectionBaseInfoFormValues>();

	// update the collection context with the new collection, can use redux?
	const { collections, setCollections } = useContext(CollectionContext);

	const steps = ['Configuration', 'Select type', 'Review'];

	const StepContent = (step: number) => {
		switch (step) {
			case 0:
				// collection base setup
				return (
					<CollectionBaseInfoForm
						initialValues={collectionBaseInfo}
						onValuesChange={(values) => {
							setCollectionBaseInfo(values);
							if (values.collectionName !== '') {
								setStepControlData((prev) => {
									return {
										...prev,
										disableNext: false
									};
								});
							} else {
								setStepControlData((prev) => {
									return {
										...prev,
										disableNext: true
									};
								});
							}
						}}
					/>
				);
			// attribute type selection
			case 1:
				switch (selectedAttributeType) {
					case 'text':
					case 'media':
						return (
							<AttributeTypesForm
								onSubmit={(values: AttributeInfoFormValues) => {
									formik.setFieldValue('attributes', [
										...formik.values.attributes,
										new CollectionAttribute(values)
									]);
									setSelectedAttributeType(null);
								}}
								type={selectedAttributeType}
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
									onClick={handleAttributeTypeSelect}
								/>
								<DebugFormik formik={formik} />
							</>
						);
				}

			case 2:
				return <StepReview collection={formik.values} />;
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
					<Button onClick={handleReset}>Create New Collection</Button>
				</Box>
			</>
		);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Stepper activeStep={stepControlData.activeStep}>
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
			{stepControlData.activeStep === steps.length ? (
				<StepFinish />
			) : (
				<>
					{StepContent(stepControlData.activeStep)}
					<StepControl
						disablePrevious={stepControlData.disablePrevious}
						disableNext={stepControlData.disableNext}
					/>
				</>
			)}
		</Box>
	);
};
