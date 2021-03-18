
var myPath="../";
if(document.getElementById("myConfigLib") != null){
	myPath="";
}

var footerSection =  '<br><br><footer class="container-fluid" id="gtco-footer">'+
    '<div class="container">'+
        '<div class="row">'+
            '<div class="col-lg-6" id="contact">'+
                '<h4> Contact Us </h4>'+
                '<input type="text" id="name" class="form-control" placeholder="Full Name">'+
                '<input type="email" id="email" class="form-control" placeholder="Email Address">'+
                '<input type="text" id="Phone" class="form-control" placeholder="Phone Number">'+
                '<textarea class="form-control" id="message" placeholder="Message"></textarea>'+
                '<a href="Contactus.html" class="submit-button">Send Message <i class="fa fa-angle-right" aria-hidden="true"></i></a>'+
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


		
var topHeader = '<nav class="navbar navbar-expand-lg navbar-light bg-light bg-transparent" id="gtco-main-nav">'+
'<div class="container"><a class="navbar-brand">inaya Construction</a>'+
	'<button class="navbar-toggler" data-target="#my-nav" onclick="myFunction(this)" data-toggle="collapse"><span'+
			'class="bar1"></span> <span class="bar2"></span> <span class="bar3"></span></button>'+
	'<div id="my-nav" class="collapse navbar-collapse">'+
		'<ul class="navbar-nav mr-auto">'+
			'<li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>'+
			'<li class="nav-item"><a class="nav-link" href="#services">Services</a></li>'+
			 '<li class="nav-item"><a class="nav-link" href="Contactus.html">Contact</a></li>'+
		'</ul>'+
		'<form class="form-inline my-2 my-lg-0">'+
			'<a href="#" class="btn btn-outline-dark my-2 my-sm-0 mr-3 text-uppercase">login</a> <a href="#"'+
			' class="btn btn-info my-2 my-sm-0 text-uppercase">sign'+
			'up</a>'+
		'</form>'+
	'</div>'+
'</div>'+
'</nav>'+
'<div class="container-fluid gtco-banner-area">'+
'<div class="container">'+
	'<div class="row">'+
		'<div class="col-md-6">'+
			'<h1> We promise to bring'+
				'the best <span>solution</span> for'+
				'your business. </h1>'+
				'<p></p>'+
			'<a href="#">Contact Us <i class="fa fa-angle-right" aria-hidden="true"></i></a></div>'+
		'<div class="col-md-6">'+
			'<div class="card"><img class="card-img-top img-fluid" src="images/banner-img.png" alt=""></div>'+
		'</div>'+
	'</div>'+
'</div>'+
'</div>';	
		  

	
$("#topHeadersection").html(topHeader);		
$("#footersection").html(footerSection);
 

