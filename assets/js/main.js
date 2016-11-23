var NetBuz = {
    baseUrl: function () {
        return "localhost:9000";
    },

    NewPost: function (title, body, category) {
        this.title = title;
        this.body = body;
        this.category = category;
    },

    NewUser: function (id, firstName, lastName, password) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
    },

    authStorageKey: "X-NetBuz-AuthHeaderVal",
    userStorageKey: "X-NetBuz-User",

    getLoggedInId: function () {
        return localStorage.getItem(NetBuz.userStorageKey)
    },

    setAuthToken: function (id, data) {
        localStorage.setItem(NetBuz.authStorageKey, id + ":" + data.authToken);
        localStorage.setItem(NetBuz.userStorageKey, id)
    },

    setAuthHeader: function (request) {
        request.setRequestHeader("X-NetBuz-Auth", localStorage.getItem(NetBuz.authStorageKey));
    },

    createUser: function (newUser, success, failure) {
        $.ajax({
            type: 'POST',
            url: NetBuz.baseUrl() + "/users",
            contentType: "application/json",
            data: JSON.stringify(newUser),
            dataType: "json",
            success: success,
            error: failure
        })
    },

    getUser: function (id, success, failure) {
        $.ajax({
            type: 'GET',
            url: NetBuz.baseUrl() + "/users/" + id,
            dataType: "json",
            success: success,
            error: failure
        })
    },

    login: function (id, password, success, failure) {
        $.ajax({
            type: 'POST',
            url: NetBuz.baseUrl() + "/users/" + id + "/login",
            contentType: "application/json",
            data: JSON.stringify({
                password: password
            }),
            dataType: "json",
            success: function (data) {
                NetBuz.setAuthToken(id, data);
                success(data);
            },
            error: failure
        })
    },

    logout: function (success, failure) {
        $.ajax({
            type: 'POST',
            url: NetBuz.baseUrl() + "/users/" + NetBuz.getLoggedInId() + "/logout",
            beforeSend: function (request) {
                NetBuz.setAuthHeader(request)
            },
            success: function () {
                localStorage.removeItem(NetBuz.authStorageKey);
                localStorage.removeItem(NetBuz.userStorageKey);
                success()
            },
            error: failure
        })
    },

    changePassword: function (id, oldPass, newPass, success, failure) {
        $.ajax({
            type: 'PATCH',
            url: NetBuz.baseUrl() + "/users/" + id + "/password",
            contentType: "application/json",
            data: JSON.stringify({
                oldPassword: oldPass,
                newPassword: newPass
            }),
            success: function (data) {
                NetBuz.setAuthToken(id, data);
                success(data)
            },
            error: failure
        })
    },

    createPost: function (newPost, success, failure) {
        $.ajax({
            type: 'POST',
            url: NetBuz.baseUrl() + "/posts",
            beforeSend: function (request) {
                NetBuz.setAuthHeader(request)
            },
            contentType: "application/json",
            data: JSON.stringify(newPost),
            dataType: "json",
            success: success,
            error: failure
        })
    },

    getPost: function (postId, success, failure) {
        $.ajax({
            type: 'GET',
            url: NetBuz.baseUrl() + "/posts/" + postId,
            dataType: "json",
            success: success,
            error: failure
        })
    },

    modifyPost: function (postId, updates, success, failure) {
        $.ajax({
            type: 'PATCH',
            url: NetBuz.baseUrl() + "/posts/" + postId,
            beforeSend: function (request) {
                NetBuz.setAuthHeader(request)
            },
            contentType: "application/json",
            data: JSON.stringify(updates),
            dataType: "json",
            success: success,
            error: failure
        })
    },

    deletePost: function (postId, success, failure) {
        $.ajax({
            type: 'DELETE',
            url: NetBuz.baseUrl() + "/posts/" + postId,
            beforeSend: function (request) {
                NetBuz.setAuthHeader(request)
            },
            dataType: "json",
            success: success,
            error: failure
        })
    },

    searchPosts: function (users, categories, statuses, success, failure) {
        var query = "";

        if (users[0] != null) {
            query += "users=" + users.join(',') + "&"
        }
        if (categories[0] != null) {
            query += "categories=" + categories.join(',') + "&"
        }
        if (statuses[0] != null) {
            query += "statuses=" + statuses.join(',')
        }

        $.ajax({
            type: 'GET',
            url: NetBuz.baseUrl() + "/search/posts?" + query,
            dataType: "json",
            success: success,
            error: failure
        })
    }
};

function queryParams() {
    var params={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){params[k]=v});
    return params;
}
