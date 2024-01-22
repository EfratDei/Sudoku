function checkDetails()
{
    let name1=document.getElementById("userName").value;
    let password=document.getElementById("password").value;
    if(name1!="abcd"){
   let errorName=document.getElementById("eName").innerHTML="The entered value is incorrect. Please try again";
   return false;
    }
    if(password!="1234")
    {
        let errorPasword=document.getElementById("epassword").innerHTML="The entered value is incorrect. Please try again";
        return false;
   }
 
   return true;
}