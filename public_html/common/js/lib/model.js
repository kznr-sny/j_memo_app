"use strict";

(function(g) {
    const o = {
        init: function() {
            let self = this,
                $dfd = $.Deferred();

            let fb = wm.FIREBASE,
                db = {};

            wm.get_profile.call(wm).then(function(profile) {
                db.group = fb.database().ref(`/${profile.uid}/`).child('group');
                db.memo = fb.database().ref(`/${profile.uid}/`).child('memo');
                self.set_ref.call(self, db);

                $dfd.resolve();
            });

            return $dfd.promise();
        },

        set_ref: function(refs) {
            self.refs = refs;
        },

        get_ref: function(ref_name) {
            return _.property(ref_name)(self.refs);
        }

    };

    g.wm.model = o;

})((this || 0).self || global);
