"use strict";
const updateLoggedInView=(loggedInID)=>{
	if(loggedInID){
		$("#logged_in_message").html("You are logged in as <b>"+loggedInID+"</b>.");
		$(".show-when-logged-in").show();
		$(".show-when-logged-out").hide();
	}
	else{
		$(".show-when-logged-in").hide();
		$(".show-when-logged-out").show();
	}
}

const handleLogin=()=>{
	var password = document.getElementById("password").value;
	var userID = document.getElementById("user_id").value;
	var fieldset=document.getElementById("form_fieldset");

	if(!userID || !password)
	{
		alert("No input enter");
		return false;
	}
	fieldset.disabled=true;
	NetBuz.login(userID, password,
		()=>{
			var loggedInID=NetBuz.getLoggedInId();
			updateLoggedInView(loggedInID);
		},
		(xhr)=>{
			if(xhr.status===401){
				alert("Incorrect ID or Password.");
			}else{
				alert("An error occurred. You are not logged in.");
			}
			fieldset.disabled=false;
		}
	);
	return false;
}

//entry point
$(()=>{
	var loggedInID=NetBuz.getLoggedInId();
	updateLoggedInView(loggedInID);
});
