
function validate()
{
	
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var password1 = document.getElementById("password").value;
    var repassword = document.getElementById("repassword").value;
    
	
    var pattern1 = /^[A-z]+$/;  //firstname and lastname
    var pattern2 = /^[A-Z]+[0-9]*\@umbc.edu$/i;     //email
    var pattern3   = /^[A-z]+[0-9]*[^0-9a-z]*$/i;   //password
	var pattern4 = /^[A-z]+[0-9]*$/i;	//username
        
		
    var result1 = pattern1.test(firstname); //check firstname
    var result2 = pattern1.test(lastname);  //check lastname
    var result3 = pattern2.test(email);    //check email
    var result4 = pattern3.test(password1);   //check password
    var result5 = pattern3.test(repassword);//check re-password
	var result6 = pattern4.test(username);	//check username
	
	
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
    
    if(result3 == false)
        {
            alert("email is not valid");
            return false;
        }
		
	if(result6 == false)
        {
            alert("username is not valid");
			
            return false;
        }
		
    if(result4 == false)
        {
            alert("password is not valid");
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
        createUser(firstname, lastname, username, password1);
   return true;
}

function createUser(firstname, lastname, username, password1)
{
    var newUser = {id: username , password: password1, firstname:firstname, lastname:firstname};

    function success()
    {
        //NetBuz.login(username, password);
        alert("account created");

    }

    function failure(){
    	alert("failed");
    }
    NetBuz.createUser(newUser,success,failure);
}