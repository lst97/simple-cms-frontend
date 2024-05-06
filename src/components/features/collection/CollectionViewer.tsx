import { Button, Stack, Typography } from '@mui/material';
import { CollectionAttributeDbModel } from '../../../models/share/collection/CollectionAttributes';
import { TextTypeSettingDbModel } from '../../../models/share/collection/AttributeTypeSettings';
const FieldsViewer = ({
	attributes
}: {
	attributes: CollectionAttributeDbModel[];
}) => {
	return (
		<div className="flex flex-col gap-2 m-8 rounded-md bg-white shadow-sm">
			<div className="flex flex-row justify-between">
				<Typography variant="h6">
					{attributes.length} Attributes
				</Typography>
				<div className="flex flex-row gap-2">
					<Button variant="contained" color="primary">
						+ Add another field
					</Button>
				</div>
			</div>
			<Stack direction="column" spacing={1}>
				{attributes.map((attribute) => (
					<div key={'attribute_' + attribute.setting._name}>
						<Stack direction="row" spacing={1}>
							<div>
								<Typography variant="h6">
									Attribute name: {attribute.setting._name}
								</Typography>
								<Typography variant="subtitle1">
									Type: {attribute.setting._type}, Sub-Type:{' '}
									{attribute.setting._type === 'text'
										? (
												attribute.setting as TextTypeSettingDbModel
										  )._textType
										: null}
								</Typography>
							</div>
							<div>
								<Button variant="contained" color="secondary">
									Edit
								</Button>
							</div>
						</Stack>
					</div>
				))}
			</Stack>
		</div>
	);
};

const CollectionViewer = ({
	title,
	description,
	attributes
}: {
	title: string;
	description: string;
	attributes?: CollectionAttributeDbModel[];
}) => {
	return (
		<div className="flex flex-col m-8">
			<div className="flex flex-row justify-between">
				<div className="flex flex-col">
					<Typography variant="h5">{title}</Typography>
					<Typography variant="subtitle1">{description}</Typography>
				</div>
				<div className="flex flex-row gap-2">
					<Button variant="contained" color="secondary">
						Cancel
					</Button>
					<Button variant="contained" color="primary">
						Save
					</Button>
				</div>
			</div>
			<FieldsViewer attributes={attributes || []} />
		</div>
	);
};

export default CollectionViewer;
