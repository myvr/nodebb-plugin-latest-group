(function(module) {
    "use strict";

    var async = module.parent.require('async'),
        user = module.parent.require('./user'),
        posts = module.parent.require('./posts');

    var plugin = {};

    plugin.updateGroupTitle = function(joinData) {
        var uid = joinData.uid,
            groupName = joinData.groupName;

        user.setUserField(uid, 'groupTitle', groupName, null);
    };

    module.exports = plugin;
}(module));
