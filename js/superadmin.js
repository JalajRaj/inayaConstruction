var serverURL = "https://o2mv5wbo9f.execute-api.ap-south-1.amazonaws.com/dev/S/";

function saveLocation(obj){
	if(confirm("Are you sure you want to add new location.\nOnce location is added it cannot be deleted.")){
		$(obj).attr('disabled', true);
		$(obj).val('Please Wait..');
		var map = {};
		map["item"] = $(obj).parent().parent().find('#addText').val();
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
			}
		});
	}
}
	
function initMasterConfig(){
	$("#loadingdiv").show();
	$.ajax({
		type: 'POST',
		url: serverURL + "fetchAllMasterConfigInfo",
		success: function (response1) {
			$(response1).each(function(i,obj1){					
				if($(obj1).attr("item") == 'location'){
					var obj3 = $(obj1).attr('type');
						if(obj3 != undefined){
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
			validateFail(response);
		}
	});	
}