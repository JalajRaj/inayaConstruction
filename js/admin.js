serverURL = serverURL + "A/"+localStorage.getItem("i_userType")+"/";
var masterResp;
var lastLocationSend="";
var validation = {
    isNumber:function(str) {
        var pattern = /^\d+$/;
        return pattern.test(str);  // returns a boolean
    }
};
var locArea;
function initAdminEntryInfo(){
	$("#loadingdiv").show();
	var selectbox = '';
	
	$.ajax({
			type: 'POST',
			data:'{"token":"' + localStorage.getItem("i_token") + '"}',
			url: serverURL + "fetchAllMasterConfigInfo",
			success: function (response) {				
				masterResp=response;
				$(masterResp).each(function(i,obj1){
					if($(obj1).attr('item') != 'location'){
						$("#popupselect").append('<option value="'+$(obj1).attr('item')+'">'+$(obj1).attr('item')+'</option>')
					}else if(localStorage.getItem("i_userType") == 'S'){
						locArea = $(obj1).attr('type');
						if(locArea != undefined){
							selectbox='<input id="area" type="text" onchange="return initRegionData()" onClick="this.setSelectionRange(0, this.value.length)" name="q" class="form-control" style="display:inline;width:auto;" />';
						}
					}
				});
				var areaInfo = localStorage.getItem("i_area");
				if(selectbox != ''){
					areaInfo = selectbox;
				}
				$("#userDetails").html("Welcome <b>"+localStorage.getItem("i_username")+"</b>, Area <b>"+areaInfo+"</b>");	
				if(selectbox != ''){	
					locArea=locArea.sort();
					intiAutoComplete("area",locArea);	
					$("#area").val($(locArea)[0])	
				}
				initRegionData();					
			},
			error: function (response) {
				alert("Error while updating data "+response);
				checkErrorResp(response);
			}
		});	
}

function getArea(){
	if($("#area").val() == undefined){
		return localStorage.getItem("i_area");
	}else{
		return $("#area").val();
	}	
}
function initRegionData(){
	
	if($("#area").val() != undefined){
		$("#area").val($("#area").val().toUpperCase());
		if(locArea.indexOf($("#area").val()) == -1){
			alert("Please select Area from dropdown only, Do not type any other Area");
			$("#area").val(lastLocationSend);
			return false;
		}	
	}
	
	var map={};
	lastLocationSend = getArea();
	map["area"]=getArea();
	map["token"]=localStorage.getItem("i_token");	
	$.ajax({
		type: 'POST',
		data:JSON.stringify(map),
		url: serverURL + "getRegionWiseData",
		success: function (response) {
			$("#displayTableDetails tbody").empty();
			console.log(response)
			
			$(response).each(function(i,obj){
				if($(obj).attr('item') != "location"){
					var result = checkAdimUpdateCond(obj);
					generatedynamicRow($(obj).attr('item'),$(obj).attr('id'),result);
					var tdLoop = $('#displayTableDetails tr:last > td');					
					$(tdLoop).eq(2).find('select').val($(obj).attr('type'));
					$(tdLoop).eq(3).find('select').val($(obj).attr('brand'));
					$(tdLoop).eq(4).find('select').val($(obj).attr('grade'));
					$(tdLoop).eq(5).find('select').val($(obj).attr('unit'));
					$(tdLoop).eq(6).find('input').val($(obj).attr('price'));
					if(result){
						$(tdLoop).eq(7).find('input').val($(obj).attr('shopName'));
					}
				}
			});
			
			$("#loadingdiv").hide();
		},
		error: function (response) {
			alert("Error while updating data "+response);
			checkErrorResp(response);
		}
	});	
}
function createSelectBox(data){
	var s="<select>";
	$(data).each(function(){
		s=s+'<option value="'+this+'">'+this+'</option>';
	})
	return s+"</select>";
}
function createNewItem(){
	$("#confirmModal").modal('show');
	
}
function closePopup(){
	$("#confirmModal").modal('hide');
}
function createNewCombination(){
	generatedynamicRow($("#popupselect").val(),"-1",true);
	closePopup();
}
function generatedynamicRow(value,val,result){
	
	$(masterResp).each(function(i,obj1){
		if($(obj1).attr('item') == value){
			var tr='<tr><td>'+($("#displayTableDetails tbody tr").length + 1)+'</td><td>'+$(obj1).attr('item')+'<input type="hidden" name="id" value="'+val+'" /></td>';
			tr =tr + '<td>'+createSelectBox($(obj1).attr('type'))+'</td><td>'+createSelectBox($(obj1).attr('brand'))+'</td>';
			tr=tr + '<td>'+createSelectBox($(obj1).attr('grade'))+'</td><td>'+createSelectBox($(obj1).attr('unit'))+'</td>';
			tr=tr + '<td><input type="text" style="width:70px" name="price" maxlength="7" class="form-control" ></td>';
			if(result){
				tr=tr+'<td><input type="text"  style="width:150px" name="shopname" class="form-control" ></td>';
				tr=tr + '<td><input type="button" class="btn btn-primary" value="Save" onclick="return saveRowVal(this)" /></td><td><input type="button" class="btn btn-primary" value="Delete" onclick="return deleteRowVal(this)" /></td>';
			}else{
				tr=tr+'<td></td><td></td><td></td>';
			}
			tr=tr + '</tr>';
			$("#displayTableDetails tbody").append(tr);	
		}
	});	
}
function checkAdimUpdateCond(obj1){
	if($(obj1).attr('mobileNo') == null || $(obj1).attr('mobileNo') ==localStorage.getItem("i_token").substr(10) || localStorage.getItem("i_userType") == 'S' ){
		return true;
	}
	return false;
}
function deleteRowVal(obj){
	if(confirm("Are you sure you want to delete this row ?")){
		$(obj).attr('disabled', true);
		$(obj).val('Please Wait..');
		var map = {};
		map["id"]=$(obj).parent().parent().find('td').eq(1).find('input').val();
		map["area"]=getArea();
		map["token"]=localStorage.getItem("i_token");
		$.ajax({
			type: 'POST',
			url: serverURL + "deleteRegionWiseRecord",
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
function saveRowVal(obj){
	var map={};
	var par = $(obj).parent().parent().find('td');
	map["area"]=getArea();
	map["id"]=par.eq(1).find('input').val();
	map["item"]=par.eq(1).html().substr(0,par.eq(1).html().indexOf("<"));
	map["type"]=par.eq(2).find('select').val();
	map["brand"]=par.eq(3).find('select').val();
	map["grade"]=par.eq(4).find('select').val();
	map["unit"]=par.eq(5).find('select').val();
	map["price"]=par.eq(6).find('input').val();
	map["shopName"]=par.eq(7).find('input').val();
	map["token"]=localStorage.getItem("i_token");
	if (!validation.isDecimal(map['price'])) {
		alert("Please Enter valid Price");
		return false;
	}
	if ("" == map['shopName']) {
		alert("Please Enter valid Shop Name");
		return false;
	}
	var found = false;
	$("#displayTableDetails tbody tr").each(function(i,obj){
		if($(obj).find('td').eq(0).html() != par.eq(0).html()){
			if($(obj).find('td').eq(1).html().substr(0,par.eq(1).html().indexOf("<")) == map["item"]
			&& $(obj).find('td').eq(2).find('select').val() == map["type"]
			&& $(obj).find('td').eq(3).find('select').val() == map["brand"]
			&& $(obj).find('td').eq(4).find('select').val() == map["grade"]			
			&& $(obj).find('td').eq(5).find('select').val() == map["unit"]
			&& ($(obj).find('td').eq(7).find('input').val() != undefined && $(obj).find('td').eq(7).find('input').val().toUpperCase() == map["shopName"].toUpperCase())){
				alert("Sorry could save this result.\nThis combination already exists at row no "+$(obj).find('td').eq(0).html());
				found=true;
			}
		}
	});
	
	if(!found){
		if(confirm("Are you sure you want to save this details ?")){
			$(obj).attr('disabled', true);
			$(obj).val('Please Wait..');
			$.ajax({
				type: 'POST',
				data:JSON.stringify(map),
				url: serverURL + "saveRegionWiseRecord",
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
}

function initAdminProfile(){
	var data = JSON.parse(localStorage.getItem('i_data'));
	$("#mobileNo").val($(data).attr('mobileNo'));
	if($(data).attr('userName') != null){	
		location.href="admin-entry.html";
	}
}
function completeAdminProfile(obj){
	if($("#username").val() == ""){
		alert("Please enter valid User Name");
		return false;
	}
	if($("#address").val() == ""){
		alert("Please enter valid Address");
		return false;
	}
	var data = JSON.parse(localStorage.getItem('i_data'));
	$(obj).attr('onclick', "");
	$(obj).html('Please Wait....<i class="fa fa-angle-right" aria-hidden="true"></i>');
	var map = {};
		map["mobileNo"] = $(data).attr('mobileNo');
		map["userName"] = $("#username").val();
		map["token"]=localStorage.getItem("i_token");
		map["address"] = $("#address").val();
	$.ajax({
			type: 'POST',
			data: JSON.stringify(map),
			url: serverURL + "saveProfile",
			success: function (response) {	
				if("object" == typeof response){
					alert("User Profile created successfully");	
					localStorage.setItem("i_username",$(response).attr('userName'));
					localStorage.setItem("i_area",$(response).attr('area'));
					localStorage.setItem("i_userType",$(response).attr('userType'))
					location.href="admin-entry.html";
				}else{
					alert(response)
				}
			},
			error: function (response) {
				alert("Error while Login "+response);
				checkErrorResp(response);
				location.reload();
			}
		});		
}
function fetchAllTransaction(){
	$("#loadingdiv").show();
	$.ajax({
		type: 'POST',
		data:'{"token":"' + localStorage.getItem("i_token") + '"}',
		url: serverURL + "getAllTransactionResionWise",
		success: function (response1) {
			$(response1).each(function(i,obj){
				var add = $(obj).attr('address') + ", Area: "+$(obj).attr('area');
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
				$("#displayTableDetails tbody").append('<tr><td style="'+color+'"  data-type="number">'+(++i)+'</td><td style="'+color+'">'+$(obj).attr('orderid')+'<br>'+$(obj).attr('userName')+'</td><td style="'+color+'">'+$(obj).attr('mobileNo')+'<br>'+$(obj).attr('emailID')+'</td><td style="'+color+'">'+add+'</td><td style="'+color+'">'+ordStatus+'</td><td style="'+color+'">'+orderStatusSelect(i,$(obj).attr('orderid'))+'</td><td style="'+color+'">'+$(obj).attr('transDate')+'</td><td style="'+color+'"><input type="button" value="More" onclick="return showTransDetails(this)" data-val="'+$(obj).attr("orderDetails")+'" class="btn btn-primary"></td></tr>');
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
			url: serverURL + "updateOrderStatus",
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
function closeAdminPopup(){
	$("#lodaingModal").modal('hide');
}