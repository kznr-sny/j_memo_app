"use strict";

(function(g) {
    const o = {

        FIREBASE_CONFIG: {
            apiKey: "",
		    authDomain: "",
		    databaseURL: "",
		    projectId: "",
		    storageBucket: "",
		    messagingSenderId: ""
        },

        init: function() {
            let self = this;

            // 共通系初期化
            self.FIREBASE = firebase.initializeApp(self.FIREBASE_CONFIG);
            // 認証チェック
            self.auth_check.call(self);
        },

        /**
         * ユーザー認証状態判別
         */
        auth_check: function() {
            let self = this,
                fb = self.FIREBASE,
                path = location.pathname;

            fb.auth().onAuthStateChanged(function(user) {
                if(user) {
                    if(path == '/login.html') {
                        location.href = '/index.html';
                    }
                } else {
                    if(path == '/login.html' || path == '/register.html') {
                        return false;
                    }
                    location.href = '/login.html';
                }

            });
        },

        /**
         * ユーザー認証情報取得
         * @return {promise}
         */
        get_profile: function() {
            let self = this,
                fb = self.FIREBASE,
                $dfd = $.Deferred();

            fb.auth().onAuthStateChanged(function(user) {
                if(user) {
                    $dfd.resolve(fb.auth().currentUser);
                }
            });
            return $dfd.promise();
        },

        /**
         * ログアウト
         */
        logout: function() {
            let self = this,
                fb = self.FIREBASE;

            fb.auth().signOut()
                .then(function() {
                    location.href = '/login';
                });
        },

        /**
         * 日付フォーマット変換
         * @param  {Date} date
         * @param  {String} format
         * @return {String}
         */
        formatDate: function(date, format) {
            if(!format) format = 'YYYY-MM-DD hh:mm:ss';
    
            format = format.replace(/YYYY/g, date.getFullYear());
            format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
            format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
            format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
            format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
            format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    
            return format;
        },

    };

    g.wm = o;

})((this || 0).self || global);
