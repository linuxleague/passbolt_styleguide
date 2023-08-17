/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         4.2.0
 */

import React from "react";
import {fireEvent, render, waitFor} from "@testing-library/react";
import AppContext from "../../../../shared/context/AppContext/AppContext";
import MockTranslationProvider from "../../../test/mock/components/Internationalisation/MockTranslationProvider";
import {AdminPasswordPoliciesContextProvider} from "../../../contexts/Administration/AdministrationPasswordPoliciesContext/AdministrationPasswordPoliciesContext";
import DisplayAdministrationPasswordPoliciesActions from "../DisplayAdministrationWorkspaceActions/DisplayAdministrationPasswordPoliciesActions/DisplayAdministrationPasswordPoliciesActions";
import DisplayPasswordPoliciesAdministration from './DisplayPasswordPoliciesAdministration';

/**
 * The DisplayPasswordPoliciesAdministration component represented as a page
 */
export default class DisplayPasswordPoliciesAdministrationPage {
  /**
   * Default constructor
   * @param appContext An app context
   * @param props Props to attach
   */
  constructor(appContext, props) {
    this._page = render(
      <MockTranslationProvider>
        <AppContext.Provider value={appContext}>
          <AdminPasswordPoliciesContextProvider {...props}>
            <DisplayAdministrationPasswordPoliciesActions {...props}/>
            <DisplayPasswordPoliciesAdministration {...props}/>
          </AdminPasswordPoliciesContextProvider>
        </AppContext.Provider>
      </MockTranslationProvider>
    );
  }

  /**
   * Returns the password policy parent class
   * @returns {HTMLElement}
   */
  get passwordPolicies() {
    return this._page.container.querySelector('.password-policies-settings');
  }

  /**
   * Returns the save settings button
   * @returns {HTMLElement}
   */
  get saveSettingsButton() {
    return this._page.container.querySelector('#save-settings');
  }

  /**
   * Returns the reset settings button
   * @returns {HTMLElement}
   */
  get resetSettingsButton() {
    return this._page.container.querySelector('#reset-settings');
  }

  /**
   * Returns the Passphrase Policy Title
   * @returns {HTMLElement}
   */
  get passphrasePolicyTitle() {
    return this._page.container.querySelector('.password-policies-settings > h4.title');
  }

  /**
   * Returns the Passphrase Policy Input
   * @returns {HTMLElement}
   */
  get passphrasePolicyInput() {
    return this._page.container.querySelector('#password-policies-passphrase-policy-range input');
  }

  /**
   * Returns the Passphrase Policy description
   * @returns {HTMLElement}
   */
  get passphrasePolicyDescription() {
    return this._page.container.querySelector('#password-policies-passphrase-policy-description');
  }

  /**
   * Returns the help box element
   * @returns {HTMLElement}
   */
  get helpBox() {
    return this._page.container.querySelector('.sidebar-help');
  }

  /**
   * Returns the help box title
   * @returns {HTMLElement}
   */
  get helpBoxTitle() {
    return this._page.container.querySelector('.sidebar-help h3');
  }

  /**
   * Returns the help box description
   * @returns {HTMLElement}
   */
  get helpBoxDescription() {
    return this._page.container.querySelector('.sidebar-help p');
  }

  /**
   * Returns the help box button
   * @returns {HTMLElement}
   */
  get helpBoxButton() {
    return this._page.container.querySelector('.sidebar-help .button');
  }

  /**
   * Returns banner for settings changes
   * @returns {HTMLElement}
   */
  get settingsChangedBanner() {
    return this._page.container.querySelector("#password-policies-setting-banner");
  }

  /**
   * Returns the passphrase entropy warning banner
   * @returns {HTMLElement}
   */
  get minimalPassphraseEntropyAdvisedWarning() {
    return this._page.container.querySelector("#minimal-passphrase-entropy-advised-banner");
  }

  /**
   * Returns the password ase entropy warning banner
   * @returns {HTMLElement}
   */
  get minimalPasswordEntropyAdvisedWarning() {
    return this._page.container.querySelector("#minimal-password-entropy-advised-banner");
  }

  /**
   * Returns the title
   * @returns {HTMLElement}
   */
  get title() {
    return this._page.container.querySelector('#password-policies-settings-title');
  }
  /**
   * Returns the password configuration pannel
   * @returns {HTMLElement}
   */
  get passwordPanel() {
    return this._page.container.querySelector('.password-policies-settings .passwords-settings');
  }

  /**
   * Returns the button that toggles the password configuration pannel
   * @returns {HTMLElement}
   */
  get passwordPanelButton() {
    return this._page.container.querySelector('#accordion-toggle-password');
  }

  /**
   * Returns the password configuration pannel
   * @returns {HTMLElement}
   */
  get passphrasePanel() {
    return this._page.container.querySelector('.password-policies-settings .passphrase-settings');
  }

  /**
   * Returns the button that toggles the password configuration pannel
   * @returns {HTMLElement}
   */
  get passphrasePanelButton() {
    return this._page.container.querySelector('#accordion-toggle-passphrase');
  }

  /**
   * Returns the input number for the password length definition
   * @returns {HTMLElement}
   */
  get passwordLengthInput() {
    return this._page.container.querySelector('#configure-password-generator-form-length');
  }

  /**
   * Returns the input number for the passphrase length definition
   * @returns {HTMLElement}
   */
  get passphraseWordCountInput() {
    return this._page.container.querySelector('#configure-passphrase-generator-form-word-count');
  }

  /**
   * Returns the input for the words separator
   * @returns {HTMLElement}
   */
  get passphraseWordsSeparatorInput() {
    return this._page.container.querySelector('#configure-passphrase-generator-form-words-separator');
  }

  /**
   * Returns the computed entropy for current configuration of the default generator
   * @returns {string}
   */
  get passwordEntropyValue() {
    return this._page.container.querySelector('.passwords-settings .estimated-entropy .password-complexity .complexity-text').textContent;
  }

  /**
   * Returns the computed entropy for current configuration of the default generator
   * @returns {string}
   */
  get passphraseEntropyValue() {
    return this._page.container.querySelector('.passphrase-settings .estimated-entropy .password-complexity .complexity-text').textContent;
  }

  /**
   * Returns the Select component for the default generator
   * @returns {HTMLElement}
   */
  get defaultGeneratorSelect() {
    return this._page.container.querySelector('#configure-passphrase-default-generator');
  }

  /**
   * Returns the Passphrase Option element of the Select component for the default generator
   * @returns {HTMLElement}
   */
  get defaultGeneratorSelectOptionPassphrase() {
    return this._page.container.querySelectorAll('#configure-passphrase-default-generator .select-items li')[0];
  }

  /**
   * Returns the minimal Passbolt's entropy requirement error message from the passphrase panel settings
   * @returns {HTMLElement}
   */
  get minimalPassphraseEntropyError() {
    return this._page.container.querySelector('.passphrase-settings .estimated-entropy .error-message');
  }

  /**
   * Returns the minimal Passbolt's entropy requirement error message from the passphrase panel settings
   * @returns {HTMLElement}
   */
  get minimalPasswordEntropyError() {
    return this._page.container.querySelector('.passwords-settings .estimated-entropy .error-message');
  }

  /**
   * Returns the words separator error message
   * @returns {HTMLElement}
   */
  get wordsSeparatorErrorMessage() {
    return this._page.container.querySelector('#configure-passphrase-generator-form-words-separator + .error-message');
  }

  /**
   * Returns the 'is source changing' banner
   * @returns {HTMLElement}
   */
  get sourceChangingBanner() {
    return this._page.container.querySelector('#password-policies-setting-source-changing-banner');
  }

  /**
   * Returns true if the page is processing
   */
  get isProcessing() {
    return this.saveSettingsButton.disabled;
  }

  /**
   * Returns true if the page object exists in the container
   * @returns {boolean}
   */
  exists() {
    return this.passwordPolicies !== null;
  }

  /**
   * click on save settings button
   * @returns {Promise<void>}
   */
  async clickOnSave() {
    return this.click(this.saveSettingsButton);
  }

  /**
   * click on reset settings button
   * @returns {Promise<void>}
   */
  async clickOnReset() {
    return this.click(this.resetSettingsButton);
  }

  /**
   * Click on the element
   *
   */
  async click(element) {
    const leftClick = {button: 0};
    fireEvent.click(element, leftClick);
    await waitFor(() => {
    });
  }

  /**
   * Set the current form with the given data (only work with the inputs (not our Select component for instance))
   * @param {object} formData a key value pairs object that contains the field name as a key (must match a getter method on this page) and the desired value
   * @returns {Promise<void>}
   */
  async setFormWith(formData) {
    let key;
    for (key in formData) {
      fireEvent.input(this[key], {target: {value: formData[key]}});
    }
    await waitFor(() => {
      if (this[key].value !== formData[key].toString()) {
        throw new Error("Form is not udpated yet.");
      }
    });
  }

  /**
   * Toggle the password configuration panel on the UI.
   * @returns {Promise<void>}
   */
  async togglePasswordPanel() {
    const leftClick = {button: 0};
    const isOpened = Boolean(this.passwordPanel);
    fireEvent.click(this.passwordPanelButton, leftClick);
    await waitFor(() => {
      if (isOpened === Boolean(this.passwordPanel)) {
        throw new Error("Changes are not ready yet");
      }
    });
  }

  /**
   * Toggle the passphrase configuration panel on the UI.
   * @returns {Promise<void>}
   */
  async togglePassphrasePanel() {
    const leftClick = {button: 0};
    const isOpened = Boolean(this.passphrasePanel);
    fireEvent.click(this.passphrasePanelButton, leftClick);
    await waitFor(() => {
      if (isOpened === Boolean(this.passphrasePanel)) {
        throw new Error("Changes are not ready yet");
      }
    });
  }

  /**
   * Set the default generator to Passphrase.
   * @returns {Promise<void>}
   */
  async choosePassphraseAsDefaultGenerator() {
    await this.click(this.defaultGeneratorSelect);
    await this.click(this.defaultGeneratorSelectOptionPassphrase);
  }
}
