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

export default {
  title: 'Foundations/Link',
  component: "Link"
};


const Template = () =>
  <div style={{display: "flex", flexWrap: "wrap"}}>
    <div style={{width: "25%"}}>
      <a>admin@passbolt.com</a>
    </div>
    <div style={{width: "25%"}}>
      <a className="disabled">admin@passbolt.com</a>
    </div>
    <div style={{width: "25%"}}>
      <button type="button" className="link">admin@passbolt.com</button>
    </div>
    <div style={{width: "25%"}}>
      <button type="button" className="link" disabled>admin@passbolt.com</button>
    </div>
  </div>
  ;

export const Default = Template.bind({});
