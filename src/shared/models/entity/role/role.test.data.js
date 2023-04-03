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
 * @since         4.O.0
 */

import {v4 as uuidv4} from 'uuid';

export const userRoleDto = data => ({
  "id": uuidv4(),
  "name": "user",
  ...data,
});

export const adminRoleDto = data => ({
  "id": uuidv4(),
  "name": "admin",
  ...data,
});
