$(function (){
    var $element = ("#main");
    var $element1 = (".birds");
    var nav = $(".menu");
    var navPosition = nav.offset();
    $(window).on("scroll", function (){
        var scroll = $(window).scrollTop();
        $($element).css("transform","perspective(1000px) translate3D(0px," + -0.1*scroll + "px," + Math.min(300,scroll) + "px)");
        
        
        $($element1).css("background-position","50% " + (-scroll/4) + "px");
        
        $(".widthLoad").css("width",(scroll/3) + "px");
        $(".topContent a").css("border-radius",Math.min(21,scroll) + "px");
        
        
        if($(window).scrollTop() > navPosition.top){
            nav.addClass("sticky");
            $(".menu").css("height","50px");
            $(".mainContent").css("margin-top","50px");
            
        }
        else{
            
            nav.removeClass("sticky");
            $(".mainContent").css("margin-top","0px");
        }
        if($(window).scrollTop() > $(".topContent").offset().top){
           // $(".topPage").show();
            $(".topPage").fadeIn().show();
        }
        else {
           // $(".topPage").fadeOut();
            $(".topPage").fadeOut().hide();
        }
        
        if($(window).scrollTop() > $(".center").offset().top){
           
           $(".userSignup input").css("width","150px");
           $(".userLogin").css("border-top-right-radius",((Math.min(21,scroll) - $("figure img").offset().top)) + "px");
        }
        else {
           $(".userSignup input").css("width","0px");
           
        }
        
    });
});


$(document).ready(function (){
        $(".topPage").hide();
        if($(".submitBtn").hasClass("show")){
        	$(".submitBtn").removeClass("show");
        }
$('a[href*="#"]')
    .not('[href="#"]') 
     .not('[href="#0"]') 
     .click(function(event) { 
         var target = $(this.hash);
         if(target.length){
         event.preventDefault();
         $("body,html").animate({scrollTop:target.offset().top - 50},1000, function (){
             var $target = $(target);
             $target.focus();
             if($target.is(":focus")){
                 return false;
             }
             else{
                $target.attr('tabindex','-1');
                 $target.focus();
             }
         });
         }
     });
});

function submit(){
    if($("#userName").val() != "" && $("#password").val() != ""){
    return true;
    }
    else{
        $("#userName").attr("placeholder","fill out the forms");
        return false;
        
    }
};

function next(){
    if(!$("#userName").hasClass("show") && !$("#password").hasClass("show")){
        $(".email").addClass("show");
        $("#userName").hide();
        $(".confirmPassword").addClass("show");
        $("#password").hide();
        $("#user").hide("E-mail:");
        $("#passwordText").hide("Confirm Password:");
        $(".emailText").addClass("show");
        $(".confirmPasswordText").addClass("show");
        $(".submitBtn").addClass("show");
        $("#buttonSubmit").hide();
        return true;
    }
    else{
        return false;
    }
};


function openMenu(){
    $(".menuOpen").css("height","100vh");
    $(".menuOpen ul").css("left","50%");
    $(".menuOpen ul").css("top","0%");
    $(".menuOpen ul").animate({top : "20%"},1000);
}


function closeMenu(){
    $(".menuOpen").css("height","0");
    $(".menuOpen ul").animate({left : "150%"});
    
}
    
