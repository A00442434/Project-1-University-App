var SERVER_URL = 'http://dev.cs.smu.ca:8144';

// Validate form details

function formValidation()
{
	var name=$("#Name").val();
	var address=$("#Address").val();
	var phone=$("#Phone").val();
	var flag=0;
	if(name=='')
	{
		alert("Enter the university name");
		$("#Name").focus();
		flag=1;
		return;
	}
	if(address=='')
	{
		alert("Enter the university address");
		$("#Address").focus();
		flag=1;
		return;
	}
	
	if(phone=='')
	{
		alert("Enter the Phone Number");
		$("#Phone").focus();
		flag=1;
		return;
		
	}
	else
	{
		
		var regPhone = new RegExp(/^([1-9][0-9]{2})?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
		if(!(regPhone.test(phone)))
		{
			alert("Enter the correct format of phone number xxx-xxx-xxxx");
			$("#Phone").focus();
			flag=1;
			return;
		}
	}
	if(flag==0)
	{
		return true;
	}
	else
	{
		return false;
	}
}


// Save University details to Mongo
function saveUniDetail()
{
	var validationCheck=formValidation();
	if(validationCheck==1){
		var newObj={
			"Name":$("#Name").val(),
			"Address":$("#Address").val(),
			"PhoneNumber":$("#Phone").val(),	
		};
		$.post(SERVER_URL + "/saveUniDetail",newObj,function (data) 
		{
			alert("Result saved successfully!");
			$("#Name").val('');
			$("#Address").val('');
			$("#Phone").val('');
			$("#Search").val('');
		}).fail(function (error) 
		{
			alert("Failed Response: " +error.responseText);
		});
	}
}


// Delete University details from Mongo
function removeUni()
{
	if($("#Name").val()!='')
	{
		var utyObj = {
			"name": $("#Name").val(),
    };
    $.post(SERVER_URL + '/remove', utyObj,
        function (data) {
            alert(data.n+" record deleted");
			$("#Name").val('');
			$("#Address").val('');
			$("#Phone").val('');
			$("#Search").val('');
        }).fail(function (error) {
            alert(error.responseText);
        });
	}
	else
	{
		alert("Search for a university");
	}
}


// Search University details to Mongo
function findUni()
{
	var uniCollection;
	var utyObj = {"name":$("#Search").val()}
	$.post(SERVER_URL + '/findUni',utyObj,
    function (data) {

         uniCollection = data;

  if (uniCollection == null || uniCollection.length == 0) {           
      alert("No University found"); 
  }
  else {
				var name = uniCollection[0].Name;
				var address = uniCollection[0].Address;
				var phone = uniCollection[0].PhoneNumber;
				$("#Name").val(name);
				$("#Address").val(address);
				$("#Phone").val(phone);
				return;
  }
    }).fail(function (error) {
    alert("Request Failed: "+error.responseText);
});

}

function showRecords()
{
	$("#tblRecords").html(
		"<tr>"+
		"<th>Name</th>"+
		"<th>Address</th>"+
		"<th>Phone</th>"+
		"</tr>"
	);
	var tblRecords = document.getElementById('tblRecords');
	var uniCollection;
	$.post(SERVER_URL + '/showRecords',
    function (data) {

         uniCollection = data;

  if (uniCollection == null || uniCollection.length == 0) {           
      alert("Show record found"); 
  }
  else {
      for (var i = 0; i < uniCollection.length; i++) {
			var name = uniCollection[i].Name,  address = uniCollection[i].Address,
                 phone = uniCollection[i].PhoneNumber;
			var r = tblRecords.insertRow();
			r.insertCell(-1).innerHTML = name;
			r.insertCell(-1).innerHTML = address;
			r.insertCell(-1).innerHTML = phone;
			
        }
  }
    }).fail(function (error) {
    alert(error.responseText);
});

}