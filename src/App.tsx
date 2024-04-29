import { ApiConfig } from './api/config';
import {
	LoadingIndicatorProvider,
	SnackbarProvider
} from '@lst97/react-common-accessories';
import {
	ResponseSchemas,
	Config as ResponseStructureConfig
} from '@lst97/common-response-structure';
import {
	useJwtInterceptor,
	useResponseStructureValidationInterceptor
} from '@lst97/react-common-interceptors';
import { ApiServiceInstance } from '@lst97/common-restful';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import Routes from './pages/Routes';

const ProjectName = 'simple_cms';
function App() {
	// Configurations
	ApiConfig.instance.init({
		host: '127.0.0.1',
		port: 1168,
		projectName: ProjectName,
		protocol: 'http',
		apiVersion: 'v1'
	});
	ResponseStructureConfig.instance.idIdentifier = ProjectName;
	useResponseStructureValidationInterceptor(
		ApiServiceInstance().axiosInstance,
		ResponseSchemas.joiSchema()
	);
	useJwtInterceptor(ApiServiceInstance().axiosInstance);

	return (
		<>
			<SnackbarProvider>
				<LoadingIndicatorProvider>
					<BrowserRouter>
						<AuthProvider>
							<Routes />
						</AuthProvider>
					</BrowserRouter>
				</LoadingIndicatorProvider>
			</SnackbarProvider>
		</>
	);
}

export default App;
