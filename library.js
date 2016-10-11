(function(module) {
    "use strict";

    var async = module.parent.require('async'),
        db = module.parent.require('./database'),
        meta = module.parent.require('./meta'),
        user = module.parent.require('./user'),
        groups = module.parent.require('./groups');

    var plugin = {};

    plugin.init = function(params, callback) {
        var app = params.router,
            middleware = params.middleware;

        app.get('/admin/plugins/latest-group', middleware.admin.buildHeader, renderAdmin);
        app.get('/api/admin/plugins/latest-group', renderAdmin);

        callback();
    };

    function renderAdmin(req, res, next) {
        async.waterfall([
            function(next) {
                db.getSortedSetRevRange('groups:createtime', 0, -1, next);
            },
            function(groupNames, next) {
                groupNames = groupNames.filter(function(name) {
                    return name.indexOf(':privileges:') === -1 && name !== 'registered-users';
                });

                groups.getGroupsData(groupNames, next);
            }
        ], function(err, groupsData) {
            if (err) {
                return next(err);
            }

            res.render('latest-group-admin', {
                groups: groupsData
            });
        });
    }

    plugin.updateGroupTitle = function(joinData) {
        var uid = joinData.uid,
            groupName = joinData.groupName;

        async.parallel({
            settings: function(next) {
                meta.settings.get('latest-group', next);

            },
            user: function(next) {
                user.getUserFields(uid, ['uid', 'groupTitle'], next);
            },
        }, function(err, results) {
            if (err) {
                return;
            }
            var query = 'do not change ' + results.user.groupTitle;
            if (results.settings[query] !== "on") {
                user.setUserField(
                    uid,
                    'groupTitle',
                    groupName,
                    null
                );
            }
        });
    };

    plugin.addAdminNavigation = function(header, callback) {
        header.plugins.push({
            route: '/plugins/latest-group',
            icon: 'fa-users',
            name: 'Latest Group'
        });

        callback(null, header);
    };

    module.exports = plugin;
}(module));
