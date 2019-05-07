"use strict";

(function(g) {
    const o = {
        init: function() {
            let self = this;
            
            wm.init.call(wm);
            wm.model.init.call(wm.model)
                .then(function() {
                    wm.ctrl.init.call(wm.ctrl);
                });
            
        }
    };

    g.wm.home = o;

})((this || 0).self || global);

(function($) {
    $(function() {
        wm.home.init.call(wm.home);
    });
})(jQuery);