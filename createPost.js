function createPost(title, body, category){
    var newPost = new NetBuz.NewPost(title, body, category);

    console.log("here");

    function success(){
        alert("Post Successful");
    }

    function failure(){
    	alert("failed");
    }
    NetBuz.createPost(newPost,success,failure);
}

function validation(){

    var title = document.getElementByID("title").value;
    var body = document.getElementByID("body").value;
    var category = document.getElementByID("category").value;

    if(empty(title)){
        alert("Invalid Title. Try Again");
        return false;
    }
    if(empty(body)){
        alert("Invalid Body. Try Again");
        return false;
    }
    if(empty(category)){
        alert("Invalid Category. Try Again");
    }
    return true;
}

function empty(str){
    return (!str || 0 === str.length || /^\s*$/.test(str))
}

function resetForm(){
    document.getElementById("createForm").reset();
}