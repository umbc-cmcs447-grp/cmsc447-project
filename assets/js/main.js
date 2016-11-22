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
    }
};

function queryParams() {
    var params={};location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){params[k]=v});
    return params;
}
