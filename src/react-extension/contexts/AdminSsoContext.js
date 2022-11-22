/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.6.0
 */

import React from "react";
import PropTypes from "prop-types";
import {withAppContext} from "./AppContext";
import SsoProviders from "../components/Administration/ManageSsoSettings/SsoProviders.data";
import {withDialog} from "./DialogContext";
import NotifyError from "../components/Common/Error/NotifyError/NotifyError";
import {withTranslation} from "react-i18next";
import TestSsoSettingsDialog from "../components/Administration/TestSsoSettingsDialog/TestSsoSettingsDialog";

// taken from Validator.isUUID()
const UUID_REGEXP = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

export const AdminSsoContext = React.createContext({
  ssoConfig: null, // The current sso configuration
  isProcessing: () => {}, // true when the form is being processed
  loadSsoConfiguration: () => {}, // Load the current sso configuration and store it in the state
  getSsoConfiguration: () => {}, // Return the current sso configuration from the context state
  isSsoConfigActivated: () => {}, // Returns true if the sso settings are set to active
  isDataReady: () => {}, // Returns true if the data has been loaded from the API already
  save: () => {}, // Save the sso configuration changes
  disableSso: () => {}, // Disable the SSO configuration
  getProviderList: () => {}, // Returns the list of providers that the API supports
  hasFormChanged: () => {}, // Returns true if the current form changed
  validateData: () => {}, // Validates the current data in the state
  saveAndTestConfiguration: () => {}, // Saves the current settings as a new draft and run the test dialog
  openTestDialog: () => {}, // Opens the test SSO settings dialog
  handleError: () => {}, // Handles error by displaying a NotifyError dialog
  getErrors: () => {}, // Returns the errors detected during validation
});

/**
 * The related context provider
 */
export class AdminSsoContextProvider extends React.Component {
  /**
   * Default constructor
   * @param props The component props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
    this.providerList = [];
  }

  /**
   * Returns the default component state
   */
  get defaultState() {
    this.handleTestConfigCloseDialog = this.handleTestConfigCloseDialog.bind(this); // Handles the closing of the SSO test configuration dialog
    this.handleSettingsActivation = this.handleSettingsActivation.bind(this); // Handles the UI processing after a successful settings activation
    return {
      ssoConfig: {
        provider: null,
        data: {
          url: "",
          redirect_url: "",
          client_id: "",
          tenant_id: "",
          client_secret: "",
          client_secret_expiry: "",
        }
      }, // The current sso configuration
      errors: {}, // The errors detected during the data validation
      isLoaded: false, // is the SSO settings data loading from the server finished
      hasSettingsChanged: false, // has the current form changed
      processing: false, // true when the form is being processed
      getErrors: this.getErrors.bind(this), // Returns the errors detected during validation
      hasFormChanged: this.hasFormChanged.bind(this), // Returns true if the current form changed
      isProcessing: this.isProcessing.bind(this), // returns true if a process is running and the UI must be disabled
      isDataReady: this.isDataReady.bind(this), // returns true if the data has been loaded from the API already
      loadSsoConfiguration: this.loadSsoConfiguration.bind(this), // Load the current sso configuration and store it in the state
      getSsoConfiguration: this.getSsoConfiguration.bind(this), // Return the current sso configuration from the context state
      isSsoConfigActivated: this.isSsoConfigActivated.bind(this), // Returns true if the sso settings are set to active
      save: this.save.bind(this), // Save the sso configuration changes
      changeProvider: this.changeProvider.bind(this), // change the provider
      disableSso: this.disableSso.bind(this), // Disable the SSO configuration
      setValue: this.setValue.bind(this), // Set an SSO settings value to the current config
      getProviderList: this.getProviderList.bind(this), // Returns the list of providers that the API supports
      validateData: this.validateData.bind(this), // Validates the current data in the state
      saveAndTestConfiguration: this.saveAndTestConfiguration.bind(this), // Saves the current settings as a new draft and run the test dialog
      handleError: this.handleError.bind(this), // Handles error by displaying a NotifyError dialog
    };
  }

  /**
   * Find the sso configuration
   * @return {Promise<void>}
   */
  async loadSsoConfiguration() {
    let ssoConfig = null;
    try {
      ssoConfig = await this.props.context.port.request("passbolt.sso.get-current");
      this.setProviderList(ssoConfig.providers);

      if (ssoConfig?.provider) {
        const providerData = SsoProviders.find(provider => provider.id === ssoConfig.provider);
        ssoConfig.data.redirect_url = providerData.defaultConfig.redirect_url;
      }
    } catch (error) {
      this.setProviderListFromBext(); //avoids to have an empty and non working UI
      this.props.dialogContext.open(NotifyError, {error});
    }

    this.setState({
      ssoConfig: {
        ...ssoConfig,
        data: Object.assign({}, this.state.ssoConfig.data, ssoConfig?.data)
      },
      isLoaded: true
    });
  }

  /**
   * Sets the list of provider compatible with the API and the browser extension.
   *
   * @param {Array<string>} providerIdList
   * @private
   */
  setProviderList(providerIdList) {
    if (!providerIdList) {
      throw new Error(this.props.t("No SSP provider available"));
    }
    /*
     * providers must be known on both side (API / Bext) in order to work.
     * Obviously, the API can't work with an unknown provider.
     * On Bext side, we can't provide a third-party SSO provider specific form if it's is unknown
     */
    providerIdList.forEach(providerId => {
      const provider = SsoProviders.find(provider => provider.id === providerId);
      if (provider && !provider.disabled) {
        this.providerList.push(provider);
      }
    });
  }

  /**
   * Sets the list of provider from the data known by the browser extension only.
   *
   * @private
   */
  setProviderListFromBext() {
    SsoProviders.forEach(provider => {
      if (!provider.disabled) {
        this.providerList.push(provider);
      }
    });
  }

  /**
   * Get the current sso config from the context's state.
   * @returns {Object}
   */
  getSsoConfiguration() {
    return this.state.ssoConfig;
  }

  /**
   * Get the current SSO configuration with data ready for the background page.
   * @return {Object}
   * @private
   */
  getSsoConfigurationDto() {
    const config = this.getSsoConfiguration();
    const data = config.data;
    return {
      provider: config.provider,
      data: {
        url: data.url,
        client_id: data.client_id,
        tenant_id: data.tenant_id,
        client_secret: data.client_secret,
        client_secret_expiry: data.client_secret_expiry,
      }
    };
  }

  /**
   * Get the current list of third party sso provider compatible with the API.
   * @returns {Object}
   */
  getProviderList() {
    return this.providerList;
  }

  /**
   * Returns true if the sso settings are set to active.
   * @returns {boolean}
   */
  isSsoConfigActivated() {
    return Boolean(this.state.ssoConfig?.provider);
  }

  /**
   * Returns true if the current form changed
   * @returns {boolean}
   */
  hasFormChanged() {
    return this.state.hasSettingsChanged;
  }

  /**
   * Set an SSO settings value to the current config
   * @param {string} key
   * @param {string} value
   */
  setValue(key, value) {
    const ssoConfig = this.getSsoConfiguration();
    ssoConfig.data[key] = value;
    this.setState({ssoConfig, hasSettingsChanged: true});
  }

  /**
   * Whenever the save has been requested
   * @param {Object} ssoConfig The current sso configuration
   */
  async save(ssoConfig) {
    //@todo @mock
    this.setState({ssoConfig});
    console.log("Saved sso config:", ssoConfig);
  }

  /**
   * Disable the Sso configuration.
   */
  disableSso() {
    this.setState({
      ssoConfig: {
        provider: null,
        data: {}
      }
    });
  }

  /**
   * Returns true if the data has finished to be loaded from the server.
   * @returns {boolean}
   */
  isDataReady() {
    return this.state.isLoaded;
  }

  /**
   * Returns true when the data is under processing
   * @returns {boolean}
   */
  isProcessing() {
    return this.state.processing;
  }

  /**
   * Change the currently selected provider.
   */
  changeProvider(provider) {
    if (provider.disabled) {
      return;
    }

    const selectedProvider = this.providerList.find(p => p.id === provider.id);

    this.setState({
      ssoConfig: {
        provider: selectedProvider.id,
        data: Object.assign({}, this.state.ssoConfig.data, selectedProvider?.defaultConfig)
      }
    });
  }

  /**
   * Returns the errors detected during validation
   * @returns {object}
   */
  getErrors() {
    return this.state.errors;
  }

  /**
   * Returns the first field with an error (first in the given list)
   * @param {object} errors a ref object to put the validation onto
   * @param {Array<string>} fieldPriority the ordered list of field to check
   * @returns {string|null}
   */
  getFirstFieldInError(errors, fieldPriority) {
    for (let i = 0; i < fieldPriority.length; i++) {
      const fieldName = fieldPriority[i];
      if (typeof(errors[fieldName]) !== "undefined") {
        return fieldName;
      }
    }
    return null;
  }

  /**
   * Validates the current data in the state
   * @returns {boolean} true if the data is valid, false otherwise
   */
  validateData() {
    const settings = this.state.getSsoConfiguration();
    const errors = {};

    const isProviderValid = this.validate_provider(settings.provider, errors);

    if (!isProviderValid) {
      this.fieldToFocus = "provider";
      this.setState({errors, hasSumittedForm: true});
      return false;
    }

    const validationCallback = `validateDataFromProvider_${settings.provider}`;
    const isFormValid = this[validationCallback](settings.data, errors);

    if (!isFormValid) {
      this.fieldToFocus = this.getFirstFieldInError(errors, ["url", "client_id", "tenant_id", "client_secret"]);
    }

    this.setState({errors, hasSumittedForm: true});

    return isFormValid;
  }

  /**
   * Validates the current data in the state.
   * @param {string} provider the provider id to validate
   * @param {object} errors a ref object to put the validation onto
   */
  validate_provider(provider, errors) {
    const isProviderValid = this.providerList.find(p => p.id === provider);

    if (!isProviderValid) {
      errors.provider = this.props.t("The Single Sign-On provider must be a supported provider.");
      return false;
    }

    return true;
  }

  /**
   * Validates the current data in the state assuming the SSO provider is Azure
   * @param {string} data the data to validate
   * @param {object} errors a ref object to put the validation onto
   * @returns {boolean}
   */
  validateDataFromProvider_azure(data, errors) {
    const {url, client_id, tenant_id, client_secret} = data;
    let isDataValid = true;
    if (!url || !(url?.length)) {
      errors.url = this.props.t("The Login URL is required");
      isDataValid = false;
    }

    // Validation of url
    if (!this.isValidUrl(url)) {
      errors.url = this.props.t("The Login URL must be a valid URL");
      isDataValid = false;
    }

    if (!client_id || !(client_id?.length)) {
      errors.client_id = this.props.t("The Application (client) ID is required");
      isDataValid = false;
    }

    // Validation of client_id
    if (!this.isValidUuid(client_id)) {
      errors.client_id = this.props.t("The Application (client) ID must be a valid UUID");
      isDataValid = false;
    }

    if (!tenant_id || !(tenant_id?.length)) {
      errors.tenant_id = this.props.t("The Directory (tenant) ID is required");
      isDataValid = false;
    }

    // Validation of tenant_id
    if (!this.isValidUuid(tenant_id)) {
      errors.tenant_id = this.props.t("The Directory (tenant) ID must be a valid UUID");
      isDataValid = false;
    }

    // Validation of client_secret
    if (!client_secret || !(client_secret?.length)) {
      errors.client_secret = this.props.t("The Secret is required");
      isDataValid = false;
    }

    return isDataValid;
  }

  /**
   * Returns true if the url is valid;
   * @param {string} stringUrl
   */
  isValidUrl(stringUrl) {
    try {
      const url = new URL(stringUrl);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  /**
   * Returns true if the UUID is valid;
   * @param {string} stringUuid
   */
  isValidUuid(stringUuid) {
    return UUID_REGEXP.test(stringUuid);
  }


  /**
   * Saves the current settings as a new draft and run the test dialog
   */
  async saveAndTestConfiguration() {
    this.setState({processing: true});
    try {
      const ssoSettings = this.getSsoConfigurationDto();
      const draftConfiguration = await this.props.context.port.request("passbolt.sso.save-draft", ssoSettings);
      await this.runTestConfig(draftConfiguration);
      this.setState({
        ssoConfig: draftConfiguration
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  /**
   * Opens the test SSO settings dialog
   *
   * @param {SsoConfigurationDto} draftConfiguration
   */
  async runTestConfig(draftConfiguration) {
    const selectedProvider = SsoProviders.find(provider => provider.id === draftConfiguration.provider);
    this.props.dialogContext.open(TestSsoSettingsDialog, {
      provider: selectedProvider,
      configurationId: draftConfiguration.id,
      handleClose: this.handleTestConfigCloseDialog,
      onSuccessfulSettingsActivation: this.handleSettingsActivation,
    });
  }

  /**
   * Handles the closing of the SSO test configuration dialog
   */
  handleTestConfigCloseDialog() {
    this.setState({processing: false});
  }

  /**
   * Handles the UI processing after a successful settings activation
   */
  handleSettingsActivation() {
    this.setState({hasSettingsChanged: false});
  }

  /**
   * Handle exception by displaying a pop-up containing the details of the error.
   * @param {Error} error
   */
  handleError(error) {
    console.error(error);
    this.props.dialogContext.open(NotifyError, {error});
  }

  /**
   * Render the component
   * @returns {JSX}
   */
  render() {
    return (
      <AdminSsoContext.Provider value={this.state}>
        {this.props.children}
      </AdminSsoContext.Provider>
    );
  }
}

AdminSsoContextProvider.propTypes = {
  context: PropTypes.any, // The application context
  children: PropTypes.any, // The children components
  accountRecoveryContext: PropTypes.object, // The account recovery context
  dialogContext: PropTypes.object, // The dialog context
  t: PropTypes.func, // The translation function
};
export default withAppContext(withDialog(withTranslation('common')(AdminSsoContextProvider)));

/**
 * Resource Workspace Context Consumer HOC
 * @param WrappedComponent
 */
export function withAdminSso(WrappedComponent) {
  return class WithAdminSso extends React.Component {
    render() {
      return (
        <AdminSsoContext.Consumer>
          {
            adminSsoContext => <WrappedComponent adminSsoContext={adminSsoContext} {...this.props} />
          }
        </AdminSsoContext.Consumer>
      );
    }
  };
}
