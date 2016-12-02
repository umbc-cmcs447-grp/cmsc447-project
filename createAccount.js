
function validate()
{

    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    //var email = document.getElementById("email").value;
    var userid = document.getElementById("username").value;
    var password1 = document.getElementById("password").value;
    var repassword = document.getElementById("repassword").value;


    var pattern1 = /^[A-z]+$/;  //firstname and lastname
    //var pattern2 = /^[A-Z]+[0-9]*\@umbc.edu$/i;     //email
    var pattern3   = /^.{10,64}$/i;   //password
		//var pattern4 = /^[A-z]+[0-9]*$/i;	//username
    var pattern4 = /^[A-z]{2}[0-9]{5}$/i;	//id


    var result1 = pattern1.test(firstname); //check firstname
    var result2 = pattern1.test(lastname);  //check lastname
    //var result3 = pattern2.test(email);    //check email
    var result4 = pattern3.test(password1);   //check password
    var result5 = pattern3.test(repassword);//check re-password
	  var result6 = pattern4.test(userid);	//check userid


    if(result1 == false)
        {
            alert("first name is not valid");

            return false;
        }

    if(result2 == false)
        {
            alert("last name is not valid");
            return false;
        }

    /*if(result3 == false)
        {
            alert("email is not valid");
            return false;
        }*/

	if(result6 == false)
        {
            alert("UMBC ID is not valid");

            return false;
        }

    if(result4 == false)
        {
            alert("Password must be at least 10 characters.");
            return false;
        }
    if(result5 == false)
        {
            alert("re-password is not valid");
            return false;
        }
        else if(password1 != repassword)
        {
            alert("password missmatch");
            return false;
        }
    createUser(firstname, lastname, userid, password1);
   return true;
}

function createUser(firstname, lastname, userid, password1)
{
    var fieldset=document.getElementById("form_fieldset");
    var newUser = new NetBuz.NewUser(userid, firstname, lastname, password1);

    fieldset.disabled=true;

    function success()
    {
        $("#logged_in_message").text("Account created.");
        updateLoggedInView(true);
    }

    function failure(xhr){
      if(xhr.status===403){
        alert("This UMBC ID has already been registered.");
      }
      else if(xhr.status===422){
        alert("Password does not meet the minimum strength criteria.");
      }
      else{
        alert("Failed. "+xhr.statusText);
      }
      fieldset.disabled=false;
    }
    NetBuz.createUser(newUser,success,failure);
}

function updateLoggedInView(isLoggedIn){
	if(isLoggedIn){
		$(".show-when-logged-in").show();
		$(".show-when-logged-out").hide();
	}
	else{
		$(".show-when-logged-in").hide();
		$(".show-when-logged-out").show();
	}
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
