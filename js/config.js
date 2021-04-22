
var myPath="../";
if(document.getElementById("myConfigLib") != null){
	myPath="";
}

var footerSection =  '<footer class="container-fluid" style="margin-top:130px;padding-top:80px" id="gtco-footer">'+
    '<div class="container">'+
        '<div class="row">'+
            '<div class="col-lg-6" id="contact">'+
                '<h4> Contact Us </h4>'+
                '<input type="text" id="name" class="form-control" placeholder="Full Name">'+
                '<input type="email" id="email" class="form-control" placeholder="Email Address">'+
                '<input type="text" id="phone" class="form-control" placeholder="Phone Number">'+
                '<textarea class="form-control" id="message" placeholder="Message"></textarea>'+
                '<a href="javascript:void(0);" onclick="return sendMessageFooter(this)" class="submit-button">Send Message <i class="fa fa-angle-right" aria-hidden="true"></i></a>'+
            '</div>'+
            '<div class="col-lg-6">'+
                '<div class="row">'+
                    '<div class="col-6">'+
                        '<h4>Company</h4>'+
                        '<ul class="nav flex-column company-nav">'+
                            '<li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>'+
                            '<li class="nav-item"><a class="nav-link" href="#">Services</a></li>'+
                            '<li class="nav-item"><a class="nav-link" href="Contactus.html">Contact</a></li>'+
                        '</ul>'+
                    '</div>'+
                    '<div class="col-6">'+
                        '<h4>Services</h4>'+
                        '<ul class="nav flex-column services-nav">'+
                            '<li class="nav-item"><a class="nav-link" href="#">Building Planning</a></li>'+
                            '<li class="nav-item"><a class="nav-link" href="#">Building Permission</a></li>'+
                            '<li class="nav-item"><a class="nav-link" href="#">Building Construction</a></li>'+
                            '<li class="nav-item"><a class="nav-link" href="#">Engineering Services</a></li>'+
                        '</ul>'+
                    '</div>'+
                    '<div class="col-6">'+
                        '<h4>Location</h4>'+
                        '<ul class="nav flex-column services-nav">'+
                            '<li class="nav-item"><a class="nav-link" href="#">i-111, Deendyal Nagar, Ratlam (M.p.) </a></li>'+
                        '</ul>'+
                    '</div>'+
                    '<div class="col-12">'+
                        '<p>All Rights Reserved. Design by - www.3ddesignsstudio.com</p>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>'+
'</footer>';


var header = "";
if(localStorage.getItem('i_username') == null){
	header = '<nav class="navbar navbar-expand-lg navbar-light bg-light bg-transparent" id="gtco-main-nav" >'+
			'<div class="container"><a href="index.html" class="navbar-brand"><img src="images/InayaLogo.png" width=185 height="90" alt="" ></a>  '+
				'<button class="navbar-toggler" data-target="#my-nav" onclick="myFunction(this)" data-toggle="collapse" style="background-color: #01e6f8;"><span '+
						'class="bar1"></span> <span class="bar2"></span> <span class="bar3"></span></button>'+
				'<div id="my-nav" class="collapse navbar-collapse" style="flex-basis: inherit;flex-grow: inherit;">'+
					'<form class="form-inline my-2 my-lg-0">'+
						'<a href="index.html" class="btn btn-info my-2 my-sm-0 text-uppercase">Home</a>&nbsp;&nbsp;'+
						'<a href="forgetpassword.html" class="btn btn-info my-2 my-sm-0 text-uppercase">Forget Password</a>&nbsp;&nbsp;'+
						'<a href="user-signup.html" class="btn btn-info my-2 my-sm-0 text-uppercase">sign up</a>&nbsp;&nbsp;'+
						'<a href="login.html" class="btn btn-info my-2 my-sm-0 text-uppercase">sign in</a>&nbsp;&nbsp;'+
						'<a href="javascript:void(0)" onclick="return viewMyCart(this)" class="btn btn-info my-2 my-sm-0 text-uppercase">My Cart</a>'+
					'</form>'+
				'</div>'+
			'</div>'+
		'</nav>';	
}else{
	if(localStorage.getItem('i_userType') == 'S'){		
		header = '<nav class="navbar navbar-expand-lg navbar-light bg-light bg-transparent" id="gtco-main-nav">'+
			'<div class="container"><a href="index.html" class="navbar-brand"><img src="images/InayaLogo.png" width=185 height="90" alt="" ></a>  '+
				'<button class="navbar-toggler" data-target="#my-nav" onclick="myFunction(this)" data-toggle="collapse" style="background-color: #01e6f8;"><span '+
						'class="bar1"></span> <span class="bar2"></span> <span class="bar3"></span></button>'+
				'<div id="my-nav" class="collapse navbar-collapse">'+
					'<ul class="navbar-nav mr-auto">'+
						'<li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>'+
						'<li class="nav-item"><a class="nav-link" href="superadmin-entry.html">Super Admin Entry</a></li>'+
						'<li class="nav-item"><a class="nav-link" href="superadmin-create-admin.html">Admin User</a></li>'+
						'<li class="nav-item"><a class="nav-link" href="admin-entry.html">Admin Entry</a></li>'+
						'<li class="nav-item"><a class="nav-link" href="superadmin-transdetails.html">Transaction</a></li>'+
						'<li class="nav-item"><a class="nav-link" href="changepassword.html">Change Password</a></li>'+
					'</ul>'+
					'<form class="form-inline my-2 my-lg-0">'+
						'<a href="#" onclick="logout()" class="btn btn-info my-2 my-sm-0 text-uppercase">logout</a>'+
					'</form>'+
				'</div>'+
			'</div>';		
	}
	if(localStorage.getItem('i_userType') == 'A'){		
		header = '<nav class="navbar navbar-expand-lg navbar-light bg-light bg-transparent" id="gtco-main-nav">'+
			'<div class="container"><a href="index.html" class="navbar-brand"><img src="images/InayaLogo.png" width=185 height="90" alt="" ></a>  '+
				'<button class="navbar-toggler" data-target="#my-nav" onclick="myFunction(this)" data-toggle="collapse" style="background-color: #01e6f8;"><span '+
						'class="bar1"></span> <span class="bar2"></span> <span class="bar3"></span></button>'+
				'<div id="my-nav" class="collapse navbar-collapse">'+
					'<ul class="navbar-nav mr-auto">'+
						'<li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>'+
						'<li class="nav-item"><a class="nav-link" href="admin-entry.html">Admin Entry</a></li>'+
						'<li class="nav-item"><a class="nav-link" href="admin-transdetails.html">Transaction</a></li>'+
						'<li class="nav-item"><a class="nav-link" href="changepassword.html">Change Password</a></li>'+
					'</ul>'+
					'<form class="form-inline my-2 my-lg-0">'+
						'<a href="#" onclick="logout()" class="btn btn-info my-2 my-sm-0 text-uppercase">logout</a>'+
					'</form>'+
				'</div>'+
			'</div>';		
	}
	if(localStorage.getItem('i_userType') == 'U'){		
		header = '<nav class="navbar navbar-expand-lg navbar-light bg-light bg-transparent" id="gtco-main-nav">'+
			'<div class="container"><a href="index.html" class="navbar-brand"><img src="images/InayaLogo.png" width=185 height="90" alt="" ></a>  '+
				'<button class="navbar-toggler" data-target="#my-nav" onclick="myFunction(this)" data-toggle="collapse" style="background-color: #01e6f8;"><span '+
						'class="bar1"></span> <span class="bar2"></span> <span class="bar3"></span></button>'+
				'<div id="my-nav" class="collapse navbar-collapse">'+
					'<ul class="navbar-nav mr-auto">'+
						'<li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>'+
						'<li class="nav-item"><a class="nav-link" href="changepassword.html">Change Password</a></li>'+
					'</ul>'+
					'<form class="form-inline my-2 my-lg-0">'+
						'<a href="#" onclick="return viewMyCart(this)" class="btn btn-info my-2 my-sm-0 text-uppercase">MY Cart</a>&nbsp;&nbsp;'+
						'<a href="#" onclick="logout()" class="btn btn-info my-2 my-sm-0 text-uppercase">logout</a>'+
					'</form>'+
				'</div>'+
			'</div>';		
	}
	
}
$("#topHeadersection").html(header);		
$("#footersection").html(footerSection);
 
function logout(){
	localStorage.removeItem('i_data');
	localStorage.removeItem('i_token');
	localStorage.removeItem('i_userType');
	localStorage.removeItem('i_username');
	localStorage.removeItem('i_area');
	location.href="login.html";
}
function sendMessageFooter(obj){
	if($("#name").val() == ""){
		alert("Please enter Full Name");
		return false;
	}
	if($("#email").val() == ""){
		alert("Please enter Email ID");
		return false;
	}
	if($("#phone").val() == ""){
		alert("Please enter Phone No");
		return false;
	}
	if($("#message").val() == ""){
		alert("Please enter Message");
		return false;
	}
	$(obj).attr('onclick', "");
	$(obj).html('Please Wait....<i class="fa fa-angle-right" aria-hidden="true"></i>');
	var map = {};
		map["name"] = $("#name").val();
		map["emailid"] = $("#email").val();
		map["phone"] = $("#phone").val();
		map["message"] = $("#message").val();
	$.ajax({
			type: 'POST',
			data: JSON.stringify(map),
			url: serverURL.substr(0,serverURL.length -4)+"C/C/sendFooterMsg",
			success: function (response) {					
				alert(response);
				$(obj).attr('onclick', "return sendMessageFooter(this)");
				$(obj).html('Send Message<i class="fa fa-angle-right" aria-hidden="true"></i>');
			},
			error: function (response) {
				alert("Error "+response);
				location.reload();
			}
		});	
		return false;
}

function viewMyCart(obj){
	if(localStorage.getItem("i_username") == null){
		alert("Sorry! Please login first before checking Cart");
		location.href="login.html";
		return false;
	}
	location.href="mycart.html"
}
function checkErrorResp(resp){	
	if(resp.responseJSON.startsWith("Fail")){
		alert("Your session has been expire, Please login");
		logout();
	}
}