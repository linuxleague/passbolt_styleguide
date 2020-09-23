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
 * @since         2.14.0
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import AppContext from "../../../contexts/AppContext";
import DialogWrapper from "../../../../react/components/Common/Dialog/DialogWrapper/DialogWrapper";
import {withActionFeedback} from "../../../contexts/ActionFeedbackContext";
import ErrorDialog from "../../../../react/components/Common/Dialog/ErrorDialog/ErrorDialog";
import {withDialog} from "../../../contexts/DialogContext";

/**
 * This component allows user to delete a tag of the resources
 */
class TagDeleteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
    this.initEventHandlers();
  }

  getDefaultState() {
    return {
      processing: false,
    };
  }

  initEventHandlers() {
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  /**
   * Handle form submit event.
   * @params {ReactEvent} The react event
   * @return {Promise}
   */
  async handleFormSubmit(event) {
    event.preventDefault();

    if (!this.state.processing) {
      await this.delete();
    }
  }

  /**
   * Handle close button click.
   */
  handleCloseClick() {
    this.context.setContext({tagToDelete: null});
    this.props.onClose();
  }

  /**
   * Save the changes.
   */
  async delete() {
    this.setState({processing: true});

    try {
      await this.context.port.request("passbolt.tags.delete", this.context.tagToDelete.id);
      await this.props.actionFeedbackContext.displaySuccess("The tag has been deleted successfully");
      this.props.onClose();
      this.context.setContext({tagToDelete: null});
    } catch (error) {
      // It can happen when the user has closed the passphrase entry dialog by instance.
      if (error.name === "UserAbortsOperationError") {
        this.setState({processing: false});
      } else {
        // Unexpected error occurred.
        console.error(error);
        this.handleError(error);
        this.setState({processing: false});
      }
    }
  }

  handleError(error) {
    const errorDialogProps = {
      title: "There was an unexpected error...",
      message: error.message
    }
    this.context.setContext({errorDialogProps});
    this.props.dialogContext.open(ErrorDialog);
  }

  render() {

    return (
      <div>
        <DialogWrapper
          title="Delete tag?"
          tooltip="Delete tag?"
          onClose={this.handleCloseClick}
          disabled={this.state.processing}
          className="delete-tag-dialog">
          <form onSubmit={this.handleFormSubmit} noValidate>
            <div className="form-content">
              <p>Are you sure you want to delete the tag <strong>{this.context.tagToDelete.slug}</strong>?</p>
              <p>Warning: Once the tag is deleted, it’ll be removed permanently and will not be recoverable.</p>
              <div className="submit-wrapper clearfix">
                <input type="submit" className="button primary warning" role="button" value="Delete tag"/>
                <a className="cancel" role="button" onClick={this.handleCloseClick}>Cancel</a>
              </div>
            </div>
          </form>
        </DialogWrapper>
      </div>
    );
  }
}

TagDeleteDialog.contextType = AppContext;

TagDeleteDialog.propTypes = {
  onClose: PropTypes.func,
  actionFeedbackContext: PropTypes.any, // The action feedback context
  dialogContext: PropTypes.any
};

export default withActionFeedback(withDialog(TagDeleteDialog));
