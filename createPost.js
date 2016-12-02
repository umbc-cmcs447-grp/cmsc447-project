
function updateLoggedInView=(isLoggedIn)=>{
  if(isLoggedIn){
    $(".show-when-logged-in").show();
    $(".show-when-logged-out").hide();
  }
  else{
    $(".show-when-logged-in").hide();
    $(".show-when-logged-out").show();
  }
}

function createPost(title, body, category){
    var newPost = new NetBuz.NewPost(title, body, category);

    console.log("here");

    function success(){
        $("#logged_in_message").text("Post created successfully");
        updateLoggedInView(true);
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
  var loggedInDiv=$("#logged_in_message");
  var loggedInID=NetBuz.getLoggedInId();
  if(loggedInID){
    loggedInDiv.text("You must be logged out to create an account.");
    updateLoggedInView(true);
  }else{
    updateLoggedInView(false);
  }
});