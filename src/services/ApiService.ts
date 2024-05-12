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
import {
	CollectionAttribute,
	CollectionAttributeDbModel
} from '../models/share/collection/CollectionAttributes';
import { AttributeSettingTypes } from '../models/share/collection/AttributeTypeSettings';
import { BaseContent } from '../models/share/collection/AttributeContents';
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

	static async updateCollectionAttribute(
		slug: string,
		attributeId: string,
		{
			setting,
			content
		}: { setting?: AttributeSettingTypes; content?: BaseContent },
		...errorHandlers: IApiErrorHandler[]
	) {
		try {
			const response = await ApiServiceInstance().put(
				formatRoutes(
					ApiConfig.instance.routes.updateCollectionAttribute,
					{
						slug: slug,
						attributeId: attributeId,
						setting: setting ? 'true' : 'false',
						content: content ? 'true' : 'false'
					}
				),
				{
					setting,
					content
				}
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

	static async addCollectionAttribute(
		slug: string,
		attribute: CollectionAttribute,
		...errorHandlers: IApiErrorHandler[]
	) {
		try {
			const response = await ApiServiceInstance().post(
				formatRoutes(ApiConfig.instance.routes.addCollectionAttribute, {
					slug: slug
				}),
				attribute
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

	static async deleteCollectionAttribute(
		slug: string,
		attributeId: string,
		...errorHandlers: IApiErrorHandler[]
	) {
		try {
			const response = await ApiServiceInstance().delete(
				formatRoutes(
					ApiConfig.instance.routes.deleteCollectionAttribute,
					{
						slug: slug,
						attributeId: attributeId
					}
				)
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

	static async deleteCollection(
		slug: string,
		...errorHandlers: IApiErrorHandler[]
	) {
		try {
			const response = await ApiServiceInstance().delete(
				formatRoutes(ApiConfig.instance.routes.deleteCollection, {
					slug: slug
				})
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

	/**
	 * Updates the attributes of a collection. Include setting and content
	 *
	 * @param slug - The slug of the collection.
	 * @param attributes - An array of collection attribute models.
	 * @param errorHandlers - Optional error handlers to handle any errors that occur during the API call.
	 * @returns A Promise that resolves to the updated collection data.
	 */
	static async updateCollectionAttributes(
		slug: string,
		attributes: CollectionAttributeDbModel[],
		...errorHandlers: IApiErrorHandler[]
	) {
		try {
			const response = await ApiServiceInstance().put(
				formatRoutes(
					ApiConfig.instance.routes.updateCollectionAttribute,
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
