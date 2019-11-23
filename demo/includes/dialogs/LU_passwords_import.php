<div class="dialog-wrapper ready">
	<div class="dialog import">
		<div class="dialog-header">
			<h2>Import passwords</h2>
			<a href="demo/LU_passwords.php" class="dialog-close">
			<?php include('includes/svg-icons/close.php'); ?>
								<span class="visuallyhidden">close</span>
			</a>

		</div>
		<div class="dialog-content">
			<form action="demo/LU_passwords.php" id="js_rs_import">
				<div class="form-content">
					<div class="input text required error">
						<label>
							Select a file to import
							(<a role="link" data-tooltip="csv exports from keepassx, lastpass and 1password are supported">csv</a>
							or <a role="link" data-tooltip="kdbx files are files generated by keepass v2.x">kdbx</a>)
						</label>
						<input name="passbolt.model.Import.file"
									 class="jfilestyle"
									 id="js_field_name" placeholder="name" type="file"
                               data-text="Choose a file" data-placeholder="No file selected">

						<div id="js_field_import_feedback" class="message ready error">
							This is the error message
						</div>
					</div>
					<div class="input text">
						<input type="checkbox" name="passbolt.model.Import.category_as_tags"
						       id="js_field_category_as_tags"> <label>Import categories as tags</label>
					</div>

				</div>
				<div class="submit-wrapper clearfix">
					<input class="button primary" value="Import" type="submit" onclick="javascript:window.location.href='demo/LU_passwords_import_options.php'; return false;">
					<a href="demo/LU_passwords.php" class="js-dialog-cancel cancel">Cancel</a>
				</div>
			</form>
		</div>
	</div>
</div>