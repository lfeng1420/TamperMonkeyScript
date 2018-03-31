// ==UserScript==
// @name         默认显示账号密码登录
// @namespace    http://tampermonkey.net/
// @version      0.50
// @description  Default display account password login.
// @author       lfeng
// @supportURL   https://github.com/lfeng1420/TamperMonkeyScript
// @match        *://auth.alipay.com/*
// @match        *://www.alipay.com/
// @match        *://passport.douyu.com/*
// @match        *://login.xiami.com/*
// @match        *://passport.xiami.com/*
// @match        *://pan.baidu.com/
// @match        *://passport.jd.com/*

// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
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

            // 修改标签
            var tabs = document.getElementById("J-loginMethod-tabs");
            if (tabs)
            {
                var liArray = tabs.getElementsByTagName("li");
                for (var index = 0; index < liArray.length; ++index)
                {
                    var liElement = liArray[index];
                    if (liElement.innerText === "扫码登录")
                    {
                        liElement.setAttribute("class", "");
                        continue;
                    }
                    if (liElement.innerText === "账密登录")
                    {
                        liElement.setAttribute("class", " active ");
                        continue;
                    }
                }
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

            // 获取Form
            var formElements = document.getElementsByClassName("login-form login-by-phoneNum");
            if (formElements && formElements.length > 0)
            {
                formElements[0].setAttribute("class", "login-form login-by-nickname");
            }

            // 修改标签
            var tabElements = document.getElementsByClassName("loginbox-login-subtype");
            if (tabElements && tabElements.length > 0)
            {
                var tab = tabElements[0];
                var spanArray = tab.getElementsByTagName("span");
                for (var index = 0; index < spanArray.length; ++index)
                {
                    var child = spanArray[index];
                    if (child.innerText === "昵称登录")
                    {
                        child.setAttribute("class", "l-stype js-l-stype active");
                        continue;
                    }
                    if (child.innerText === "手机登录")
                    {
                        child.setAttribute("class", "l-stype js-l-stype");
                        continue;
                    }
                }
            }

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


    function HandleBaiduYun()
    {
        var repeatCount = 0;
        var repeatAction = setInterval(function(){
            var switchBtn = document.getElementById("TANGRAM__PSP_4__footerULoginBtn");
            if (switchBtn)
            {
                switchBtn.click();
                clearInterval(repeatAction);
                console.log("HandleBaiduYun Succ.");
            }
            else if (++repeatCount > 100)
            {
                clearInterval(repeatAction);
                console.log("HandleBaiduYun Fail.");
            }
        }, 50);
    }

    function Handlejd()
    {
        setTimeout(function(){
            //点击账户登录按钮
            var array = document.getElementsByClassName("login-tab");
            if (array.length === 0)
            {
                return;
            }
            array[1].click();
            //显示密码删除按钮
            var arrClearBtn = document.getElementsByClassName("clear-btn");
            for (var index = 0; index < arrClearBtn.length; ++index)
            {
                arrClearBtn[index].setAttribute("style", "display: inline;");
            }
            console.log("Handlejd Succ");
        }, 500);
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
            case "passport.xiami.com":
                HandleXiami();
                break;

            case "pan.baidu.com":
                HandleBaiduYun();
                break;
                
            case "passport.jd.com":
                Handlejd();
                break;

            default:
                break;
        }
    }

    DoAction();
})();
