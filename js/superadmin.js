serverURL = serverURL + "S/"+localStorage.getItem("i_userType")+"/";

function saveLocation(obj){
	var item = $(obj).parent().parent().find('#addText').val();
	if(item == ""){
		alert("Please enter Location Name");
		return false;
	}
	if(item.indexOf(" ")!= -1){
		alert("Sorry space is not allowed");
		return false;
	}
	if(confirm("Are you sure you want to add new location.")){
		$(obj).attr('disabled', true);
		$(obj).val('Please Wait..');
		var map = {};
		map["item"] = item;
		map["token"]=localStorage.getItem("i_token");
		$.ajax({
			type: 'POST',
			url: serverURL + "createNewLocation",
			data: JSON.stringify(map),
			success: function (response) {
				alert(response);
				addValues(obj,2);
				$(obj).attr('disabled', false);
				$(obj).val('Save Location');
			},
			error: function (response) {
				alert("Error while Adding location"+response);
				checkErrorResp(response);
				$(obj).attr('disabled', false);
				$(obj).val('Save Location');
			}
		});
	}
}
function createDynamicDropDown(){
	return '<div class="input-group" >'+
				'<input type="text" id="addText" class="form-control">&nbsp;&nbsp;&nbsp;'+
				'<div class="input-group-btn">'+
				  '<button tabindex="-1" class="btn btn-primary" onclick="return addValues(this,1)" type="button">Add</button>'+
				  '<button tabindex="-1" data-toggle="dropdown"'+
					  'class="btn btn-primary dropdown-toggle" type="button">'+
					'<span class="caret"></span>'+
					'<span class="sr-only">Toggle Dropdown</span>'+
				  '</button>'+
				  '<ul class="dropdown-menu pull-right"></ul>'+
				'</div>'+
			'</div>';
}
function addValues(obj,r){
	 $dd = $(obj).parent().find('ul');
	 $text=$(obj).parent().parent().find('#addText');
	 if ($text.val() != '' &&
          $dd.find('li a:contains(' + $text.val() + ')').length < 1) {
        $dd.append($('<li>')
			.append($('<a href="javascript:void(0);">').text($text.val())
			 .append($('<span onclick="return removeValue(this)">').addClass('rem'))));
			 
	  }
      $text.val('');
	return false;	  
}
function removeValue(obj){
	 $(obj).closest('li').remove();
	  return false;
}
function createNewMaterial(item){	
	var tr='<tr><td>'+($("#displayTableDetails tbody tr").length + 1)+'<td>'+item+'</td><td data-value="type">'+createDynamicDropDown()+'</td><td data-value="brand">'+createDynamicDropDown()+'</td><td data-value="grade">'+createDynamicDropDown()+'</td><td data-value="unit">'+createDynamicDropDown()+'</td><td><input type="button" class="btn btn-primary" value="Save" onclick="return saveRowVal(this)" /></td><td><input type="button" class="btn btn-primary" value="Delete" data-value="'+item+'" onclick="return deleteRowVal(this)" /></td></tr>';
	$("#displayTableDetails tbody").append(tr);	
}
function deleteRowVal(obj){
	if(confirm("Are you sure you want to delete "+$(obj).attr('data-value')+" ?")){
		$(obj).attr('disabled', true);
		$(obj).val('Please Wait..');
		var map = {};
		map["item"] = $(obj).attr('data-value');
		map["token"]=localStorage.getItem("i_token");
		$.ajax({
			type: 'POST',
			url: serverURL + "deleteMaterial",
			data: JSON.stringify(map),
			success: function (response) {
				alert(response);
				$(obj).attr('disabled', false);
				$(obj).val('Save');
				location.reload();
			},
			error: function (response) {
				alert("Error while Deleting "+response);
				$(obj).attr('disabled', false);
				$(obj).val('Save');
				checkErrorResp(response);
			}
		});
	}	
}
function deleteLocation(obj){
	if(confirm("Are you sure you want to delete location "+$(obj).attr('data-value')+" ?")){
		$(obj).attr('disabled', true);
		$(obj).val('Please Wait..');
		var map = {};
		map["location"] = $(obj).attr('data-value');
		map["token"]=localStorage.getItem("i_token");
		$.ajax({
			type: 'POST',
			url: serverURL + "deleteLocation",
			data: JSON.stringify(map),
			success: function (response) {
				alert(response);
				$(obj).attr('disabled', false);
				$(obj).val('Save Location');
				location.reload();
			},
			error: function (response) {
				alert("Error while Deleting "+response);
				$(obj).attr('disabled', false);
				$(obj).val('Save Location');
				checkErrorResp(response);
			}
		});
	}	
}
function createNewItem(){
  var item = prompt("Please enter Item Name");
  if (item != null) {
	  var found=false;
	$('#displayTableDetails tbody tr').each(function(i,obj){
		if($(obj).find('td').eq(1).html() == item.toUpperCase()){
			alert("Data for "+item+" already exists for row no "+(++i));
			found = true;
		}		
	});
	if(! found){
		createNewMaterial(item);
	}
  }
  return false;
}
function saveRowVal(obj){
	if(confirm("Are you sure you want to Save details.")){
	var map={};
	map["token"]=localStorage.getItem("i_token");
	for(i=2;i<=5;i++){
		var key = $(obj).parent().parent().find('td').eq(i).attr('data-value');
		var myLoop = $(obj).parent().parent().find('td').eq(i).find('li');
		var val= "";
		$(myLoop).each(function(){
			val = val + $(this).find('a').html().substr(0,$(this).find('a').html().indexOf("<")) + "#";
		});
		if(val == ""){
			alert("Please enter some value to "+key+" field.");
			return false;
		}
		map[key]=val.substr(0,val.length-1);
		
	}
	map["item"]=$(obj).parent().parent().find('td').eq(1).html();
	$(obj).attr('disabled', true);
	$(obj).val('Please Wait..');
	$.ajax({
			type: 'POST',
			data:JSON.stringify(map),
			url: serverURL + "createNewMaterial",
			success: function (response) {
				alert(response);	
				$(obj).attr('disabled', false);
				$(obj).val('Save');				
			},
			error: function (response) {
				alert("Error while updating data "+response);
				$(obj).attr('disabled', false);
				$(obj).val('Save');	
				checkErrorResp(response);
			}
		});
	}
}

function initMasterConfig(){
	$("#loadingdiv").show();
	$.ajax({
		type: 'POST',
		data:'{"token":"' + localStorage.getItem("i_token") + '"}',
		url: serverURL + "fetchAllMasterConfigInfo",
		success: function (response1) {
			$(response1).each(function(i,obj1){					
				if($(obj1).attr("item") == 'location'){
					var obj3 = $(obj1).attr('type');
						if(obj3 != undefined){
							obj3=obj3.sort();
							$(obj3).each(function(k,obj4){
								$("#locations").append('<li><a href="javascript:void(0);">'+obj4+ '<span data-value="'+obj4+'" onclick="return deleteLocation(this)" class="rem" ></span></a></li>');
							})
						}
				}else{
					createNewMaterial($(obj1).attr("item"));
					var tdLoop = $('#displayTableDetails tr:last > td');
					$(tdLoop).each(function(j,obj2){
						var obj3 = obj1[$(obj2).attr("data-value")];
						if(obj3 != undefined){
							$(obj3).each(function(k,obj4){
								$(obj2).find('ul').append('<li><a href="javascript:void(0);">'+obj4+ '<span onclick="return removeValue(this)" class="rem" ></span></a></li>');
							})
						}
					});
				}
			});	
		$("#loadingdiv").hide();			
		},
		error: function (response) {
			alert("Error while updating data");
			checkErrorResp(response);
		}
	});	
}

var lastLocationSend="";
function createAdminUser(obj){
	if($("#mobileNo").val() == "" || $("#mobileNo").val().length !=10){
		alert("Please enter valid Mobile No");
		return false;
	}
	if($("#area").val() == ""){
		alert("Please enter valid Area");
		return false;
	}
	$("#area").val($("#area").val().toUpperCase());
	if(locArea.indexOf($("#area").val()) == -1){
		alert("Please select Area from dropdown only, Do not type any other Area");
		$("#area").val(lastLocationSend);
		return false;
	}	
	if($("#emailid").val() == ""){
		alert("Please enter valid Email ID");
		return false;
	}
	if(confirm("Are you sure you want to create new Admin User ?")){
		$(obj).attr('onclick', "");
		$(obj).html('Please Wait....<i class="fa fa-angle-right" aria-hidden="true"></i>');
		lastLocationSend=$("#area").val();
		var map = {};
		map["mobileNo"] = $("#mobileNo").val();
		map["area"] = $("#area").val();
		map["emailid"] = $("#emailid").val().trim();
		map["token"]=localStorage.getItem("i_token");
		$.ajax({
			type: 'POST',
			url: serverURL + "createNewAdminUser",
			data: JSON.stringify(map),
			success: function (response) {
				alert(response);
				location.reload();
			},
			error: function (response) {
				alert("Error unable to create Admin User "+response);
				checkErrorResp(response);
				location.reload();
			}
		});
	}
return false;	
}
var locArea;
function fetchAllLocInfo(){
	$.ajax({
		type: 'POST',
		data:'{"token":"' + localStorage.getItem("i_token") + '"}',
		url: serverURL + "fetchAllMasterConfigInfo",
		success: function (response1) {
			$(response1).each(function(i,obj){
				if($(obj).attr("item") == 'location'){
					var obj3 = $(obj).attr('type');
						if(obj3 != undefined){
							intiAutoComplete("area",obj3);	
							locArea=obj3;
						}
				}	
			});			
		},
		error: function (response) {
			alert("Error while fetching LOC data");
			checkErrorResp(response);
		}
	});
}
function fetchAllAdminUser(){
	$.ajax({
		type: 'POST',
		data:'{"token":"' + localStorage.getItem("i_token") + '"}',
		url: serverURL + "getAllAdminUser",
		success: function (response1) {
			$(response1).each(function(i,obj){
				var name = $(obj).attr('userName') == null ? "(User not signin)" : $(obj).attr('userName');
				var add = $(obj).attr('address') == null ? "(User not signin)" : $(obj).attr('address');
				$("#displayTableDetails tbody").append('<tr><td data-type="number">'+(++i)+'</td><td>'+name+'</td><td>'+$(obj).attr('mobileNo')+'</td><td>'+$(obj).attr('emailID')+'</td><td>'+$(obj).attr('area')+'</td><td>'+add+'</td><td><input type="button" class="btn btn-primary" data-mobile="'+$(obj).attr('mobileNo')+'" value="Delete" onClick="return deleteAdmin(this)" /> </tr>');
			})
		},
		error: function (response) {
			alert("Error while fetching LOC data");
			checkErrorResp(response);
		}
	});
}
function deleteAdmin(obj){
	if(confirm("Are you sure you want to delete this Admin User ?")){
		$(obj).attr('onclick', "");
		$(obj).html('Please Wait....<i class="fa fa-angle-right" aria-hidden="true"></i>');
		var map = {};
		map["mobileNo"] = $(obj).attr('data-mobile');
		map["token"]=localStorage.getItem("i_token");
		$.ajax({
			type: 'POST',
			url: serverURL + "deleteAdmin",
			data: JSON.stringify(map),
			success: function (response) {
				alert(response);
				location.reload();
			},
			error: function (response) {
				alert("Error unable to deleting Admin User "+response);
				checkErrorResp(response);
				location.reload();
			}
		});
	}
return false;
	
}

function fetchAllTransaction(){
	$("#loadingdiv").show();
	$.ajax({
		type: 'POST',
		data:'{"token":"' + localStorage.getItem("i_token") + '"}',
		url: serverURL + "getAllTransaction",
		success: function (response1) {
			$(response1).each(function(i,obj){
				var add = $(obj).attr('address') + ", Area: "+$(obj).attr('area')
				var color="";
				if("Delivered" == $(obj).attr('orderStatus')){
					color = "background-color: lightgreen;";
				}
				if("OrderPlaced" == $(obj).attr('orderStatus')){
					color = "background-color: yellow;";
				}
				if("In-Progress" == $(obj).attr('orderStatus')){
					color = "background-color: lightskyblue;";
				}
				if("ItemNotAvailabel" == $(obj).attr('orderStatus') || "FakeOrder" == $(obj).attr('orderStatus')){
					color = "background-color: lightcoral;";
				}
				if("CustomerNotReachable" == $(obj).attr('orderStatus')){
					color = "background-color: lightcoral;";
				}
				if("DuplicateOrder" == $(obj).attr('orderStatus') || "CustomerCancelOrder" == $(obj).attr('orderStatus') ){
					color = "background-color: lightpink;";
				}
				var ordStatus=$(obj).attr('addNotes');
				if($(obj).attr('addNotes') == null){
					ordStatus="";
				}
				var emailid=$(obj).attr('emailID');
				if(emailid == null){
					emailid="";
				}
				var areaval = "Delivery Area: "+$(obj).attr('area')+"<br>Order Area: "+$(obj).attr('orderArea');
				$("#displayTableDetails tbody").append('<tr><td style="'+color+'" data-type="number">'+(++i)+'</td><td style="'+color+'">'+$(obj).attr('orderid')+'<br>'+$(obj).attr('userName')+'</td><td style="'+color+'">'+areaval+'</td><td style="'+color+'">'+$(obj).attr('mobileNo')+'<br>'+emailid+'</td><td style="'+color+'">'+add+'</td><td style="'+color+'">'+ordStatus+'</td><td style="'+color+'">'+orderStatusSelect(i,$(obj).attr('orderid'))+'</td><td style="'+color+'">'+$(obj).attr('transDate')+'</td><td style="'+color+'"><input type="button" value="More" onclick="return showTransDetails(this)" data-val="'+$(obj).attr("orderDetails")+'" class="btn btn-primary"></td></tr>');
				$("#order_"+i).val($(obj).attr('orderStatus'));
			})
			$("#loadingdiv").hide();
		},
		error: function (response) {
			alert("Error while fetching Trans data");
			checkErrorResp(response);
		}
	});
}
function orderStatusSelect(i,id){
	var sel =  '<select id="order_'+i+'" style="width:130px"><option value="OrderPlaced">OrderPlaced</option><option value="In-Progress">In-Progress</option><option value="Delivered">Delivered</option><option value="CustomerNotReachable">CustomerNotReachable</option><option value="FakeOrder">FakeOrder</option><option value="DuplicateOrder">DuplicateOrder</option><option value="CustomerCancelOrder">CustomerCancelOrder</option><option value="ItemNotAvailabel">ItemNotAvailabel</option></select>';
	sel = sel + '<br><input type="button" class="btn btn-primary" value="Update Order" data-id="'+id+'" onclick="updateOrderStatus('+i+',this)" />';
	return sel;
}
function updateOrderStatus(i,obj){
	$(obj).attr('onclick', "");
	$(obj).attr('value','Please Wait....');
	var map = {};
		map["status"] = $("#order_"+i).val();
		map["id"] = $(obj).attr("data-id");
		map["token"]=localStorage.getItem("i_token");
	$.ajax({
			type: 'POST',
			data: JSON.stringify(map),
			url: serverURL.substr(0,60)+"A/S/updateOrderStatus",
			success: function (response) {	
				alert(response);
				location.reload();
			},
			error: function (response) {
				alert("Error "+response);
				checkErrorResp(response);
				location.reload();
			}
		});		
}
function showTransDetails(obj){
	$("#lodaingModal").modal('show');
	$("#popcontent").html("<style type='text/css'>table {border-collapse: collapse;border-spacing: 0;width: 100%;border: 1px solid #ddd;}th, td {text-align: left;padding: 8px;}tr:nth-child(even){background-color: #f2f2f2}</style><div style='overflow-x:auto;'>"+$(obj).attr("data-val")+"</div>");	
}
function closePopup(){
	$("#lodaingModal").modal('hide');
}
function saveNotesInfo(obj){
	$(obj).attr('value', "Please wait..");
	$(obj).attr('disabled',true);
	var map = {};
	map["omsg"] = $("#offerNotes").val();
	map["smsg"] = $("#contactNotes").val();
	map["token"]=localStorage.getItem("i_token");
	$.ajax({
		type: 'POST',
		url: serverURL + "updateNotes",
		data: JSON.stringify(map),
		success: function (response) {
			alert(response);
			$(obj).attr('value', "Save Notes");
			$(obj).attr('disabled',false);
		},
		error: function (response) {
			alert("Error unable to deleting Admin User "+response);
			checkErrorResp(response);
			
		}
	});	
return false;
}
function initOfferNotes(){
	$.ajax({
		type: 'POST',
		url: serverURL.substr(0,60)+"C/C/getofferNote",
		success: function (response) {	
			$("#offerNotes").val($(response)[0]);
			$("#contactNotes").val($(response)[1]);				
		},
		error: function (response) {
		}
	});
}