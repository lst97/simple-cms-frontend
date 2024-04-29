import {
	ApiResultIndicator,
	ApiServiceInstance,
	ConsoleLogApiErrorHandler,
	IApiErrorHandler,
	formatRoutes
} from '@lst97/common-restful';
import { ApiConfig } from '../api/config';
import { CollectionForm } from '../models/forms/auth/CollectionForm';
import { RegistrationForm } from '../models/forms/auth/RegistrationForm';
import { LoginForm } from '../models/forms/auth/LoginForm';
import { CollectionAttributeDbModel } from '../models/share/collection/CollectionAttributes';
// import { ApiConfig } from "../api/config";

const defaultApiErrorHandler = new ConsoleLogApiErrorHandler();
export class CollectionApiService extends ApiResultIndicator {
	static async createCollection(
		form: CollectionForm,
		...errorHandlers: IApiErrorHandler[]
	) {
		try {
			const response = await ApiServiceInstance().post(
				ApiConfig.instance.routes.createCollection,
				form
			);

			return response.data;
		} catch (error) {
			defaultApiErrorHandler.handleError(error);
			for (const errorHandler of errorHandlers) {
				errorHandler.handleError(error);
			}
			return [];
		}
	}

	static async getCollections(...errorHandlers: IApiErrorHandler[]) {
		try {
			const response = await ApiServiceInstance().get(
				ApiConfig.instance.routes.fetchCollections
			);
			return response.data;
		} catch (error) {
			defaultApiErrorHandler.handleError(error);
			for (const errorHandler of errorHandlers) {
				errorHandler.handleError(error);
			}
			return [];
		}
	}

	static async updateCollectionAttributes(
		slug: string,
		attributes: CollectionAttributeDbModel[],
		...errorHandlers: IApiErrorHandler[]
	) {
		try {
			const response = await ApiServiceInstance().put(
				formatRoutes(
					ApiConfig.instance.routes.updateCollectionAttributes,
					{ slug: slug }
				),
				attributes
			);

			return response.data;
		} catch (error) {
			defaultApiErrorHandler.handleError(error);
			for (const errorHandler of errorHandlers) {
				errorHandler.handleError(error);
			}
			return [];
		}
	}
}

export class AuthApiService extends ApiResultIndicator {
	static async login(form: LoginForm, ...errorHandlers: IApiErrorHandler[]) {
		try {
			const response = await ApiServiceInstance().post(
				ApiConfig.instance.routes.login,
				form
			);

			return response.data;
		} catch (error) {
			defaultApiErrorHandler.handleError(error);
			for (const errorHandler of errorHandlers) {
				errorHandler.handleError(error);
			}
			return null;
		}
	}

	static async register(
		form: RegistrationForm,
		...errorHandlers: IApiErrorHandler[]
	) {
		try {
			const response = await ApiServiceInstance().post(
				ApiConfig.instance.routes.register.toString(),
				form
			);
			return response.data;
		} catch (error) {
			defaultApiErrorHandler.handleError(error);
			for (const errorHandler of errorHandlers) {
				errorHandler.handleError(error);
			}
			return null;
		}
	}
}
