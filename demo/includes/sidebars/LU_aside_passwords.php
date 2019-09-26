<div class="panel aside js_wsp_pwd_sidebar_second passbolt_component_resource_sidebar js_component passbolt_view_component_resource_sidebar ready"
     id="js_pwd_details" >
    <div class="sidebar resource">
        <div class="sidebar-header">
            <div class="logo">
                <img src="https://www.google.com/s2/favicons?domain=www.inkscape.org" alt="avatar picture" class="avatar-logo">
                <div class="avatar-text-label"></div>
            </div>
            <h3>
                <span class="name">Inkscape
                    <a class="title-link" title="Copy the link to this password">
                        <span class="svg-icon light">
                            <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1520 1216q0-40-28-68l-208-208q-28-28-68-28-42 0-72 32 3 3 19 18.5t21.5 21.5 15 19 13 25.5 3.5 27.5q0 40-28 68t-68 28q-15 0-27.5-3.5t-25.5-13-19-15-21.5-21.5-18.5-19q-33 31-33 73 0 40 28 68l206 207q27 27 68 27 40 0 68-26l147-146q28-28 28-67zm-703-705q0-40-28-68l-206-207q-28-28-68-28-39 0-68 27l-147 146q-28 28-28 67 0 40 28 68l208 208q27 27 68 27 42 0 72-31-3-3-19-18.5t-21.5-21.5-15-19-13-25.5-3.5-27.5q0-40 28-68t68-28q15 0 27.5 3.5t25.5 13 19 15 21.5 21.5 18.5 19q33-31 33-73zm895 705q0 120-85 203l-147 146q-83 83-203 83-121 0-204-85l-206-207q-83-83-83-203 0-123 88-209l-88-88q-86 88-208 88-120 0-204-84l-208-208q-84-84-84-204t85-203l147-146q83-83 203-83 121 0 204 85l206 207q83 83 83 203 0 123-88 209l88 88q86-88 208-88 120 0 204 84l208 208q84 84 84 204z"/></svg>
                        </span>  
                        <span class="visuallyhidden">Copy the link to this password</span>
                    </a>
                </span>
                <span class="type">resource</span>
            </h3>
            <a id="js_wsp_pwd_sidebar_close" class="js_sidebar_close dialog-close" href="#">
                <span class="svg-icon">
                    <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/></svg>
                </span>
                <span class="visuallyhidden">Close</span>
            </a>
        </div>
        <?php include('includes/sidebars/sections/password_info.php'); ?>
        <?php include('includes/sidebars/sections/password_description.php'); ?>
        <?php include('includes/sidebars/sections/password_tags.php'); ?>
        <?php include('includes/sidebars/sections/password_shared.php'); ?>
        <?php include('includes/sidebars/sections/password_comments.php'); ?>
        <?php include('includes/sidebars/sections/password_activity.php'); ?>
    </div>
</div>
<?php include('includes/sidebars/sidebar.php') ?>

<script type="application/javascript">
    // DEMO ONLY -- not for production use
    $(".sidebar-header img").on("error", function(event) {
      $(this).hide();
      const str = 'Inkscape',
      firstname = str.substr(0, str.indexOf(' ')).charAt(0),
      lastname = str.substr(str.lastIndexOf(' ') + 1).charAt(0),
      color = getColor((str.length) % 10);
      let getLabel = `${firstname}${lastname}`;
      let labelName = getLabel.toUpperCase();
      $(event.target).closest('.sidebar-header').find('div.avatar-text-label').css({'background': color}).addClass('side-bar-text-label').text(labelName);
    });
    function getColor(index) {
      const colorsArray = ['dc4242', '4990e2', '4ad4b6', 'da3549', 'd5783b', '7d54d6', 'e259a6', '50e3c2', 'db8d5a', 'cee14a'];
      return `#${colorsArray[index]}`;
    };
</script>