<form role="form" class="latest-group-settings">
    <div class="row">
        <div class="col-sm-2 col-xs-12 settings-header">
            General Settings
        </div>
        <div class="col-sm-10 col-xs-12">
            <label>
                Do <span style="text-decoration: underline">not</span> automatically
                change a user's group title if it is currently one of the following groups
            </label>
            <!-- BEGIN groups -->
            <div class="checkbox">
                <label>
                    <input type="checkbox" name="do not change {groups.name}">
                    {groups.displayName}
                </label>
            </div>
            <!-- END groups -->
        </div>
    </div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
<i class="material-icons">save</i>
</button>

<script>
require(['settings'], function(Settings) {
        Settings.load('latest-group', $('.latest-group-settings'));

        $('#save').on('click', function() {
                Settings.save('latest-group', $('.latest-group-settings'), function() {
                        app.alert({
type: 'success',
alert_id: 'latest-group-saved',
title: 'Settings Saved',
message: 'Please reload your NodeBB to apply these settings',
clickfn: function() {
socket.emit('admin.reload');
}
})
                        });
                });
        });
</script>
