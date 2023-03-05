'use strict';

var CredentialStorage = require('./credential_storage');
var Storage = require('./storage');
var Translator = require('./translator');

module.exports = function() {
    var password_stars_class = 'password-stars';

    var storage_key = 'temporary-credentials';

    function sanitize_credential(credential) {
        var fields = ['url', 'username', 'password', 'priority'];
        var result = {};

        for(var f in fields) {
            if (fields.hasOwnProperty(f) && credential.hasOwnProperty(fields[f])) {
                var value = credential[fields[f]];
                if(typeof(value) === 'string') {
                    console.log('plop');
                    value = value.replace(/[\u00A0-\u9999<>&'"]/gim, function (i) {
                        return '&#' + i.charCodeAt(0) + ';';
                    });
                }
                result[fields[f]] = value;
            }
        }

        return result;
    }

    function display_credentials(credentials) {
        var container = document.getElementsByClassName('credentials')[0];
        container.innerHTML = '';

        credentials = Object.keys(credentials).map(function(e) {
            return credentials[e];
        });
        credentials.sort(CredentialStorage.sortCredentials);

        for (var key in credentials) {
            if (credentials.hasOwnProperty(key)) {
                // We sanitize upon display only because the username and
                // password might contain chars that could be transformed
                // thus making the credential invalid.
                var c = sanitize_credential(credentials[key]);

                container.innerHTML +=
                    '<tr>' +
                        '<td class="url" title="' + c.url + '">' + c.url + '</td>' +
                        '<td class="username" title="' + c.username + '">' + c.username + '</td>' +
                        '<td class="password">' +
                            '<span class="' + password_stars_class + '">***</span>' +
                        '</td>' +
                        '<td class="priority">' + (c.priority || 1) + '</td>' +
                        '<td class="action">' +
                            '<button class="remove" data-url="' + c.url + '">' + Translator.translate('remove_credential') + '</button>' + '' +
                            '<button class="edit" data-url="' + c.url + '">' + Translator.translate('edit_credential') + '</button>' + '' +
                        '</td>' +
                    '</tr>';
            }
        }
    }

    function submit(e) {
        e.preventDefault();

        var url = document.getElementById('url');
        var username = document.getElementById('username');
        var password = document.getElementById('password');
        var priority = document.getElementById('priority');

        var values = {
            url: url.value,
            username: username.value,
            password: password.value,
            priority: priority.value
        };

        var valid = true;
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                var v = values[key];

                if(v === '') {
                    valid = false;
                }
            }
        }

        if(valid) {
            var old = document.querySelector('tr.editing .url');
            if(old && old.innerText.length > 0) {
                CredentialStorage.removeCredential(old.innerText);
            }

            CredentialStorage.addCredential(values);

            url.value = '';
            username.value = '';
            password.value = '';
            priority.value = 1;

            reset_form();
        }
    }

    function remove(e) {
        var url = e.target.getAttribute('data-url');
        CredentialStorage.removeCredential(url);
    }

    function edit(e) {
        reset_form();

        var url = document.getElementById('url');
        var username = document.getElementById('username');
        var password = document.getElementById('password');
        var priority = document.getElementById('priority');

        var tr = e.target.closest('tr');

        tr.classList.add('editing');

        url.value = tr.getElementsByClassName('url')[0].textContent;
        username.value = tr.getElementsByClassName('username')[0].textContent;
        password.value = '';  // use sha hash to check if password was changed
        priority.value = tr.getElementsByClassName('priority')[0].textContent;

        document.getElementsByClassName('credential-form-submit')[0].textContent = Translator.translate('edit_credential');
    }

    function reset_form() {
        var el = document.querySelector('tr.editing');
        if(el) el.classList.remove('editing');

        document.getElementsByClassName('credential-form-submit')[0].textContent = Translator.translate('add_credential');
    }

    function init() {
        CredentialStorage.register(display_credentials);

        document.getElementById('credential-form').addEventListener('submit', submit);

        document.addEventListener('click', function(e) {
            if(e.target.matches('.credential-form-reset')) {
                e.stopPropagation();
                reset_form(e);
            }
            if(e.target.matches('.remove')) {
                e.stopPropagation();
                remove(e);
            }
            if(e.target.matches('.edit')) {
                e.stopPropagation();
                edit(e);
            }
        });

        Storage.get(storage_key, function(result) {
            document.getElementById('url').value = result.url || '';
            document.getElementById('username').value = result.username || '';
            document.getElementById('password').value = result.password || '';
            document.getElementById('priority').value = result.priority || 1;

            Storage.set(storage_key, {});
        });

        addEventListener('unload', function () {
            var url = document.getElementById('url').value;
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            var priority = document.getElementById('priority').value;

            var values = {
                url: url,
                username: username,
                password: password,
                priority: priority
            };
            chrome.extension.getBackgroundPage().Storage.set.apply(this, [storage_key, values]);
        });
    }

    return {
        'init': init,
        'sanitize_credential': sanitize_credential
    };
}();
