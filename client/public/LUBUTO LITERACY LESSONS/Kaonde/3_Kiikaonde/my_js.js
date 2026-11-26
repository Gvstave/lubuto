var myTheme = {
    init : function(){
		var ie_v = $exe.isIE();
        if (ie_v && ie_v<8) return false;
        setTimeout(function(){
            $(window).resize(function() {
                myTheme.reset();
            });
        },1000);
        var l = $('<p id="nav-toggler"><button type="button" onclick="myTheme.toggleMenu(this)" class="kid-btn btn-menu hide-nav" id="toggle-nav" aria-label="Menu" title="'+$exe_i18n.hide+'"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2.5" /><rect x="11" y="4" width="9" height="4" rx="2" /><circle cx="6" cy="12" r="2.5" /><rect x="11" y="10" width="9" height="4" rx="2" /><circle cx="6" cy="18" r="2.5" /><rect x="11" y="16" width="9" height="4" rx="2" /></svg></button></p>');
        $("#siteNav").before(l);
        var url = window.location.href;
        url = url.split("?");
        if (url.length>1){
            if (url[1].indexOf("nav=false")!=-1) {
                myTheme.hideMenu();
            }
        }
    },
    hideMenu : function(){
        $("#siteNav").hide();
        $(document.body).addClass("no-nav");
        myTheme.params("add");
        $("#toggle-nav").attr("class","show-nav").attr("title",$exe_i18n.show);
    },
    toggleMenu : function(e){
        if (typeof(myTheme.isToggling)=='undefined') myTheme.isToggling = false;
        if (myTheme.isToggling) return false;
        
        var l = $("#toggle-nav");
        
        if (!e && $(window).width()<900 && l.css("display")!='none') return false; // No reset in mobile view
        if (!e) l.attr("class","show-nav").attr("title",$exe_i18n.show); // Reset
        
        myTheme.isToggling = true;
        
        if (l.attr("class")=='hide-nav') {       
            l.attr("class","show-nav").attr("title",$exe_i18n.show);
			$("#siteFooter").hide();
			$("#siteNav").slideUp(400,function(){
                $(document.body).addClass("no-nav");
                $("#siteFooter").show();
                myTheme.isToggling = false;
            }); 
            myTheme.params("add");
        } else {
            l.attr("class","hide-nav").attr("title",$exe_i18n.hide);
            $(document.body).removeClass("no-nav");
			$("#siteNav").slideDown(400,function(){
                myTheme.isToggling = false;
            });
            myTheme.params("delete");            
        }
        
    },
    param : function(e,act) {
        if (act=="add") {
            var ref = e.href;
            var con = "?";
            if (ref.indexOf(".html?")!=-1) con = "&";
            var param = "nav=false";
            if (ref.indexOf(param)==-1) {
                ref += con+param;
                e.href = ref;                    
            }            
        } else {
            // This will remove all params
            var ref = e.href;
            ref = ref.split("?");
            e.href = ref[0];
        }
    },
    params : function(act){
        $("A",".pagination").each(function(){
            myTheme.param(this,act);
        });
    },
    reset : function() {
        myTheme.toggleMenu();        
    }    
}

$(function(){
    if (document.body.className=='exe-web-site js') {
        myTheme.init();
    }
});