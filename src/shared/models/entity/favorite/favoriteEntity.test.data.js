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
import {v4 as uuidv4} from "uuid";

export const defaultFavoriteDto = (data = {}) => ({
  id: uuidv4(),
  user_id: uuidv4(),
  foreign_model: "Resource",
  foreign_key: uuidv4(),
  created: "2020-08-27T08:35:21+00:00",
  modified: "2020-08-27T08:35:21+00:00",
  ...data
});
