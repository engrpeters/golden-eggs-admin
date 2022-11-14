var body = $('body')
$(".right-side-toggle").click(function () {
    $(".right-sidebar").slideDown(50);
    $(".right-sidebar").toggleClass("shw-rside");
    // Fix header
    $(".fxhdr").click(function () {
        $("body").toggleClass("fix-header");
    });
    // Fix sidebar
    $(".fxsdr").click(function () {
        $("body").toggleClass("fix-sidebar");
    });
    // Service panel js
    if ($("body").hasClass("fix-header")) {
        $('.fxhdr').attr('checked', true);
    }
    else {
        $('.fxhdr').attr('checked', false);
    }
    if ($("body").hasClass("fix-sidebar")) {
        $('.fxsdr').attr('checked', true);
    }
    else {
        $('.fxsdr').attr('checked', false);
    }
});
$(".open-close").on('click', function () {
    if ($("body").hasClass("content-wrapper")) {
        $("body").trigger("resize");
        $(".sidebar-nav, .slimScrollDiv").css("overflow", "hidden").parent().css("overflow", "visible");
        $("body").removeClass("content-wrapper");
        $(".open-close i").addClass("icon-arrow-left-circle");
        $(".logo span").show();
    }
    else {
        $("body").trigger("resize");
        $(".sidebar-nav, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
        $("body").addClass("content-wrapper");
        $(".open-close i").removeClass("icon-arrow-left-circle");
        $(".logo span").hide();
    }
});

$(".has-ul").on('click',function(){
    //e.stopPropagation()
      $(this).parent().find('ul').toggleClass('hidden-ul')
  
})

$(function () {
    var set = function () {
            var topOffset = 60
                , width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width
                , height = ((window.innerHeight > 0) ? window.innerHeight : this.screen.height) - 1;
            if (width < 768) {
                $('div.navbar-collapse').addClass('collapse');
                topOffset = 100; /* 2-row-menu */
            }
            else {
                $('div.navbar-collapse').removeClass('collapse');
            }
            /* ===== This is for resizing window ===== */
            if (width < 1170) {
                body.addClass('content-wrapper');
                $(".open-close i").removeClass('icon-arrow-left-circle');
                $(".sidebar-nav, .slimScrollDiv").css("overflow-x", "visible").parent().css("overflow", "visible");
                $(".logo span").hide();
            }
            else {
                body.removeClass('content-wrapper');
                $(".open-close i").addClass('icon-arrow-left-circle');
                $(".logo span").show();
            }
            height = height - topOffset;
            if (height < 1) {
                height = 1;
            }
            if (height > topOffset) {
                $("#page-wrapper").css("min-height", (height) + "px");
            }
        }
        , url = window.location
        , element = $('ul.nav a').filter(function () {
            return this.href === url || url.href.indexOf(this.href) === 0;
        }).addClass('active').parent().parent().addClass('in').parent();
    if (element.is('li')) {
        element.addClass('active');
    }
    $(window).ready(set);
    $(window).on("resize", set);
});
//$(document).ready(function(){
$(window).on('load', function () {
    var toks = localStorage.getItem('token')
    if (toks) {
     /*   axios.interceptors.response.use(undefined, async(err) => {
            if (err.response && err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
                localStorage.removeItem('token')
                window.location.pathname = 'login.html'
                'I see Illega man'
            }
        })
        */
        if (window.location.pathname != '/login.html') {
            axios.defaults.headers.common['Authorization'] = 'bearer ' + toks;
            axios.get('admin/me').then(function (res) {
                window.user = res.data.user;
                $('.username').text(user.email.split('@')[0])
            });
            $('body').trigger('user-loaded')
        }
        else {
            window.location.pathname = 'index.html'
        }
    }
    else {
        if (window.location.pathname != '/login.html') {
            window.location.pathname = '/login.html'
        }
    }
})
axios.defaults.baseURL = 'https://gold-eggs.org/api';
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
console.log('pop');
axios.defaults.headers.post['Content-Type'] = 'application/json';
$('.login-button').on('click', function (e) {
    e.preventDefault();
    $('.error-place').addClass('hidden')
    axios.post('/admin/auth/sign_in', {
        "email": $('.login-email').val()
        , "password": $('.login-password').val()
    }).then(function (r) {
        localStorage.setItem('token', r.data.token)
        window.location.pathname = '/index.html'
    }).catch(function (e) {
        $('.error-place').removeClass('hidden').text(e.response.data.error)
    })
})




$('body').on('user-loaded', function () {
    console.log('2')
    axios.get('admin/me').then(function (res) {
        window.user = res.data.user;
        $('.username').text(user.email.split('@')[0])
    })
    
    
    $('.fa-power-off').parent().addClass('logout')

    $('.logout').click(()=>{
        localStorage.removeItem('token');
        window.location = '/login.html'
    })
    
    $('#side-menu').append(' <li><a href="settings.html" class="waves-effect"><i class="icon-settings"></i> <span class="hide-menu"> Settings</span></a> </li>')
    
    $('#side-menu li a').removeClass('active')
    
});