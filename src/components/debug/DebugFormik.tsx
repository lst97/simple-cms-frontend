import { FormikProps } from 'formik';

export interface DebugFormikProps {
	formik: FormikProps<any>;
}

const DebugFormik = (props: DebugFormikProps) => {
	return (
		<pre
			style={{
				background: '#f6f8fa',
				padding: '10px',
				borderRadius: '5px'
			}}
		>
			{JSON.stringify(props.formik, null, 2)}
		</pre>
	);
};

export default DebugFormik;
