import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CollectionAttributeDbModel } from '../../../models/share/collection/CollectionAttributes';
import {
	MediaTypeSettingDbModel,
	TextTypeSettingDbModel
} from '../../../models/share/collection/AttributeTypeSettings';
import {
	ImageList,
	ImageListItem,
	ImageListItemBar,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { CollectionContext } from '../../../context/CollectionContext';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { FilePondFile, FilePondInitialFile } from 'filepond';
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

import { Config as ApiServiceConfig } from '@lst97/common-restful';

import { v4 as uuidv4 } from 'uuid';
import { IMediaContent } from '../../../models/share/collection/AttributeContents';
import { ImageViewer } from '../../common/medias/ImageViewer';
import {
	CollectionDbModel,
	ICollectionDbModel
} from '../../../models/share/collection/Collection';
import { PostsApiService } from '../../../services/ApiService';

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

export const GalleryEditor = (props: {
	slug: string;
	attribute: CollectionAttributeDbModel;
	value?: IMediaContent[];
	onChange?: (value: IMediaContent[]) => void;
}) => {
	const [selectedItem, setSelectedItem] = useState<IMediaContent | null>(
		null
	);

	const onClose = () => {
		setSelectedItem(null);
	};

	const baseUrl = ApiServiceConfig.instance().baseUrl;

	const fetchExistingImages = () => {
		const items =
			props.value ?? (props.attribute.content.value as IMediaContent[]);

		if (!props.value) {
			props.onChange?.(items);
		}

		return items.map((item) => (
			<ImageListItem key={item.url.split('/')[-1]}>
				<button
					onClick={() => {
						setSelectedItem(item);
					}}
				>
					<img
						crossOrigin="anonymous"
						srcSet={`${baseUrl}/${item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
						src={`${baseUrl}/${item.url}?w=248&fit=crop&auto=format`}
						alt={item.fileName}
						loading="lazy"
						style={{
							cursor: 'pointer',
							width: '100%',
							height: '100%',
							objectFit: 'cover'
						}}
					/>
				</button>

				<ImageListItemBar title={item.fileName} />
			</ImageListItem>
		));
	};
	return (
		<>
			<ImageList variant="masonry" cols={3} gap={8}>
				{fetchExistingImages()}
			</ImageList>
			<ImageViewer
				baseUrl={baseUrl}
				items={
					props.value ??
					(props.attribute.content.value as IMediaContent[])
				}
				selectedIndex={(
					props.value ??
					(props.attribute.content.value as IMediaContent[])
				).findIndex(
					(item) =>
						item.url.split('/')[-1] ===
						selectedItem?.url.split('/')[-1]
				)}
				onClose={onClose}
			/>
			<FilesUploader slug={props.slug} attribute={props.attribute} />
		</>
	);
};

// Database model for FilePond
// {
// 	sessionId, totalFiles, status: "succeed, failed, pending"
// }
type FilePondValue = (string | FilePondInitialFile | Blob)[];
const FilesUploader = (props: {
	slug: string;
	attribute: CollectionAttributeDbModel;
	value?: FilePondValue;
	onChange?: (value: FilePondValue) => void;
}) => {
	const [files, setFiles] = useState<FilePondValue>(props.value ?? []);
	const [uploadedFiles, setUploadedFiles] = useState<number>(0);
	const [sessionId, setSessionId] = useState<string>(uuidv4());

	const handleFileProcess = () => {
		setUploadedFiles((prev) => prev + 1);
	};

	useEffect(() => {
		const allFilesUploaded = () => {
			if (files.length > 0 && uploadedFiles === files.length) {
				setSessionId(uuidv4());
				setUploadedFiles(0);
				return true;
			}
			return false;
		};

		if (allFilesUploaded()) {
			console.log('All files uploaded');
		}
	}, [uploadedFiles, files]);

	const server = {
		process: (
			fieldName: string,
			file: Blob,
			metadata: unknown,
			load: (arg0: string) => void,
			error: (arg0: string) => void,
			progress: (arg0: boolean, arg1: number, arg2: number) => void,
			abort: () => void
		) => {
			const formData = new FormData();
			formData.append(fieldName, file);

			const mediaType = (
				props.attribute.setting as MediaTypeSettingDbModel
			).subType;

			// todo: migrate to axios
			const request = new XMLHttpRequest();

			request.open(
				'PUT',
				`${ApiServiceConfig.instance().baseUrl}/collections/${
					props.slug
				}/attributes/${
					props.attribute._id
				}?content=true&type=${mediaType}&sessionId=${sessionId}&total=${
					files.length
				}`
			);

			// Add the authorization header
			const token = localStorage.getItem('accessToken');
			if (token) {
				request.setRequestHeader('Authorization', `Bearer ${token}`);
			} else {
				error('Authorization failed');
			}

			request.upload.onprogress = (e) => {
				progress(e.lengthComputable, e.loaded, e.total);
			};
			request.onload = () => {
				if (request.status >= 200 && request.status < 300) {
					load(request.responseText);
					handleFileProcess();
				} else {
					error('Upload failed with error: ' + request.statusText);
				}
			};
			request.send(formData);

			return {
				abort: () => {
					request.abort();
					abort();
				}
			};
		}
	};

	return (
		<FilePond
			files={files}
			onupdatefiles={(files: FilePondFile[]) => {
				setFiles(files.map((file) => file.file));
				props.onChange?.(files.map((file) => file.file));
			}}
			allowDrop={true}
			allowBrowse={true}
			allowMultiple={true}
			allowRevert={false}
			maxFiles={3}
			server={server}
			instantUpload={false}
			name="value"
			labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
		/>
	);
};

const PostsEditorComponent = (props: {
	slug: string;
	posts: ICollectionDbModel[];
	value?: ICollectionDbModel[];
	onChange?: (value: ICollectionDbModel[]) => void;
}) => {
	const { value, onChange } = props;

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Title</TableCell>
						<TableCell align="right">Author</TableCell>
						<TableCell align="right">Categories</TableCell>
						<TableCell align="right">Tags</TableCell>
						<TableCell align="right">Comments</TableCell>
						<TableCell align="right">Date</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.posts.map((post) => (
						<TableRow
							key={`${
								(
									post
										.attributes[0] as CollectionAttributeDbModel
								).content.value
							}`}
							sx={{
								'&:last-child td, &:last-child th': {
									border: 0
								}
							}}
						>
							<TableCell component="th" scope="row">
								{`${
									(
										post
											.attributes[0] as CollectionAttributeDbModel
									).content.value
								}`}
							</TableCell>
							<TableCell align="right">
								{'Not implemented'}
							</TableCell>
							<TableCell align="right">
								{'Not implemented'}
							</TableCell>
							<TableCell align="right">
								{post.setting?.comment &&
									`${
										(
											post
												.attributes[0] as CollectionAttributeDbModel
										).content.value
									}`}
							</TableCell>
							<TableCell align="right">
								{post.createdAt.toISOString()}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

const AttributeEditorComponent = (props: {
	slug: string;
	attribute: CollectionAttributeDbModel;
	selectedIndies: { collectionIndex: number; attributeIndex: number };
	setCollections: React.Dispatch<React.SetStateAction<CollectionDbModel[]>>;
}) => {
	const textTypeComponents = {
		long_text: PlainTextEditor,
		short_text: PlainTextEditor,
		reach_text: ReachTextEditor
	};

	const mediaTypeComponents = {
		image: GalleryEditor,
		audio: FilesUploader,
		video: FilesUploader
	};

	switch (props.attribute.setting.type) {
		case 'text': {
			const EditorComponent =
				textTypeComponents[
					(props.attribute.setting as TextTypeSettingDbModel)
						.subType as keyof typeof textTypeComponents
				];

			return (
				<>
					<Typography variant="h6" sx={{ p: 1 }}>
						{props.attribute.setting.name}
					</Typography>
					<EditorComponent
						value={(props.attribute.content.value as string) ?? ''}
						onChange={(value) => {
							props.setCollections((prevCollections) => {
								const updatedCollections = [...prevCollections];

								(
									updatedCollections[
										props.selectedIndies.collectionIndex
									].attributes[
										props.selectedIndies.attributeIndex
									] as CollectionAttributeDbModel
								).content.value = value;
								return updatedCollections;
							});
						}}
					/>
				</>
			);
		}
		case 'media': {
			const EditorComponent =
				mediaTypeComponents[
					(props.attribute.setting as MediaTypeSettingDbModel)
						.subType as keyof typeof mediaTypeComponents
				];

			return (
				<>
					<Typography variant="h6" sx={{ p: 1 }}>
						{props.attribute.setting.name}
					</Typography>
					<EditorComponent
						slug={props.slug}
						attribute={props.attribute}
					/>
				</>
			);
		}

		default:
			// Handle default case or potential errors
			break;
	}
};

const AttributeContentEditor = ({
	slug,
	selectedCollectionIndex,
	selectedAttributeIndex,
	attribute
}: {
	slug: string;
	selectedCollectionIndex: number;
	selectedAttributeIndex: number;
	attribute: CollectionAttributeDbModel | CollectionDbModel;
}) => {
	const { setCollections } = useContext(CollectionContext);
	const [postsCollection, setPostsCollection] =
		useState<ICollectionDbModel>();

	const [addPostDialogOpen, setAddPostDialogOpen] = useState(false);

	const fetchPosts = async () => {
		return await PostsApiService.getPostsCollection(slug);
	};

	useEffect(() => {
		fetchPosts().then((posts) => setPostsCollection(posts));
	}, []);

	return (attribute as any).collectionName === undefined ? (
		<AttributeEditorComponent
			slug={slug}
			selectedIndies={{
				collectionIndex: selectedCollectionIndex,
				attributeIndex: selectedAttributeIndex
			}}
			attribute={attribute as CollectionAttributeDbModel}
			setCollections={setCollections}
		/>
	) : null;
};

export default AttributeContentEditor;
