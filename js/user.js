var serverURL = "https://o2mv5wbo9f.execute-api.ap-south-1.amazonaws.com/dev/U/";

function initData(){
	$("#loadingdiv").show();
	$.ajax({
			type: 'POST',
			url: serverURL + "getLocationData",
			success: function (response) {	
				$($(response).get(0)).each(function(i,obj){
						$("#locationVal").append('<option value="'+obj+'">'+obj+'</option>')
					});			
				getRatesValues();		
			},
			error: function (response) {
				alert("Error while updating data "+response);
			}
		});	
}
function getRatesValues(){
	$("#loadingdiv").show();
	var map={};
	map["area"]=$("#locationVal").val();	
	$.ajax({
			type: 'POST',
			data:JSON.stringify(map),
			url: serverURL + "getRegionWiseData",
			success: function (response) {				
				createUserRows(response);
				$("#loadingdiv").hide();				
			},
			error: function (response) {
				alert("Error while updating data "+response);
			}
		});	
}
function createUserRows(response){
	$("#displayTableDetails tbody").empty();
	$(response).each(function(i,obj){
		var tr='<tr><td>'+(++i)+'</td><td>'+$(obj).attr('item')+'</td><td>'+$(obj).attr('type')+'</td><td>'+$(obj).attr('brand')+'</td><td>'+$(obj).attr('grade')+'</td><td>'+$(obj).attr('unit')+'</td><td>'+$(obj).attr('price')+' Rs.</td><td>'+$(obj).attr('shopName')+'</td><td><input type="button" value="BUY" class="btn btn-primary" /></td></tr>';
		$("#displayTableDetails tbody").append(tr);	
	})
	
}