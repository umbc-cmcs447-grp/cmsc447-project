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
  $("#post_table>thead .order").text('\u2212');
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
  var myPostTable=$("#post_table tbody");
  $("#number_of_posts").text(posts.length);
  myPostTable.empty();
  posts.forEach((post,index)=>{
    var timeString=new Date(Number(post.lastModified)).toLocaleString("en-US");
    myPostTable.append(
      "<tr>"+
        "<td><div class='number'>"+(index+1)+"</div></td>"+
        "<td><div class='title'>"+post.title+"</div></td>"+
        "<td><div class='status'>"+post.status+"</div></td>"+
        "<td><div class='category'>"+post.category+"</div></td>"+
        "<td><div class='time'>"+timeString+"</div></td>"+
      "</tr>"
      );
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
  var failure=(req)=>{
    if(req.status===403){
      $("#login").show();
    }
    else{
      alert("Error");
    }
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
  var failure=(req)=>{
    if(req.status===403){
      $("#login").show();
    }
    else{
      alert("Error");
    }
    NB.fieldset.prop("disabled",false);
  }
  NetBuz.deletePost(postId, success, failure);
}

NB.handleEditFormCancelButton=()=>{
  NB.postIndex=null;
  NB.gotoMyPostListPage();
}

NB.handleModalLogin=()=>{
	var password = document.getElementById("password").value;
	var userID = document.getElementById("user_id").value;
	var fieldset=document.getElementById("login_fieldset");

	fieldset.disabled=true;
	NetBuz.login(userID, password,
		()=>{
			var loggedInID=NetBuz.getLoggedInId();
      $("#login").hide();
      $("#login form")[0].reset();
      fieldset.disabled=false;
		},
		(xhr)=>{
			if(xhr.status===401){
				alert("Incorrect ID or Password.");
			}else{
				alert("Unable to log in right now.");
			}
			fieldset.disabled=false;
		}
	);
	return false;
}

NB.handleLogout=()=>{
  NetBuz.logout(()=>{NB.updateLoggedInView(false)}, ()=>{alert("You have failed to log out.")});
}

NB.sortListBy=(prop, clickedEle)=>{
  var increasing="\u2228"; //v
  var decreasing="\u2227";//^
  var uniform="\u2212"; //-
  var orderText=$(clickedEle).children(".order").first();
  if(orderText.text()===uniform||orderText.text()===decreasing){
    $("#post_table>thead .order").text(uniform);
    orderText.text(increasing);
    NB.myPosts.sort((a,b)=>a[prop]>b[prop]);
  }
  else if(orderText.text()===increasing){
    $("#post_table>thead .order").text(uniform);
    orderText.text(decreasing);
    NB.myPosts.sort((a,b)=>a[prop]<b[prop]);
  }
  NB.updateMyPostList(NB.myPosts);
}

NB.refreshPosts=()=>{
  NB.getMyPostsFromServer(NB.updateMyPostList);
}

//this is the app entry point
$(()=>{
  NB.fieldset=$("#edit_post fieldset");
  var loggedIn=NetBuz.getLoggedInId();
  if(loggedIn){
    NB.updateLoggedInView(true);
    NB.getMyPostsFromServer(NB.updateMyPostList);
    $("#post_table tbody").on("click", "tr", function(event){
      NB.postIndex=$(event.currentTarget).index();
      NB.gotoEditFormPage(NB.myPosts[NB.postIndex]);
    });
  }
  else{
    NB.updateLoggedInView(false);
  }
});
