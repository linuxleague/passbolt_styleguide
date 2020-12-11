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
 */
import React, {Component} from "react";
import ApiAppContext from "./contexts/ApiAppContext";
import ActionFeedbackContextProvider from "./contexts/ActionFeedbackContext";
import DialogContextProvider from "../react/contexts/Common/DialogContext";
import ContextualMenuContextProvider from "../react/contexts/Common/ContextualMenuContext";
import ShareActionFeedbacks from "./components/Share/ShareActionFeedbacks";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import AdministrationWorkspaceContextProvider from "./contexts/AdministrationWorkspaceContext";
import ManageDialogs from "../react/components/Common/Dialog/ManageDialogs/ManageDialogs";
import ManageContextualMenu from "./components/ManageContextualMenu";
import AdministrationWorkspace from "./components/Administration/AdministrationWorkspace";
import {ApiClientOptions} from "./lib/apiClient/apiClientOptions";
import {ApiClient} from "./lib/apiClient/apiClient";

/**
 * The passbolt application served by the API.
 * Briefly it takes care of:
 * - The passwords workspace
 * - The users workspace
 * - Most of the user settings workspace. The MFA screen is handled by the ApiApp because of duo constraints.
 */
class ApiApp extends Component {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState(props);
  }

  async componentDidMount() {
    this.getLoggedInUser();
  }

  getDefaultState() {
    return {
      loggedInUser: null, // The logged in user
      trustedDomain: window.location.origin,

      displayTestUserDirectoryDialogProps: {
        userDirectoryTestResult: null, // The result of the test user directory
      },

      setContext: context => {
        this.setState(context);
      },
      setLoggedInUser: () => {
      }, // Set the logged in user
    };
  }

  async getLoggedInUser() {
    const apiClientOptions = new ApiClientOptions().setBaseUrl(this.state.trustedDomain).setResourceName("users");
    const apiClient = new ApiClient(apiClientOptions);
    const result = await apiClient.get("me");
    this.setLoggedInUser(result.body);
  }

  setLoggedInUser(loggedInUser) {
    this.setState({loggedInUser});
  }

  render() {
    return (
      <ApiAppContext.Provider value={this.state}>
        <ActionFeedbackContextProvider>
          <DialogContextProvider>
            <ContextualMenuContextProvider>
              { /* Action Feedback Management */}
              <ShareActionFeedbacks/>
              <Router>
                <Switch>
                  <Route path="/app/administration">
                    <AdministrationWorkspaceContextProvider>
                      <ManageDialogs/>
                      <ManageContextualMenu/>
                      <AdministrationWorkspace/>
                    </AdministrationWorkspaceContextProvider>
                  </Route>
                </Switch>
              </Router>
            </ContextualMenuContextProvider>
          </DialogContextProvider>
        </ActionFeedbackContextProvider>
      </ApiAppContext.Provider>
    );
  }
}

export default ApiApp;
