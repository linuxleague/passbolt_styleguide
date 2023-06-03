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

/**
 * Mock an API response
 * @param {Object} body The response body
 * @returns {Promise<string>} The response serialized in JSON.
 */
export const mockApiResponse = (body = {}) => Promise.resolve(JSON.stringify({header: {}, body: body}));

/**
 * Mock an error API response
 * @param {number} status The response status
 * @param {string} errorMessage The error message
 * @param {Object} body The response body
 * @returns {Promise<string>} The response serialized in JSON.
 */
export const mockApiResponseError = (status, errorMessage, body = {}) => Promise.resolve({
  status: status,
  body: JSON.stringify({
    header: {
      message: errorMessage,
      status: status
    },
    body: body
  })
});
