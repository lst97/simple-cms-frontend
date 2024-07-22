import { styled, Drawer as MuiDrawer } from '@mui/material';

const ContainedDrawer = styled(MuiDrawer)({
	position: 'relative',
	marginLeft: 'auto',
	width: '100%',
	'& .MuiBackdrop-root': {
		display: 'none'
	},
	'& .MuiDrawer-paper': {
		width: '100%',
		position: 'absolute',
		height: (props: { height: number }) => props.height,
		transition: 'none !important'
	}
});

export { ContainedDrawer };
