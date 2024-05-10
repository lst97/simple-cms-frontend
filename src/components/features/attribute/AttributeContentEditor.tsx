import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CollectionAttributeDbModel } from '../../../models/share/collection/CollectionAttributes';
import { TextTypeSettingDbModel } from '../../../models/share/collection/AttributeTypeSettings';
import { Typography } from '@mui/material';
import { useContext } from 'react';
import { CollectionContext } from '../../../context/CollectionContext';

const PlainTextEditor = (props: {
	value: string;
	onChange: (value: string) => void;
}) => {
	const { value, onChange } = props;

	return (
		<ReactQuill
			value={value}
			onChange={onChange}
			formats={[]}
			modules={{ toolbar: false }}
		/>
	);
};

const ReachTextEditor = (props: {
	value: string;
	onChange: (value: string) => void;
}) => {
	const { value, onChange } = props;

	return <ReactQuill value={value} onChange={onChange} />;
};

// const CodeEditor = (props: {
// 	value: string;
// 	onChange: (value: string) => void;
// }) => {
// 	const { value, onChange } = props;

// 	return (
// 		<CodeMirror
// 			value={value}
// 			onChange={onChange}
// 			options={{
// 				mode: 'javascript',
// 				theme: 'material',
// 				lineNumbers: true
// 			}}
// 		/>
// 	);
// };

const AttributeContentEditor = ({
	selectedCollectionIndex,
	selectedAttributeIndex,
	attribute
}: {
	selectedCollectionIndex: number;
	selectedAttributeIndex: number;
	attribute: CollectionAttributeDbModel;
}) => {
	const { setCollections } = useContext(CollectionContext);

	const textTypeComponents = {
		long_text: PlainTextEditor,
		short_text: PlainTextEditor,
		reach_text: ReachTextEditor
	};

	switch (attribute.setting.type) {
		case 'text': {
			const EditorComponent =
				textTypeComponents[
					(attribute.setting as TextTypeSettingDbModel)
						.textType as keyof typeof textTypeComponents
				];

			return (
				<>
					<Typography variant="h6" sx={{ p: 1 }}>
						{attribute.setting.name}
					</Typography>
					<EditorComponent
						value={attribute.content.value ?? ''}
						onChange={(value) => {
							setCollections((prevCollections) => {
								const updatedCollections = [...prevCollections];
								updatedCollections[
									selectedCollectionIndex
								].attributes[
									selectedAttributeIndex
								].content.value = value;
								return updatedCollections;
							});
						}}
					/>
				</>
			);
		}
		case 'code':
			// Implement logic for code editor
			break;
		default:
			// Handle default case or potential errors
			break;
	}
};

export default AttributeContentEditor;
