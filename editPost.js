"use strict";

const NB={};

NB.myPosts=[];

NB.ParseForm=(formID)=>{
  return $("#"+formID)
    .serializeArray()
    .reduce((obj,ele)=>{
      obj[ele.name]=ele.value;
      return obj;},
      {});
}

NB.fillForm=(formID, formData)=>{
  for(let prop in formData){
    $('#'+formID+' [name="'+prop+'"]').val(formData[prop]);
  }
}

NB.getMyPostsFromServer=()=>{
  //The API cant do this yet, return an array of dummy post object for now
  return [
    {
      title: "Example Post",
      body: "Example post description. text...",
      category: "TUTORING",
      status: "OPEN"
    }
  ];
}

NB.updateMyPostList=(posts)=>{
  let myPostList=$("#my_posts");
  myPostList.empty();
  posts.forEach((post)=>{
    myPostList.append("<li><u>"+post.title+"</u></li>");
  });

}

NB.updateLoggedInView=(isLoggedIn)=>{
  if(isLoggedIn){
    $(".show-when-logged-in").show();
    $(".show-when-logged-out").hide();
  }
  else{
    $(".show-when-logged-in").hide();
    $(".show-when-logged-out").show();
  }
}

NB.gotoEditFormPage=(post)=>{
  NB.fillForm("edit_post", post);
  $(".my-post-list-page").hide();
  $(".edit-form-page").show();
}

NB.gotoMyPostListPage=()=>{
  NB.updateMyPostList(NB.myPosts);
  $(".edit-form-page").hide();
  $(".my-post-list-page").show();
}

NB.handleEditFormUpdateButton=()=>{
  //...ajax to server
  //..modify NB.MyPost
  NB.gotoMyPostListPage();
}

NB.handleEditFormRemoveButton=()=>{
  //...ajax to server
  //..modify NB.MyPost
  NB.gotoMyPostListPage();
}

NB.handleEditFormCancelButton=()=>{
  NB.gotoMyPostListPage();
}


NB.handleLogout=()=>{
  NetBuz.logout(()=>{NB.updateLoggedInView(false)}, ()=>{alert("You have failed to log out.")});
}

//this is the app entry point
$(()=>{
  let loggedIn=true; //for development purpose set this to true, until there is a way to test log in with server
  if(loggedIn){
    NB.updateLoggedInView(true);
    NB.myPosts=NB.getMyPostsFromServer();
    NB.updateMyPostList(NB.myPosts);
    $("#my_posts").on("click", "li", function(event){
      let postIndex=$(event.currentTarget).index();
      NB.gotoEditFormPage(NB.myPosts[postIndex]);
    });
  }
  else{
    NB.updateLoggedInView(false);
  }
});
