function validate()
{
	var password1 = document.getElementById("password").value;
	var username = document.getElementById("username").value;
	
	if(!username || !password1)
	{
		alert("No input enter");
		return false;
	}
	return true;
	
}