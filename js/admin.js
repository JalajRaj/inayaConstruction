serverURL = serverURL + "A/"+localStorage.getItem("i_userType")+"/";
var masterResp;
var validation = {
    isNumber:function(str) {
        var pattern = /^\d+$/;
        return pattern.test(str);  // returns a boolean
    }
};
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
						var obj3 = $(response).attr('type');
						if(obj3 != undefined){
							selectbox="<select id='area' onchange='return initRegionData()'>"
							$(obj3).each(function(k,obj4){
								selectbox = selectbox + '<option value="'+obj4+'">'+obj4+'</option>';
							});
							selectbox = selectbox + "</select>";
						}
					}
				});
				var areaInfo = localStorage.getItem("i_area");
				if(selectbox != ''){
					areaInfo = selectbox;
				}
				$("#userDetails").html("Welcome <b>"+localStorage.getItem("i_username")+"</b>, Area <b>"+areaInfo+"</b>");	
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
	var map={};
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
					generatedynamicRow($(obj).attr('item'),$(obj).attr('id'));
					var tdLoop = $('#displayTableDetails tr:last > td');					
					$(tdLoop).eq(2).find('select').val($(obj).attr('type'));
					$(tdLoop).eq(3).find('select').val($(obj).attr('brand'));
					$(tdLoop).eq(4).find('select').val($(obj).attr('grade'));
					$(tdLoop).eq(5).find('select').val($(obj).attr('unit'));
					$(tdLoop).eq(6).find('input').val($(obj).attr('price'));
					$(tdLoop).eq(7).find('input').val($(obj).attr('shopName'));
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
	generatedynamicRow($("#popupselect").val(),"-1");
	closePopup();
}
function generatedynamicRow(value,val){
	
	$(masterResp).each(function(i,obj1){
		if($(obj1).attr('item') == value){
			var tr='<tr><td>'+($("#displayTableDetails tbody tr").length + 1)+'</td><td>'+$(obj1).attr('item')+'<input type="hidden" name="id" value="'+val+'" /></td>';
			tr =tr + '<td>'+createSelectBox($(obj1).attr('type'))+'</td><td>'+createSelectBox($(obj1).attr('brand'))+'</td>';
			tr=tr + '<td>'+createSelectBox($(obj1).attr('grade'))+'</td><td>'+createSelectBox($(obj1).attr('unit'))+'</td>';
			tr=tr + '<td><input type="text" style="width:100px" name="price" maxlength="7" class="form-control" ></td><td><input type="text"  style="width:180px" name="shopname" class="form-control" ></td>';
			tr=tr + '<td><input type="button" class="btn btn-primary" value="Save" onclick="return saveRowVal(this)" /></td><td><input type="button" class="btn btn-primary" value="Delete" onclick="return deleteRowVal(this)" /></td></tr>';
			$("#displayTableDetails tbody").append(tr);	
		}
	});	
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
	if (!validation.isNumber(map['price'])) {
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
			&& $(obj).find('td').eq(7).find('input').val().toUpperCase() == map["shopName"].toUpperCase()){
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