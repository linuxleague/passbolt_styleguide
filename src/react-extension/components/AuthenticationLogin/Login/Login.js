/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2020 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2020 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.0.0
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import UserAvatar from "../../Common/Avatar/UserAvatar";
import {Trans, withTranslation} from "react-i18next";
import {withAppContext} from "../../../contexts/AppContext";
import Password from "../../../../shared/components/Password/Password";
import {withSso} from "../../../contexts/SsoContext";
import SsoProviders from "../../Administration/ManageSsoSettings/SsoProviders.data";

/**
 * The component display variations.
 * @type {Object}
 */
export const LoginVariations = {
  SIGN_IN: 'Sign in',
  ACCOUNT_RECOVERY: 'Account recovery'
};

/**
 * This component allows the user to log in with his account
 */
class Login extends Component {
  /**
   * Default constructor
   * @param props Component props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
    this.bindEventHandlers();
    this.createReferences();
  }

  /**
   * Returns the default state
   */
  get defaultState() {
    return {
      passphrase: '', // The passphrase
      rememberMe: false, // The remember me flag
      actions: {
        processing: false // True if one's processing passphrase
      },
      hasBeenValidated: false, // true if the form has already validated once
      errors: {
        emptyPassphrase: false, // True if the passphrase is empty
        invalidPassphrase: false, // True if the passphrase is invalid
        invalidGpgKey: false, // True if the gpg key is invalid
      },
      isSsoAvailable: false, // true if the current user has an SSO kit built locally
      displaySso: false, // true if the UI should display the SSO login button
      isLoaded: false, // true when the data is loaded
    };
  }

  /**
   * Returns true if the user can perform actions on the component
   * @returns {boolean}
   */
  get areActionsAllowed() {
    return !this.state.actions.processing;
  }

  /**
   * Returns true if the passphrase is valid
   * @returns {boolean}
   */
  get isValid() {
    return Object.values(this.state.errors).every(value => !value);
  }

  /**
   * Returns true if the component must be in a processing mode
   * @returns {boolean}
   */
  get isProcessing() {
    return this.state.actions.processing;
  }

  /**
   * Return true if there is a validation error
   * @returns {boolean}
   */
  get hasErrors() {
    return this.state.errors.emptyPassphrase || this.state.errors.invalidPassphrase || this.state.errors.invalidGpgKey;
  }

  /**
   * Returns the user full name
   */
  get fullname() {
    return this.props.userSettings?.fullName
      || `${this.props.account?.first_name} ${this.props.account?.last_name}`;
  }

  /**
   * Returns the username
   */
  get username() {
    return this.props.userSettings?.username || this.props.account?.username;
  }

  /**
   * Returns the trusted domain
   */
  get trustedDomain() {
    return this.props.userSettings?.getTrustedDomain()
      || this.props.account?.domain;
  }

  /**
   * Handle component event handlers
   */
  bindEventHandlers() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangePassphrase = this.handleChangePassphrase.bind(this);
    this.handleToggleRememberMe = this.handleToggleRememberMe.bind(this);
    this.handleSwitchToSso = this.handleSwitchToSso.bind(this);
    this.handleSwitchToPassphrase = this.handleSwitchToPassphrase.bind(this);
    this.handleSignInWithSso = this.handleSignInWithSso.bind(this);
  }

  /**
   * Creates the references
   */
  createReferences() {
    this.passphraseInputRef = React.createRef();
  }

  /**
   * Whenever the component is mounted
   */
  async componentDidMount() {
    await this.props.ssoContext.loadSsoConfiguration();
    const isSsoAvailable = this.props.ssoContext.hasUserAnSsoKit();
    this.setState({
      isLoaded: true,
      isSsoAvailable: isSsoAvailable,
      displaySso: isSsoAvailable,
    });
    if (!isSsoAvailable) {
      this.focusOnPassphrase();
    }
  }

  /**
   * Put the focus on the passphrase input
   */
  focusOnPassphrase() {
    this.passphraseInputRef.current.focus();
  }

  /**
   * Whenever the users submits his passphrase
   * @param {Event} event Dom event
   */
  async handleSubmit(event) {
    event.preventDefault();
    await this.validate();

    if (this.isValid) {
      await this.toggleProcessing();
      if (await this.checkPassphrase()) {
        await this.login();
      }
    }
  }

  /**
   * Whenever the user changes the private key
   * @param event An input event
   */
  async handleChangePassphrase(event) {
    const passphrase = event.target.value;
    await this.fillPassphrase(passphrase);
    if (this.state.hasBeenValidated) {
      await this.validate();
    }
  }

  /**
   * Whenever the user tosggles the remember me flag
   */
  async handleToggleRememberMe() {
    await this.toggleRememberMe();
  }

  /**
   * Check the private gpg key passphrase
   * @returns {Promise<boolean>}
   */
  async checkPassphrase() {
    try {
      await this.props.onCheckPassphrase(this.state.passphrase);
      return true;
    } catch (error) {
      await this.onCheckPassphraseFailure(error);
      return false;
    }
  }

  /**
   * Whenever the passphrase check failed
   * @param {Error} error The error
   * @throw {Error} If an unexpected errors hits the component. Errors not of type: InvalidMasterPasswordError, GpgKeyError.
   */
  onCheckPassphraseFailure(error) {
    // It can happen when the user has entered the wrong passphrase.
    if (error.name === "InvalidMasterPasswordError") {
      this.setState({actions: {processing: false}, errors: {invalidPassphrase: true}});
    } else if (error.name === 'GpgKeyError') {
      this.setState({actions: {processing: false}, errors: {invalidGpgKey: true}});
    } else {
      // Only controlled errors should hit the component.
      throw error;
    }
  }

  /**
   * Sign in the user
   * @returns {Promise<void>}
   */
  async login() {
    await this.props.onSignIn(this.state.passphrase, this.state.rememberMe);
  }

  /**
   * Fill the passphrase
   * @param passphrase A passphrase
   */
  async fillPassphrase(passphrase) {
    await this.setState({passphrase});
  }

  /**
   * Toggle the remember me flag value
   */
  async toggleRememberMe() {
    await this.setState({rememberMe: !this.state.rememberMe});
  }

  /**
   * Validate the security token data
   */
  async validate() {
    const {passphrase} = this.state;
    const emptyPassphrase =  passphrase.trim() === '';
    if (emptyPassphrase) {
      await this.setState({hasBeenValidated: true, errors: {emptyPassphrase}});
      return;
    }
    await this.setState({hasBeenValidated: true, errors: {}});
  }

  /**
   * Toggle the processing mode
   */
  toggleProcessing() {
    this.setState({actions: {processing: !this.state.actions.processing}});
  }

  /**
   * Switches the UI to the SSO mode.
   */
  handleSwitchToSso(event) {
    event.preventDefault();
    this.setState({displaySso: true});
  }

  /**
   * Switches the UI to the passphrase mode.
   */
  handleSwitchToPassphrase(event) {
    event.preventDefault();
    this.setState({displaySso: false});
  }

  /**
   * Handle the click on the SSO login button.
   * @returns {Promise<void>}
   */
  async handleSignInWithSso(event) {
    event.preventDefault();
    this.setState({actions: {
      processing: true
    }});
    try {
      await this.props.ssoContext.runSignInProcess();
    } catch (e) {
      if (e.name === "UserClosedSsoPopUp") {
        this.setState({
          displaySso: false
        });
      } else {
        this.props.onSsoLoginError(e);
      }
    }
    this.setState({
      actions: {
        processing: false
      }
    });
  }

  /**
   * Get the security token
   * @returns {{backgroundColor, code, textColor}}
   */
  get securityToken() {
    return this.props.userSettings?.getSecurityToken() || {
      code: this.props.account.security_token.code,
      backgroundColor: this.props.account.security_token.color,
      textColor: this.props.account.security_token.textcolor
    };
  }

  /**
   * Returns true if SSO is enabled and configured for Azure.
   * @return {bool}
   */
  get isAzureSsoEnabled() {
    const ssoProvider = this.props.ssoContext.getProvider();
    return ssoProvider === "azure";
  }

  /**
   * Returns the provider information of the current SSO provider configured.
   * @return {object}
   */
  get ssoProviderData() {
    const ssoProvider = this.props.ssoContext.getProvider();
    if (!ssoProvider) {
      return null;
    }
    return SsoProviders.find(provider => provider.id === ssoProvider);
  }

  /**
   * Render the component
   */
  render() {
    const processingClassName = this.isProcessing ? 'processing' : '';
    const securityToken = this.securityToken;
    const ssoProviderData = this.ssoProviderData;
    if (!this.state.isLoaded) {
      return null;
    }

    return (
      <div className="login">
        <div className="login-user">
          <UserAvatar user={this.props.account?.user} baseUrl={this.trustedDomain} className="big avatar user-avatar"/>
          <p className="login-user-name">{this.fullname}</p>
          <p className="login-user-email">{this.username}</p>
        </div>
        {!this.state.displaySso &&
          <form acceptCharset="utf-8" onSubmit={this.handleSubmit} className="enter-passphrase">
            <div className={`input-password-wrapper input required ${this.hasErrors ? "error" : ""}`}>
              <label htmlFor="passphrase">
                <Trans>Passphrase</Trans>
              </label>
              <Password
                id="passphrase"
                autoComplete="off"
                inputRef={this.passphraseInputRef}
                name="passphrase"
                placeholder={this.props.t('Passphrase')}
                value={this.state.passphrase}
                onChange={this.handleChangePassphrase}
                disabled={!this.areActionsAllowed}
                preview={true}
                securityToken={securityToken}/>
              {this.state.hasBeenValidated &&
              <>
                {this.state.errors.emptyPassphrase &&
                <div className="empty-passphrase error-message"><Trans>The passphrase should not be empty.</Trans></div>
                }
                {this.state.errors.invalidPassphrase &&
                <div className="invalid-passphrase error-message">
                  <Trans>The passphrase is invalid.</Trans> {this.state.isSsoAvailable && <a onClick={this.props.onSecondaryActionClick}><Trans>Do you need help?</Trans></a>}
                </div>
                }
                {this.state.errors.invalidGpgKey &&
                <div className="invalid-gpg-key error-message"><Trans>The private key is invalid.</Trans></div>
                }
              </>
              }
            </div>
            {this.props.canRememberMe &&
              <div className="input checkbox">
                <input
                  id="remember-me"
                  type="checkbox"
                  name="remember-me"
                  value={this.state.rememberMe}
                  onChange={this.handleToggleRememberMe}
                  disabled={!this.areActionsAllowed}/>
                <label htmlFor="remember-me">
                  <Trans>Remember until signed out.</Trans>
                </label>
              </div>
            }

            <div className="form-actions">
              <button
                type="submit"
                className={`button primary big full-width ${processingClassName}`}
                role="button"
                disabled={this.isProcessing}>
                {{
                  [LoginVariations.SIGN_IN]: <Trans>Sign in</Trans>,
                  [LoginVariations.ACCOUNT_RECOVERY]: <Trans>Complete recovery</Trans>,
                }[this.props.displayAs]}
              </button>
              {this.state.isSsoAvailable &&
                <a className="switchToSso" onClick={this.handleSwitchToSso}>
                  <Trans>Sign in with Single Sign-On.</Trans>
                </a>
              }
              {!this.state.isSsoAvailable &&
                <a onClick={this.props.onSecondaryActionClick}>
                  <Trans>Help, I lost my passphrase.</Trans>
                </a>
              }
            </div>
          </form>
        }
        {this.state.displaySso &&
          <>
            <div className="form-actions sso-login-form">
              {this.isAzureSsoEnabled &&
                <a className={`button sso-login-button ${this.isProcessing ? "disabled" : ""} ${ssoProviderData.id}`} onClick={this.handleSignInWithSso} disabled={this.isProcessing} >
                  <span className="provider-logo">
                    {ssoProviderData.icon}
                  </span>
                  {this.props.t(`Sign in with {{providerName}}`, {providerName: ssoProviderData.name})}
                </a>
              }
              <a onClick={this.handleSwitchToPassphrase}>
                <Trans>Sign in with my passphrase.</Trans>
              </a>
            </div>
          </>
        }
      </div>
    );
  }
}

Login.defaultProps = {
  displayAs: LoginVariations.SIGN_IN,
};

Login.propTypes = {
  displayAs: PropTypes.oneOf([
    LoginVariations.SIGN_IN,
    LoginVariations.ACCOUNT_RECOVERY,
  ]), // Defines how the form should be displayed and behaves
  context: PropTypes.any, // The application context
  ssoContext: PropTypes.object, // The SSO context
  account: PropTypes.object, // The user account
  userSettings: PropTypes.object, // The user settings
  canRememberMe: PropTypes.bool, // True if the remember me flag must be displayed
  onSignIn: PropTypes.func.isRequired, // Callback to trigger whenever the user wants to sign-in
  onCheckPassphrase: PropTypes.func.isRequired, // Callback to trigger whenever the user wants to check the passphrase
  onSecondaryActionClick: PropTypes.func, // Callback to trigger when the user clicks on the secondary action link.
  onSsoLoginError: PropTypes.func, // Callback when an error during SSO login happened
  t: PropTypes.func, // The translation function
};
export default withAppContext(withSso(withTranslation('common')(Login)));
