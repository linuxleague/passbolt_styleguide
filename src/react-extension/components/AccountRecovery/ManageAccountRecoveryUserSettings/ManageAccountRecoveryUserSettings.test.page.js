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
import {BrowserRouter as Router} from "react-router-dom";
import {render, fireEvent, waitFor} from "@testing-library/react";
import React from "react";
import MockTranslationProvider from "../../../test/mock/components/Internationalisation/MockTranslationProvider";
import ManageAccountRecoveryUserSettings from "./ManageAccountRecoveryUserSettings";
/**
 * The ManageAccountRecoveryUserSettingsPage component represented as a page
 */
export default class ManageAccountRecoveryUserSettingsPage {
  /**
   * Default constructor
   * @param context Context value
   * @param props Props to attach
   */
  constructor(props) {
    this._page = render(
      <MockTranslationProvider>
        <Router>
          <ManageAccountRecoveryUserSettings {...props}/>
        </Router>
      </MockTranslationProvider>
    );
  }

  /**
   * Runs the the current page's querySelector and return its result;
   * @param {string} selection
   * @returns {object}
   */
  selector(selection) {
    return this._page.container.querySelector(selection);
  }

  /**
   * Returns true if the page "exists" (the page is initialized and rendered at least once)
   * @returns {boolean}
   */
  exists() {
    return this.title !== null;
  }

  /**
   * Returns the dialog's title HTML element
   * @returns {HTMLElement}
   */
  get title() {
    return this.selector('.recovery-account-policy-dialog h2');
  }

  /**
   * Returns the dialog's "accept" checkbox HTML element
   * @returns {HTMLElement}
   */
  get acceptCheckbox() {
    return this.selector('#statusRecoverAccountAccept');
  }

  /**
   * Returns the dialog's "reject" checkbox HTML element
   * @returns {HTMLElement}
   */
  get rejectCheckbox() {
    return this.selector('#statusRecoverAccountReject');
  }

  /**
   * Returns the dialog's save button HTML element
   * @returns {HTMLElement}
   */
  get saveButton() {
    return this.selector('.submit-wrapper button[type="submit"]');
  }

  /**
   * Simulates a click on the dialog's ave button
   * @returns {Promise<void>}
   */
  async clickOnSave() {
    fireEvent.click(this.saveButton, {button: 0});
    await waitFor(() => {});
  }
}
