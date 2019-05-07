"use strict";

(function(g) {
    const o = {
        init: function() {
            let self = this;
            
            wm.init.call(wm);
            self.login.call(self);
            self.register.call(self);
        },

        login: function() {
            let self = this,
                fb = wm.FIREBASE;

            $('#login').on('click', function() {
                let m = $('#email').val(),
                    p = $('#password').val();

                if(!m || !p) {return false;}

                fb.auth().signInWithEmailAndPassword(m, p)
                    .then(function() {
                        location.href = '/index.html';
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            });
        },

        register: function() {
            let self = this,
                fb = wm.FIREBASE;

            $('#register').on('click', function() {
                let m = $('#email').val(),
                    p = $('#password').val();

                if(!m || !p) {return false;}

                fb.auth().createUserWithEmailAndPassword(m, p)
                    .then(function() {
                        location.href = '/index.html'
                    })
                    .catch(function(error) {
                        window.alert(`Error: ${error.message}`);
                        console.log(error);
                    });
            });

        }
    };

    g.wm.auth = o;

})((this || 0).self || global);

(function($) {
    $(function() {
        wm.auth.init.call(wm.auth);
    });
})(jQuery);