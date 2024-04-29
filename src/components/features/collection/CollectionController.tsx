import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import AttributeTypesGrid from './AttributeTypesGrid';
import AttributeTypesForm from './forms/AttributeTypesForm';
import { SupportedAttributeTypes } from '../../../models/share/collection/CollectionBaseSchema';
import { CollectionBuilder } from './CollectionBuilder';
import { AttributeSettingTypes } from '../../../models/share/collection/AttributeTypeSettings';
import { CollectionApiService } from '../../../services/ApiService';

const steps = ['Configuration', 'Select type', 'Review'];

export interface CreateCollectionDialogProps {
	open: boolean;
	onFinish: (form: Map<string, unknown>) => void;
	onClose: () => void;
}

export function CreateCollectionDialog(props: CreateCollectionDialogProps) {
	// Build the collection form
	const [collectionBuilder] = React.useState<CollectionBuilder>(
		new CollectionBuilder()
	);
	const { onClose, open } = props;

	const handleCreateCollectionDialogClose = () => {
		onClose();
	};

	const StepReview = () => {
		return (
			<div>
				<Typography variant="h6">Review</Typography>
				<Typography variant="body1">
					Display name:{' '}
					{collectionBuilder.collectionForm.info?.displayName}
				</Typography>
				<Typography variant="body1">
					Description:{' '}
					{collectionBuilder.collectionForm.info?.description}
				</Typography>
				<Typography variant="body1">Attributes:</Typography>
				{collectionBuilder.collectionForm.attributes.map(
					(attr, index) => (
						<Button key={index} variant="outlined">
							{attr.setting.name}
						</Button>
					)
				)}
			</div>
		);
	};

	const CollectionSteppers = () => {
		const [collectionNameInput, setCollectionNameInput] = React.useState(
			collectionBuilder.collectionForm.info?.displayName ?? ''
		);
		const [collectionDescriptionInput, setCollectionDescriptionInput] =
			React.useState(
				collectionBuilder.collectionForm.info?.description ?? ''
			);

		// Stepper control
		const [previousStepDisabled, setPreviousStepDisabled] =
			React.useState(true);
		const [nextStepDisabled, setNextStepDisabled] = React.useState(true);
		const [activeStep, setActiveStep] = React.useState(0);
		const [selectedAttributeType, setSelectedAttributeType] =
			React.useState<SupportedAttributeTypes | null>(null);

		const handleCollectionNameChange = (
			event: React.ChangeEvent<HTMLInputElement>
		) => {
			const value = event.target.value;
			if (value.trim() === '') {
				setNextStepDisabled(true);
			} else {
				setNextStepDisabled(false);
				setCollectionNameInput(value);
			}
		};
		const handleCollectionDescriptionChange = (
			event: React.ChangeEvent<HTMLInputElement>
		) => {
			const value = event.target.value;

			if (value.trim() !== '') {
				setCollectionDescriptionInput(value);
			} else {
				setCollectionDescriptionInput('');
			}
		};

		const handleNext = () => {
			switch (activeStep) {
				case 0:
					collectionBuilder.setCollectionBase(
						collectionNameInput!,
						collectionDescriptionInput ?? undefined
					);
					break;
				case 1:
					break;
				case 2:
					CollectionApiService.createCollection(
						collectionBuilder.collectionForm
					);
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
					if (
						collectionBuilder.collectionForm.attributes.length === 0
					) {
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

		const onAddAnotherAttributeSubmit = (
			settings: AttributeSettingTypes
		) => {
			collectionBuilder.addAttributeTypeSetting(settings);
			setSelectedAttributeType(null);
			setNextStepDisabled(false);
		};

		const onAttributeTypeSelect = (type: SupportedAttributeTypes) => {
			setSelectedAttributeType(type);
		};

		const getStepContent = (step: number) => {
			switch (step) {
				case 0:
					return (
						<div className="flex flex-col justify-between gap-2">
							<TextField
								id="create-collection-stepper-1-display-name"
								label="Display name"
								required={true}
								variant="filled"
								onChange={handleCollectionNameChange}
								value={collectionNameInput}
							/>

							<TextField
								id="create-collection-stepper-1-description"
								label="Description"
								required={false}
								variant="filled"
								onChange={handleCollectionDescriptionChange}
								value={collectionDescriptionInput}
							/>
						</div>
					);
				case 1:
					return selectedAttributeType !== null ? (
						<AttributeTypesForm
							onSubmit={onAddAnotherAttributeSubmit}
							type={selectedAttributeType}
						/>
					) : (
						<AttributeTypesGrid onClick={onAttributeTypeSelect} />
					);

				case 2:
					return <StepReview />;
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
		}) => {
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
					<React.Fragment>
						<Typography sx={{ mt: 2, mb: 1 }}>
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
					</React.Fragment>
				) : (
					<React.Fragment>
						{getStepContent(activeStep)}
						<StepControl
							disablePrevious={previousStepDisabled}
							disableNext={nextStepDisabled}
						/>
					</React.Fragment>
				)}
			</Box>
		);
	};

	return (
		<Dialog onClose={handleCreateCollectionDialogClose} open={open}>
			<DialogTitle>Create collection</DialogTitle>
			<DialogContent>
				<CollectionSteppers />
			</DialogContent>
		</Dialog>
	);
}
