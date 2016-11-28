"use strict";

const NB={};

NB.myPosts=[];
NB.postIndex=null;

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

NB.getMyPostsFromServer=(callback)=>{
  let userID=NetBuz.getLoggedInId();
  if(!userID){
    return;
  }
  NetBuz.searchPosts(userID,null,null,(data)=>{
    NB.myPosts=data;
    callback(data);
  });
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
  let formData= NB.ParseForm("edit_post");
  let postId= NB.myPosts[NB.postIndex].postId;
  let success=()=>{
    alert("post updated");
    NB.postIndex=null;
    NB.getMyPostsFromServer(()=>{
      NB.updateMyPostList();
      NB.gotoMyPostListPage();
    });
  }
  let failure=()=>{
    alert("Error");
  }
  NetBuz.modifyPost(postId, formData, success, failure);
}

NB.handleEditFormRemoveButton=()=>{
  let postId= NB.myPosts[NB.postIndex].postId;
  let success=()=>{
    alert("post deleted");
    NB.postIndex=null;
    NB.getMyPostsFromServer(()=>{
      NB.updateMyPostList();
      NB.gotoMyPostListPage();
    });
  }
  let failure=()=>{
    alert("Error");
  }
  NetBuz.deletePost(postId, success, failure);
}

NB.handleEditFormCancelButton=()=>{
  NB.postIndex=null;
  NB.gotoMyPostListPage();
}


NB.handleLogout=()=>{
  NetBuz.logout(()=>{NB.updateLoggedInView(false)}, ()=>{alert("You have failed to log out.")});
}

//this is the app entry point
$(()=>{
  let loggedIn=NetBuz.getLoggedInId();
  if(loggedIn){
    NB.updateLoggedInView(true);
    NB.getMyPostsFromServer(NB.updateMyPostList);
    $("#my_posts").on("click", "li", function(event){
      NB.postIndex=$(event.currentTarget).index();
      NB.gotoEditFormPage(NB.myPosts[NB.postIndex]);
    });
  }
  else{
    NB.updateLoggedInView(false);
  }
});
