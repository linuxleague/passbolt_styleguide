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
 * @since         2.13.0
 */

import React from "react";
import PropTypes from "prop-types";
import {withResourceWorkspace} from "../../../contexts/ResourceWorkspaceContext";
import {withDialog} from "../../../contexts/Common/DialogContext";
import AppContext from "../../../contexts/AppContext";
import DialogWrapper from "../../../../react/components/Common/Dialog/DialogWrapper/DialogWrapper";
import FormSubmitButton from "../../../../react/components/Common/Inputs/FormSubmitButton/FormSubmitButton";
import FormCancelButton from "../../../../react/components/Common/Inputs/FormSubmitButton/FormCancelButton";
import {withActionFeedback} from "../../../contexts/ActionFeedbackContext";
import ErrorDialog from "../../Dialog/ErrorDialog/ErrorDialog";

/**
 * This component allows to export resources to a specified format
 */
class ExportResources extends React.Component {
  /**
   * Default constructor
   * @param props Component props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
    this.bindHandlers();
  }

  /**
   * Returns the component default state
   */
  get defaultState() {
    return {
      selectedExportFormat: this.exportFormats[0], // The selected export format
      actions: {
        processing: false // Actions flag about processing
      }
    };
  }

  /**
   * Bind the component handlers
   */
  bindHandlers() {
    this.handleExport = this.handleExport.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleExportFormatSelected = this.handleExportFormatSelected.bind(this);
  }

  /**
   * Return trus if the export is processing
   */
  get isProcessing() {
    return this.state.actions.processing;
  }

  /**
   * Returns true if actions can be performed
   */
  get areActionsAllowed() {
    return !this.isProcessing;
  }

  /**
   * Returns true if some folders must be exported
   */
  get hasFoldersToExport() {
    return this.props.resourceWorkspaceContext.resourcesToExport.foldersIds;
  }

  /**
   * Returns the resources identifiers to export
   */
  get resourcesToExport() {
    return this.props.resourceWorkspaceContext.resourcesToExport.resourcesIds;
  }

  /**
   * Returns the list of available export formats
   */
  get exportFormats() {
    return [
      {label: 'kdbx (keepass / keepassx)', value: 'kdbx'},
      {label: 'csv (keepass / keepassx)', value: 'csv-kdbx'},
      {label: 'csv (lastpass)', value: 'csv-lastpass'},
      {label: 'csv (1password)', value: 'csv-1pass'},
    ];
  }

  /**
   * Whenever the user selects an export format
   * @param event Select DOM event
   */
  handleExportFormatSelected(event) {
    this.selectFormat(event.target.value);
  }

  /**
   * Whenever the export is submitted
   * @param event A dom event
   */
  handleExport(event) {
    event.preventDefault();

    const isCsv = this.state.selectedExportFormat.startsWith('csv');
    if (isCsv) { // CSV case
      this.export()
        .then(this.onExportSuccess.bind(this))
        .catch(this.onExportFailure.bind(this));
    } else { // KDBX case
      // TODO
    }
  }

  /**
   * Whenever the export is cancelled
   */
  handleCancel() {
    this.close();
  }

  /**
   * Select the export format
   * @param selectedExportFormat The selected export format
   */
  selectFormat(selectedExportFormat) {
    this.setState({selectedExportFormat});
  }


  /**
   * Export the selected resources or folders
   */
  async export() {
    const options = {format: this.state.selectedExportFormat};
    const resourcesIds = this.resourcesToExport;
    await this.context.port.request('passbolt.export-passwords.export-to-file', {resourcesIds, options});
  }

  /**
   * Whenever the export has been performed succesfully
   */
  async onExportSuccess() {
    this.close();
  }

  /**
   * Whenever the export has been performed with failure
   */
  onExportFailure(error) {
    const errorDialogProps = {
      title: "There was an unexpected error...",
      message: error.message
    };
    this.context.setContext({errorDialogProps});
    this.props.dialogContext.open(ErrorDialog);
  }

  /**
   * Close the dialog
   */
  close() {
    this.props.onClose();
  }

  /**
   * Render the component
   */
  render() {
    return (
      <DialogWrapper
        title="Export passwords"
        onClose={this.handleClose}
        disabled={this.areActionsAllowed}>
        <form
          onSubmit={this.handleExport}
          noValidate>

          <div className="form-content">

            <div className={`input text required`}>
              <label htmlFor="export-format">Choose the export format ( csv and kdbx are supported)</label>
              <select
                id="export-format"
                value={this.state.selectedExportFormat}
                onChange={this.handleExportFormatSelected}>
                {
                  this.exportFormats.map(format =>
                    <option
                      key={format.value}
                      value={format.value}>
                      {format.label}
                    </option>
                  )
                }
              </select>
            </div>

            <br/>
            <p>
              {this.hasFoldersToExport && <em>{this.resourcesToExport.length} passwords and 1 folders are going to be exported.</em>}
              {!this.hasFoldersToExport &&
                <>
                  {this.resourcesToExport.length === 1 && <em>One password is going to be exported</em>}
                  {this.resourcesToExport.length > 1 && <em>{this.resourcesToExport.length} passwords are going to be exported.</em>}
                </>
              }
            </p>
          </div>

          <div className="submit-wrapper clearfix">
            <FormSubmitButton
              disabled={!this.areActionsAllowed}
              processing={this.isProcessing}
              value="Export"/>
            <FormCancelButton
              disabled={!this.areActionsAllowed}
              onClick={this.handleCancel}/>
          </div>

        </form>
      </DialogWrapper>
    );
  }
}

ExportResources.contextType = AppContext;

ExportResources.propTypes = {
  onClose: PropTypes.func, // Whenever the dialog is closes
  resourceWorkspaceContext: PropTypes.object, // The resource workspace context
  dialogContext: PropTypes.object // The dialog context
};

export default withDialog(withResourceWorkspace(ExportResources));
