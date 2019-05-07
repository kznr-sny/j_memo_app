"use strict";

(function(g) {
    const o = {
        init: function() {
            let self = this;

            let group_ref = wm.model.get_ref.call(wm.model, 'group'),
                memo_ref = wm.model.get_ref.call(wm.model, 'memo');

            // Group
            group_ref.on('child_added', (ss) => {
                let v = ss.val(),
                    $li = $(`<li id="${ss.key}" class="jsGroupParent" />`);
                
                $li.append(
                    '<a href="#" class="jsGroupMenu">' +
                        '<span class="oi oi-folder icon"></span>' +
						`<span class="jsGroupName">${v.name}</span>` +
						'<span class="oi oi-chevron-right pull_right icon"></span>' +
                    '</a>' +
                    '<ul>' +
                        '<li class="jsNewList"><span>Create New List</span></li>' +
                    '</ul>'
                    )
                    .appendTo('.jsGroup');
            });
            group_ref.on('child_changed', (ss) => {
                let v = ss.val();

                $('.jsGroupName', `#${ss.key}`).text(v.name);
            });
            group_ref.on('child_removed', (ss) => {
                $(`#${ss.key}`).remove();
            });

            // Memo
            memo_ref.on('child_added', (ss) => {
                let v = ss.val(),
                    $parent = $('ul', `#${v.group_id}`),
                    $li = $(`<li id="${ss.key}" class="jsList" />`),
                    data = {
                        key: ss.key,
                        group_id: v.group_id,
                        title: v.title,
                        body: v.body,
                        updated: v.updated
                    };
                
                $li.append(
                    '<span class="oi oi-file icon"></span>' +
                    `<span class="jsListName">${v.title}</span>` +
                    '<span class="oi oi-trash pull_right icon jsDelList"></span>'
                );
                $li.data('list_data', data);

                $li.appendTo($parent);
            });
            memo_ref.on('child_changed', (ss) => {
                let v = ss.val(),
                    $li = $(`#${ss.key}`),
                    data = {
                        key: ss.key,
                        group_id: v.group_id,
                        title: v.title,
                        body: v.body,
                        updated: v.updated
                    };

                $li.data('list_data', data);
                $('.jsListName', $li).text(`${v.title}`);
            });
            memo_ref.on('child_removed', (ss) => {
                $(`#${ss.key}`).remove();
            });

            // Toggle humberger menu
            $('.jsMenu').on('click', function() {
                self.toggle_sidemenu.call(self);

                return false;
            });

            // Edit content
            $('.jsEdit').on('click', function() {
                $(this).hide();

                $('.jsMainTitleForm').val($('.jsMainTitle').text());
                $('.jsMainTextarea').val($('.jsMainContent').data('main-content') || '');

                self.toggle_display.call(self);
                
                return false;
            });

            // Save content
            $('.jsSave').on('click', function() {
                $('.jsInitDisp').show();
                self.toggle_display.call(self);

                self.save_form.call(self, memo_ref);

                return false;
            });

            // Toggle group menu
            $(document).on('click', '.jsGroupMenu', function() {
				let $ul = $(this).siblings('ul');
                $ul.slideToggle(300);
                
                return false;
            });
            
            // Open list
            $(document).on('click', '.jsList', function() {
                let $this = $(this),
                    data = $this.data('list_data');

                $('.jsInitDisp').show();

                self.init_main.call(self);
                self.set_main.call(self, data);
                self.toggle_sidemenu.call(self);

                return false;
            });

            // Delete list
            $(document).on('click', '.jsDelList', function() {
                let key = $(this).parent().attr('id');

                if(window.confirm('Are you sure you want to completely remove this list ?')) {
                    memo_ref.child('/' + key).remove();
                    self.init_main.call(self);
                }

                self.init_main.call(self);
                $('.jsInitDisp').hide();

                return false;
            });

            // Create new group
            $('.jsNewGroup').on('click', function() {
                $('.jsModal').show();             
            });

            // Save button on modal
            $('.jsSaveBtn', '.jsModal').on('click', function() {
                self.save_group.call(self, group_ref, $('.jsNewGroupName').val());
            });

            // Cancel button on modal
            $('.jsCancelBtn', '.jsModal').on('click', function() {
                $('.jsNewGroupName').val('');
                $('.jsModal').hide();
            });

            // Create new list
            $(document).on('click', '.jsNewList', function() {
                let group_id = $(this).parents('.jsGroupParent').attr('id');
                
                self.init_main.call(self);
                self.save_form.call(self, memo_ref, group_id);

                return false;
            });

            // Logout
            $('.jsLogout').on('click', function() {
                wm.logout.call(wm);
                
                return false;
            });
            
        },
        
        toggle_sidemenu: function() {
            let self = this;

            $('nav').toggleClass('open');
			$('#overlay').toggleClass('active');
        },

        init_main: function() {
            let self = this;

            if($('.jsSave').is(':visible')) {
                self.toggle_display.call(self);
            }

            $('.jsMainTitle').text('');
            $('.jsUpdated', '#main').text('');
            $('.jsMainContent', '#main').text('')
                .data('main-content', '');
            $('.jsMainKey').val('');
            $('.jsMainGroupId').val('');
            $('.jsMainTitleForm').val('');
            $('.jsMainTextarea').val('');
        },

        set_main: function(data) {
            let self = this;

            marked.setOptions({
                langPrefix: ''
            });

            $('.jsMainKey').val(data.key || '');
            $('.jsMainGroupId').val(data.group_id || '');
            $('.jsMainTitle').text(data.title || '');
            $('.jsUpdated', '#main').text(data.updated || '');
            $('.jsMainContent', '#main').html(marked(data.body || ''))
                .data('main-content', data.body || '');

            // highlight code block
            $('pre code', '.jsMainContent').each(function(i, block) {
                hljs.highlightBlock(block);
            });

        },

        toggle_display: function() {
            let self = this;
            
            $('.jsSave').toggleClass('display-none');
            $('.jsMainTitle').toggleClass('display-none');
            $('.jsMainTitleForm').toggleClass('display-none');
            $('.jsMainDisp').toggleClass('display-none');
            $('.jsMainForm').toggleClass('display-none');
            $('#main').toggleClass('edit');
        },

        save_form: function(memo_ref, opt_group = null) {
            let self = this,
                key = $('.jsMainKey').val(),
                title = $('.jsMainTitleForm').val(),
                updated = wm.formatDate.call(self, new Date(), 'YYYY.MM.DD hh:mm:ss'),
                body = $('.jsMainTextarea').val(),
                data = {
                    title: title || 'title',
                    body: body || 'body',
                    group_id: opt_group || $('.jsMainGroupId').val(),
                    updated: updated
                },
                upds = {};

            if(!key) {
                memo_ref.push(data);
            } else {
                upds['/' + key] = data;
                memo_ref.update(upds);
            }

            $('.jsMainTitle').text(title);
            $('.jsUpdated', '#main').text(updated);
            $('.jsMainContent', '#main').html(marked(body || ''))
                .data('main-content', body || '');

            // highlight code block
            $('pre code', '.jsMainContent').each(function(i, block) {
                hljs.highlightBlock(block);
            });

        },

        save_group: function(group_ref, name) {
            let self = this,
                data = {name: name};

            group_ref.push(data);

            $('.jsNewGroupName').val('');
            $('.jsModal').hide();
        },
        
    };

    g.wm.ctrl = o;

})((this || 0).self || global);
