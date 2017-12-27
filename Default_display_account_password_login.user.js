// ==UserScript==
// @name         默认显示账号密码登录
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  Default display account password login.
// @author       lfeng
// @match        *://auth.alipay.com/*
// @match        *://www.alipay.com/
// @match        *://passport.douyu.com/*
// @match        *://login.xiami.com/*
// @grant        none
// ==/UserScript==

function HandleMainAlipay()
{
    // 移除video
    var video = document.getElementById("J_video_player");
    video.parentNode.removeChild(video);
    var poster = document.getElementById("J_poster");
    poster.parentNode.removeChild(poster);
    // 延迟重复执行
    var repeatAction = setInterval(
        function(){
            // 条件：用户点了登录按钮
            var popbox = document.getElementById("J_popbox");
            if (!popbox || (popbox.getAttribute("class") !== "popbox stat-login"))
            {
                return;
            }

            // 获取嵌套的iframe
            var iframe = document.getElementById("J_loginIframe");
            if(!iframe)
            {
                return;
            }

            // contentWindow
            var frameDocument = iframe.contentDocument || iframe.contentWindow.document;
            if(!frameDocument)
            {
                return;
            }

            // 切换按钮
            var qrcode = frameDocument.getElementById("J-qrcode-target");
            if (!qrcode)
            {
                return;
            }

            // 点击
            qrcode.click();
            clearInterval(repeatAction);
            console.log("HandleMainAlipay Succ.");
        }, 100);
}


function HandleAuthAlipay()
{
    var pathName = location.pathname;
    if (pathName == "/login/index.htm")
    {
        // 显示账密登录
        var loginForm = document.getElementById("J-login");
        if(loginForm)
        {
            loginForm.setAttribute("class", "login login-modern");
        }
        // 隐藏扫码登录
        var qrCodeForm = document.getElementById("J-qrcode");
        if(qrCodeForm)
        {
            qrCodeForm.setAttribute("class", "qrcode qrcode-modern  fn-hide");
        }

        console.log("HandleAuthAlipay Succ.");
        return;
    }
    else if (pathName == "/login/express.htm")
    {
         var repeatAction = setInterval(
             function() {
                 var loginMethod = document.getElementById("J-loginFormMethod");
                 if(!loginMethod)
                 {
                     return;
                 }

                 var style = window.getComputedStyle(loginMethod);
                 if (!style)
                 {
                     return;
                 }
                 var qrcode = document.getElementById("J-qrcode-target");
                 if (!qrcode)
                 {
                     return;
                 }

                 qrcode.click();
                 clearInterval(repeatAction);
                 console.log("HandleAuthAlipay Succ.");
             }, 100);
    }
}


function HandleDouyu()
{
     // 获取按钮
    var elements = document.getElementsByClassName("scanicon-toLogin js-qrcode-switch");
    if (elements && elements.length > 0)
    {
        // 点击按钮
        elements[0].click();
        console.log("HandleDouyu Succ.");
    }
}


function HandleXiami()
{
    var switchBtn = document.getElementById("J_LoginSwitch");
    if (switchBtn)
    {
        switchBtn.click();
        console.log("HandleXiami Succ.");
    }
}


function DoAction()
{
    switch (location.host)
    {
        case "www.alipay.com":
            HandleMainAlipay();
            break;

        case "auth.alipay.com":
            HandleAuthAlipay();
            break;

        case "passport.douyu.com":
            HandleDouyu();
            break;

        case "login.xiami.com":
            HandleXiami();
            break;

        default:
            break;
    }
}

DoAction();