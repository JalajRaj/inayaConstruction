serverURL = serverURL + "U/"+localStorage.getItem("i_userType")+"/";

function changePassword(obj){
	$("#loadingdiv").show();
	if($("#nPass").val() == ""){
		alert("Please enter valid Password");
		return false;
	}
	if($("#nPass").val() != $("#cpass").val()){
		alert("Password and confirm Password does not match");
		return false;
	}
	$(obj).attr('onclick', "");
	$(obj).html('Please Wait....<i class="fa fa-angle-right" aria-hidden="true"></i>');

	var map = {};
		map["oldpass"] = $("#oldPass").val();
		map["pass"] = $("#nPass").val();
		map["token"]=localStorage.getItem("i_token");
	$.ajax({
			type: 'POST',
			data: JSON.stringify(map),
			url: serverURL+"changePass",
			success: function (response) {	
				alert(response);
				if(! response.startsWith("Sorry")){				
					logout();
				}else{
					$(obj).attr('onclick', "return changePassword(this)");
					$(obj).html('Change Password<i class="fa fa-angle-right" aria-hidden="true"></i>');
				}
			},
			error: function (response) {
				alert("Error while changing Password "+response);
				$(obj).attr('onclick', "return changePassword(this)");
				$(obj).html('Change Password<i class="fa fa-angle-right" aria-hidden="true"></i>');
				checkErrorResp(response);
			}
		});	
}

function fetchmyCartDetails(){
	$("#loadingdiv").show();
		var map = {};
		var val = "";
		$.each(JSON.parse(localStorage.getItem("i_cart")), function(i, j) {		
		   val=val+i+","
		});	
		map["key"] = val.substr(0,val.length-1);
		map["area"] = localStorage.getItem("i_currcart");
		map["token"]=localStorage.getItem("i_token");
	$.ajax({
			type: 'POST',
			data: JSON.stringify(map),
			url: serverURL+"fetchProductDetails",
			success: function (response) {	
				createUserRows(response);
				$("#loadingdiv").hide();
			},
			error: function (response) {
				alert("Error while getting card details "+response);
				checkErrorResp(response);
			}
		});		
}
function createUserRows(response){
	$("#displayTableDetails tbody").empty();
	$(response).each(function(i,obj){
		var tr='<tr><td data-type="number">'+(++i)+'</td><td>'+$(obj).attr('item')+'</td><td>'+$(obj).attr('type')+'</td><td>'+$(obj).attr('brand')+'</td>';
		tr = tr + '<td>'+$(obj).attr('grade')+'</td><td>'+$(obj).attr('unit')+'</td><td>'+$(obj).attr('price')+' Rs.</td><td style="display:none;">'+$(obj).attr('shopName')+'</td>';
		tr = tr+'<td><input type="number" class="cardQty" data-key="'+$(obj).attr('id')+'" style="width:80px" data-id="'+i+'" data-price="'+$(obj).attr('price')+'" onblur="checkFinalPriceBlur(this)" onchange="checkFinalPrice(this)" onkeyup="checkFinalPrice(this)"  value="1" id="qty"></td><td><span class="priceSpan" data-price="'+$(obj).attr('price')+'" id="aprice_'+i+'">'+$(obj).attr('price')+' Rs</span></td><td><input type="button" onclick="return removeToCart(this)" value="Remove" data-val="'+$(obj).attr('id')+'"class="btn btn-primary" /></td></tr>';
		$("#displayTableDetails tbody").append(tr);	
	});
	finalPrice();
}

function removeToCart(obj){
	var map = JSON.parse(localStorage.getItem("i_cart"));
	var res = delete map[$(obj).attr("data-val")]
	if(res){
		alert("Item successfully deleted from Cart");
		localStorage.setItem("i_cart",JSON.stringify(map));	
		$(obj).parent().parent().remove();
		finalPrice();
		return false;
	}else{
		alert("Unable to delete product, Please add product again");
	}
}
function checkFinalPriceBlur(obj){
	if($(obj).val().trim() == ""){
		$(obj).val("1");
	}
	checkFinalPrice(obj);
}
function checkFinalPrice(obj){
	if (!validation.isNumber($(obj).val())) {
		if("" != $(obj).val()){
			alert("Please Enter valid Quantity");
			$(obj).val(1);
			return false;
		}
	}
	
	if(parseInt($(obj).val()) < 1){
		$(obj).val("1");
	}
	var pric = parseFloat($(obj).val()) * parseFloat($(obj).attr("data-price"));
	pric = pric.toFixed(2);
	$("#aprice_"+$(obj).attr("data-id")).html(pric + " Rs").attr('data-price',pric);
	finalPrice();
}
function finalPrice(){
	var finalPrice=0;
	$(".priceSpan").each(function(){
		finalPrice = parseFloat(finalPrice) + parseFloat($(this).attr('data-price'));	
		finalPrice = finalPrice.toFixed(2);		
	});
	$("#finalPrice").html(finalPrice+" Rs");
	$("#MRPfinalTotal").html(finalPrice+" Rs");
	$("#mainTotal").html(finalPrice+" Rs");
	return finalPrice;
}
function applyCoupon(){
	alert("Sorry! No coupan code found");
	return false;
}
var locArea;
function getAllLocation(){
$.ajax({
		type: 'POST',
		data:'{"token":"' + localStorage.getItem("i_token") + '"}',
		url: serverURL + "getLocationDetails",
		success: function (response1) {		
			locArea=response1;
			intiAutoComplete("area",response1);		
		},
		error: function (response) {
			alert("Error while fetching LOC data");
			checkErrorResp(response);
		}
	});
	$("#fname").val(localStorage.getItem("i_username"));
	$("#area").val(localStorage.getItem("i_area"));
	var d = JSON.parse(localStorage.getItem("i_data"));
	$("#mobileNo").val(d["mobileNo"]);
	$("#emailid").val(d["emailID"]);
	$("#address").val(d["address"]);
}
function placeOrder(){
	if(finalPrice() == 0){
		alert("Your Cart is Empty.\nPlease add some items in cart before placing order.");
		location.href="index.html";
		return false;
	}
	if($("#fname").val() == '' ){
		   alert("Please enter your Name.");
		   $("#fname").focus();
		   return false;
	   	}
	$("#area").val($("#area").val().toUpperCase());
	if(locArea.indexOf($("#area").val()) == -1){
		alert("Please select Location from dropdown only, Do not type any other Location");
		return false;
	}
	 	
	if($("#address").val() == '' ){
		alert("Please enter address.");
		$("#address").focus()
	   return false;
	}
	 if($("#mobileNo").val() == '' ){
		alert("Please enter Mobile Number.");
		$("#mobileNo").focus()
	   return false;
	}
	 if($("#mobileNo").val().length != 10 ){
		alert("Please enter 10 digit Mobile Number.");
		$("#mobileNo").focus()
		return false;
	}
		
	$("#popcontent").html("Are you sure you want to place order?");
	$("#lodaingModal").modal('show');
	
}
function closePopup(){
	$("#lodaingModal").modal('hide');
}
function placefinalOrder(){
	$("#footerid").hide();
	$("#popcontent").html("Please wait your order is in progress. Do not close this window.");
	var array = {};
	array["userName"]=$("#fname").val();
	var address = $("#address").val();
	if($("#pincode").val() != ""){
		address=address +", Pincode : "+ $("#pincode").val();
	}
	array["address"]=address;
	array["area"]=$("#area").val();
	array["additionalNote"]=$("#additionalNote").val();
	array["currArea"]=localStorage.getItem("i_currcart");
	array["token"]=localStorage.getItem("i_token");
	var dataVal=""
	$(".cardQty").each(function(){
			dataVal = dataVal+$(this).attr('data-key')+"#"+$(this).val()+",";
	});
	array["dataval"]=dataVal.substr(0,dataVal.length-1);		
	$.ajax({
			  type: 'POST',
			  url: serverURL + "saveOrderData",
			  data:JSON.stringify(array),
			  success: function (response) { 			  
			  response = response + "<br><b>Note:</b> Above information is also send to you, on your EmailID.<br><br>"
					$("#popcontent").html(response);
					$("#footerid").show();
					$("#placeOrder").remove();
					$("#closeButton").attr("onclick","location.href='index.html'");
					localStorage.removeItem("i_cart")
					},
			  error : function (response) { 						
					$('#lodaingModal').modal('hide');
					$("#closeButton").show();					
					alert(response);
					}
			});
}

function checkValidEmailID(val){
	var result = true;
	if(val.indexOf("@") != -1 && val.indexOf(".") != -1){
		result = false;
	}
	return result;
}