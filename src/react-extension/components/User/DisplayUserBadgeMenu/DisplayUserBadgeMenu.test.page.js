
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
 * @since         3.10.0
 */


import {render} from "@testing-library/react";
import React from "react";
import AppContext from "../../../../shared/context/AppContext/AppContext";
import {BrowserRouter as Router} from "react-router-dom";
import MockTranslationProvider from "../../../test/mock/components/Internationalisation/MockTranslationProvider";
import DisplayUserBadgeMenu from "./DisplayUserBadgeMenu";

/**
 * The DisplayUserBadgeMenuPage component represented as a page
 */
export default class DisplayUserBadgeMenuPage {
  /**
   * Default constructor
   * @param appContext An app context
   * @param props Props to attach
   */
  constructor(appContext, props) {
    this._page = render(
      <MockTranslationProvider>
        <AppContext.Provider value={appContext}>
          <Router>
            <DisplayUserBadgeMenu {...props}/>
          </Router>
        </AppContext.Provider>
      </MockTranslationProvider>
    );
  }

  /**
   * Returns true if the badge for attention required is display
   */
  get attentionRequired() {
    return Boolean(this._page.container.querySelector('.attention-required'));
  }
}

