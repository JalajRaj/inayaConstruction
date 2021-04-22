serverURL = serverURL + "C/C/";

function checkLogin(obj){
	if($("#mobileNo").val() == "" || $("#mobileNo").val().length !=10){
		alert("Please enter valid Mobile No");
		return false;
	}
	if($("#password").val() == ""){
		alert("Please enter valid Password");
		return false;
	}
	$(obj).attr('onclick', "");
	$(obj).html('Please Wait....<i class="fa fa-angle-right" aria-hidden="true"></i>');
	var map = {};
		map["mobileNo"] = $("#mobileNo").val();
		map["pass"] = $("#password").val();
	$.ajax({
			type: 'POST',
			data: JSON.stringify(map),
			url: serverURL + "checkUserLogin",
			success: function (response) {	
				if("string" == typeof response){
					alert(response);
					$(obj).attr('onclick', "return checkLogin(this)");
					$(obj).html('Login<i class="fa fa-angle-right" aria-hidden="true"></i>');
					
				}else{
					localStorage.setItem("i_token",$(response).attr('loginToken'));
					localStorage.setItem('i_data',JSON.stringify(response));
					localStorage.setItem("i_userType",$(response).attr('userType'))
					localStorage.setItem("i_area",$(response).attr('area'))
					if($(response).attr('userName') == null){
						var str = "Welcome Admin User with Mobile No. "+$(response).attr('mobileNo')+"\nYour Account has been created with us.\nOne more step to access your dashboard\nYou will be redirect to enter your profile details";
						alert(str);
						location.href="admin-completeprofile.html";
					}else{
						localStorage.setItem("i_username",$(response).attr('userName'));
						if($(response).attr('userType') == 'A'){
							location.href="admin-entry.html";
						}if($(response).attr('userType') == 'S'){
							location.href="superadmin-entry.html";
						}if($(response).attr('userType') == 'U'){
							location.href="index.html";
						}						
					}
				}
			},
			error: function (response) {
				alert("Error while Login "+response);
				location.reload();
			}
		});	
}
var locArea;
function getAllLocation(){
$.ajax({
		type: 'POST',
		url: serverURL + "getLocationDetails",
		success: function (choices) {	
			locArea=choices;
			intiAutoComplete("area",choices);
		},
		error: function (response) {
			alert("Error while fetching LOC data");
		}
	});
}
function checkSignUpLogin(obj){
	if($("#mobileNo").val() == "" || $("#mobileNo").val().length !=10){
		alert("Please enter valid Mobile No");
		return false;
	}
	if($("#username").val() == ""){
		alert("Please enter valid username");
		return false;
	}
	if($("#area").val() == ""){
		alert("Please enter valid Current Area");
		return false;
	}
	$("#area").val($("#area").val().toUpperCase());
	if(locArea.indexOf($("#area").val()) == -1){
		alert("Please select Current Area from dropdown only, Do not type any other Area");
		return false;
	}
	if($("#pass").val() == ""){
		alert("Please enter valid Password");
		return false;
	}
	if($("#cpass").val() == ""){
		alert("Please enter valid Confirm Password");
		return false;
	}
	if($("#pass").val() != $("#cpass").val()){
		alert("Password and confirm Password does not match");
		return false;
	}
	$(obj).attr('onclick', "");
	$(obj).html('Please Wait....<i class="fa fa-angle-right" aria-hidden="true"></i>');
	var map = {};
		map["mobileNo"] = $("#mobileNo").val().trim();
		map["username"] = $("#username").val().trim();
		map["emailid"] = $("#emailid").val().trim();
		map["address"] = $("#address").val().trim();
		map["pass"] = $("#pass").val().trim();
		map["area"] = $("#area").val().trim();
	$.ajax({
			type: 'POST',
			data: JSON.stringify(map),
			url: serverURL + "createUser",
			success: function (response) {	
				if("string" == typeof response){
					alert(response);	
					location.href="login.html"
				}
			},
			error: function (response) {
				alert("Error while signup "+response);
				location.reload();
			}
		});
}



function initUserEntryData(){
	$("#loadingdiv").show();
	$.ajax({
			type: 'POST',
			url: serverURL + "getLocationDetails",
			success: function (response) {	
				locArea=response;
				if(localStorage.getItem("i_area") == null){
					$("#locationVal").val($(response)[0]);
				}else{
					$("#locationVal").val(localStorage.getItem("i_area"));
				}
				intiAutoComplete("locationVal",response);					
				getRatesValues("1");		
			},
			error: function (response) {
				alert("Error while updating data "+response);
			}
		});	
}
var lastLocationSend="";
function getRatesValues(val){
	
	$("#locationVal").val($("#locationVal").val().toUpperCase());
	if(locArea.indexOf($("#locationVal").val()) == -1){
		alert("Please select Location from dropdown only, Do not type any other Location");
		$("#locationVal").val(lastLocationSend);
		return false;
	}	
	
	$("#loadingdiv").show();
	if(val != "1"){
		alert("You can only add value in Cart from One location.\nBy changing location your Cart values will be removed.");
		localStorage.removeItem("i_cart");
	}
	localStorage.setItem("i_currcart",$("#locationVal").val());
	var map={};
	lastLocationSend = $("#locationVal").val();
	map["area"]=$("#locationVal").val();
	$("#displayTableDetails tbody").empty();	
	$.ajax({
			type: 'POST',
			data:JSON.stringify(map),
			url: serverURL + "getRegionWiseData",
			success: function (response) {	
				$("#recordDisplaylabal").html('Display Records for '+$("#locationVal").val()+' location.Type here to filter records')
				createUserRows(response,$("#locationVal").val());
				$("#loadingdiv").hide();				
			},
			error: function (response) {
				alert("Error while updating data "+response);
			}
		});	
}
function createUserRows(response,loc){
	if(response.length == 0){
		$("#displayTableDetails tbody").append("<tr><td colspan='8' style='color:red;text-align: center;'>Sorry! No Data available for <b>"+loc+"</b> location. Please try other location");	
	}
	$(response).each(function(i,obj){
		var tr='<tr><td data-type="number" >'+(++i)+'</td><td>'+$(obj).attr('item')+'</td><td>'+$(obj).attr('type')+'</td><td>'+$(obj).attr('brand')+'</td><td>'+$(obj).attr('grade')+'</td><td>'+$(obj).attr('unit')+'</td><td>'+$(obj).attr('price')+' Rs.</td><td style="display:none;">'+$(obj).attr('shopName')+'</td><td><input type="button" onclick="return addToCart(this)" value="Add to Cart" data-val="'+$(obj).attr('id')+'"class="btn btn-primary" /></td></tr>';
		$("#displayTableDetails tbody").append(tr);	
	})
}
function forgetPass(obj){
	$("#loadingdiv").show();
	if($("#mobileno").val() == ""){
		alert("Please enter valid Mobile No");
		return false;
	}
	$(obj).attr('onclick', "");
	$(obj).html('Please Wait....<i class="fa fa-angle-right" aria-hidden="true"></i>');

	var map = {};
		map["mobileNo"] = $("#mobileno").val();
	$.ajax({
			type: 'POST',
			data: JSON.stringify(map),
			url: serverURL + "forgetPass",
			success: function (response) {	
				alert(response);
				location.reload();
			},
			error: function (response) {
				alert("Error "+response);
			}
		});	
}
function addToCart(obj){
	if(localStorage.getItem("i_username") == null){
		alert("Sorry! Please login first before adding product to Cart");
		location.href="login.html";
		return false;
	}
	var map = JSON.parse(localStorage.getItem("i_cart"));
	if(map == null){
		map={};
	}
	if(map[$(obj).attr("data-val")] == "Y"){
		alert("Sorry Product already added to cart");
		return false;
	}
	map[$(obj).attr("data-val")]="Y";	
	localStorage.setItem("i_cart",JSON.stringify(map));	
	alert("Product successfully added to Cart");
	return false;
}
function initOfferNotes(){
	$.ajax({
		type: 'POST',
		url: serverURL + "getofferNote",
		success: function (response) {	
			$("#offerNotes").html("<p>"+$(response)[0]+"</<p>");
			$("#contactNotes").html("<p>"+$(response)[1]+"</p>");				
		},
		error: function (response) {
		}
	});
}