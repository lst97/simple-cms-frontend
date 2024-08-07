import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { CollectionContext } from '../../context/CollectionContext';
import CollectionBuilderComponent from '../features/collection/CollectionBuilder';
import { AttributesController } from '../features/attribute/AttributesController';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen
	}),
	overflowX: 'hidden'
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`
	}
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar
}));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	})
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme)
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme)
	})
}));

type StringIndexMap = {
	[key: string]: number;
};

export default function MiniDrawer({
	children
}: {
	children?: React.ReactNode;
}) {
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);

	const [selectedItem, setSelectedItem] = React.useState<StringIndexMap>({
		collections: -1,
		actions: 0
	});

	const { collections } = React.useContext(CollectionContext);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar position="fixed" open={open}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={{
							marginRight: 5,
							...(open && { display: 'none' })
						}}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						Simple CMS
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer variant="permanent" open={open}>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'rtl' ? (
							<ChevronRightIcon />
						) : (
							<ChevronLeftIcon />
						)}
					</IconButton>
				</DrawerHeader>
				<Divider />
				{open === true ? (
					<Typography variant="h6" component="div" sx={{ p: 2 }}>
						Collections
					</Typography>
				) : null}
				<List>
					{collections.map((collection, index) => {
						return (
							!collection.ref && (
								<ListItem
									key={collection.slug}
									disablePadding
									sx={{ display: 'block' }}
								>
									<ListItemButton
										sx={{
											minHeight: 48,
											justifyContent: open
												? 'initial'
												: 'center',
											px: 2.5
										}}
										selected={
											selectedItem.collections === index
										}
										onClick={() => {
											setSelectedItem({
												...selectedItem,
												collections: index,
												actions: -1
											});
										}}
									>
										<ListItemIcon
											sx={{
												minWidth: 0,
												mr: open ? 3 : 'auto',
												justifyContent: 'center'
											}}
										>
											{index % 2 === 0 ? (
												<InboxIcon />
											) : (
												<MailIcon />
											)}
										</ListItemIcon>
										<ListItemText
											primary={collection.collectionName}
											sx={{ opacity: open ? 1 : 0 }}
										/>
									</ListItemButton>
								</ListItem>
							)
						);
					})}
				</List>
				<Divider />
				{open === true ? (
					<Typography variant="h6" component="div" sx={{ p: 2 }}>
						Actions
					</Typography>
				) : null}
				<List>
					{['Collection Builder'].map((text, index) => (
						<ListItem
							key={text}
							disablePadding
							sx={{ display: 'block' }}
						>
							<ListItemButton
								sx={{
									minHeight: 48,
									justifyContent: open ? 'initial' : 'center',
									px: 2.5
								}}
								selected={selectedItem.actions === index}
								onClick={() => {
									setSelectedItem({
										...selectedItem,
										collections: -1,
										actions: index
									});
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : 'auto',
										justifyContent: 'center'
									}}
								>
									{index % 2 === 0 ? (
										<InboxIcon />
									) : (
										<MailIcon />
									)}
								</ListItemIcon>
								<ListItemText
									primary={text}
									sx={{ opacity: open ? 1 : 0 }}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1 }}>
				<DrawerHeader />
				{selectedItem.actions === 0 ? (
					<CollectionBuilderComponent />
				) : null}
				{selectedItem.collections !== -1 ? (
					<AttributesController
						selectedCollection={
							collections[selectedItem.collections]
						}
					/>
				) : null}
				{children}
			</Box>
		</Box>
	);
}
