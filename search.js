"use strict";

var NB={};

NB.posts=[];
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

NB.getPostsFromServer=()=>{
  var params=NB.parseForm("search");
  var users=params.user?[params.user]:[];
  var categories=params.category?[params.category]:[];
  var statuses=params.status?[params.status]:[];
  $("#post_table>thead .order").text('\u2212');
  NetBuz.searchPosts(users,categories,statuses,
    (data)=>{
      NB.posts=data;
      NB.updateMyPostList(data);
    },
    ()=>{
      NB.posts=[];
      NB.updateMyPostList([]);
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

NB.gotoPostDetailPage=(post)=>{
  NB.showPost(post);
  $(".search-page").hide();
  $(".post-detail-page").show();
}

NB.gotoMyPostListPage=()=>{
  NB.updateMyPostList(NB.posts);
  $(".post-detail-page").hide();
  $(".search-page").show();
}

NB.handleEditFormUpdateButton=()=>{
  var formData= NB.parseForm("edit_post");
  var postId= NB.posts[NB.postIndex]&&NB.posts[NB.postIndex].postId;
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
  var postId= NB.posts[NB.postIndex]&&NB.posts[NB.postIndex].postId;
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

NB.handleReturnButton=()=>{
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
    NB.posts.sort((a,b)=>(a[prop]>b[prop])-(a[prop]<b[prop]));
  }
  else if(orderText.text()===increasing){
    $("#post_table>thead .order").text(uniform);
    orderText.text(decreasing);
    NB.posts.sort((a,b)=>(a[prop]<b[prop])-(a[prop]>b[prop]));
  }
  NB.updateMyPostList(NB.posts);
}

NB.refreshPosts=()=>{
  NB.getMyPostsFromServer(NB.updateMyPostList);
}

NB.showPost=(post)=>{
  var postDetail=$("#post_detail");
  postDetail.find(".title").text(post.title);
  postDetail.find(".authorId").text(post.authorId);
  postDetail.find(".category").text(post.category);
  postDetail.find(".status").text(post.status);
  postDetail.find(".body").text(post.body);
  postDetail.find(".lastModified").text(new Date(Number(post.lastModified)).toLocaleString("en-US"));
  postDetail.find(".title").text(post.title);
}

NB.handleContactButton=()=>{
  var post=NB.posts[NB.postIndex];
  window.open("mailto:" + post.authorId + "@umbc.edu?subject=Re: NetBuz Post " + post.postId + " -    "
  + encodeURIComponent(post.title), "_blank")
}
//this is the app entry point
$(()=>{
  NB.fieldset=$("#edit_post fieldset");
  var loggedIn=NetBuz.getLoggedInId();
  if(loggedIn){
    NB.updateLoggedInView(true);
  }
  else{
    NB.updateLoggedInView(false);
  }
  NB.getPostsFromServer(NB.updateMyPostList);
  $("#post_table tbody").on("click", "tr", function(event){
    NB.postIndex=$(event.currentTarget).index();
    NB.gotoPostDetailPage(NB.posts[NB.postIndex]);
  });
});
