"use strict";

var NB={};

NB.myPosts=[];
NB.postIndex=null;
NB.fieldset=null;

NB.parseForm=(formID)=>{
  return $("#"+formID)
    .serializeArray()
    .reduce((obj,ele)=>{
      obj[ele.name]=ele.value;
      return obj;},
      {});
}

NB.fillForm=(formID, formData)=>{
  for(var prop in formData){
    $('#'+formID+' [name="'+prop+'"]').val(formData[prop]);
  }
}

NB.getMyPostsFromServer=(callback)=>{
  var userID=NetBuz.getLoggedInId();
  if(!userID){
    return;
  }
  NetBuz.searchPosts([userID],[],[],
    (data)=>{
      NB.myPosts=data;
      callback(data);
    },
    ()=>{
      NB.myPosts=[];
      callback([]);
    }
  );
}

NB.updateMyPostList=(posts)=>{
  var myPostList=$("#my_posts");
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
  NB.fieldset.prop("disabled",false);
  $(".my-post-list-page").hide();
  $(".edit-form-page").show();
}

NB.gotoMyPostListPage=()=>{
  NB.updateMyPostList(NB.myPosts);
  $(".edit-form-page").hide();
  $(".my-post-list-page").show();
}

NB.handleEditFormUpdateButton=()=>{
  var formData= NB.parseForm("edit_post");
  var postId= NB.myPosts[NB.postIndex]&&NB.myPosts[NB.postIndex].postId;
  NB.fieldset.prop("disabled",true);
  var success=()=>{
    alert("post updated");
    NB.postIndex=null;
    NB.getMyPostsFromServer(()=>{
      NB.gotoMyPostListPage();
    });
  }
  var failure=()=>{
    alert("Error");
    NB.fieldset.prop("disabled",false);
  }
  NetBuz.modifyPost(postId, formData, success, failure);
}

NB.handleEditFormRemoveButton=()=>{
  NB.fieldset.prop("disabled",true);
  var postId= NB.myPosts[NB.postIndex]&&NB.myPosts[NB.postIndex].postId;
  var success=()=>{
    alert("post deleted");
    NB.postIndex=null;
    NB.getMyPostsFromServer(()=>{
      NB.gotoMyPostListPage();
    });
  }
  var failure=()=>{
    alert("Error");
    NB.fieldset.prop("disabled",false);
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
  NB.fieldset=$("#edit_post fieldset");
  var loggedIn=NetBuz.getLoggedInId();
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
