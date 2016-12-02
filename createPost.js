
function updateLoggedInView(isLoggedIn){
  if(isLoggedIn){
    $(".show-when-logged-in").show();
    $(".show-when-logged-out").hide();
  }
  else{
    $(".show-when-logged-in").hide();
    $(".show-when-logged-out").show();
  }
  alert("updateLoggedInView");
}

function createPost(title, body, category){
    var newPost = new NetBuz.NewPost(title, body, category);

    console.log("here");

    function success(){
        alert("Post Created Successfully");
        resetForm();
        updateLoggedInView(true);
    }

    function failure(){
    	alert("Failed to Create Post. Try Again");
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
    createPost(title, body, category);
    return true;
}

function empty(str){
    return (!str || 0 === str.length || /^\s*$/.test(str))
}

function resetForm(){
    document.getElementById("createForm").reset();
}

//entry point
$(function(){
    alert("start");
  var loggedInID=NetBuz.getLoggedInId();
  if(loggedInID){
    updateLoggedInView(true);
    alert("logged in");
  }else{
    updateLoggedInView(false);
    alert("not logged in");
  }
});

