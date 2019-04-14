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
// @match        *://www.xiami.com/*
// @match        *://pan.baidu.com/
// @match        *://passport.jd.com/*
// @match        *://kyfw.12306.cn/*
// @match        *://www.iqiyi.com/*

// @grant        none
// ==/UserScript==

(function() {
    'use strict';

	function getByClassName(szClsName, index = 0, doc = document)
	{
		var arrElements = doc.getElementsByClassName(szClsName);
		if (arrElements === null || arrElements.length == 0)
		{
			return null;
		}

		return arrElements[index];
	}

	function getById(id, doc = document)
	{
		return doc.getElementById(id);
	}

	function getByTagName(name, index = 0, doc = document)
	{
		var arrElements = doc.getElementsByTagName(name);
		if (arrElements === null || arrElements.length == 0)
		{
			return null;
		}

		return arrElements[index];
	}

	function hasClass(o, name)
	{
		if (o.classList === null || o.classList.length == 0)
		{
			return false;
		}

		for (var index = 0; index < o.classList.length; ++index)
		{
			if (o.classList[index] == name)
			{
				return true;
			}
		}

		return false;
	}

	/////////////////////////////////////////////////////

	function HandleMainXiami()
	{
		var element = getByClassName("modal-inner");
		if (element === null)
		{
			return false;
		}

		// login
		var loginBtn = getByClassName("login");
		loginBtn.click();
		return true;
	}

    function HandleMainAlipay()
    {
        // 移除video
		var video = getById("J_video_player");
		if (video !== null)
		{
			video.parentNode.removeChild(video);
		}
        
		var poster = getById("J_poster");
		if (poster !== null)
		{
			poster.parentNode.removeChild(poster);
		}
        
        // 条件：用户点了登录按钮
		var popbox = getById("J_popbox");
		if (!popbox || (popbox.getAttribute("class") !== "popbox stat-login"))
		{
			return false;
		}

		// 获取嵌套的iframe
		var iframe = getById("J_loginIframe");
		if(!iframe)
		{
			return false;
		}

		// contentWindow
		var frameDocument = iframe.contentDocument || iframe.contentWindow.document;
		if(!frameDocument)
		{
			return false;
		}

		// 切换按钮
		var qrcode = getById("J-qrcode-target", frameDocument);
		if (!qrcode)
		{
			return false;
		}

		// 点击
		qrcode.click();
		return true;
	}

	function HandleAuthAlipay()
    {
        var pathName = location.pathname;
        if (pathName == "/login/index.htm")
        {
            // 显示账密登录
            var loginForm = getById("J-login");
            if(loginForm !== null)
            {
                loginForm.setAttribute("class", "login login-modern");
            }
            // 隐藏扫码登录
            var qrCodeForm = getById("J-qrcode");
            if(qrCodeForm !== null)
            {
                qrCodeForm.setAttribute("class", "qrcode qrcode-modern  fn-hide");
            }

            // 修改标签
            var tabs = getById("J-loginMethod-tabs");
            if (tabs !== null)
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
        }
        else if (pathName == "/login/express.htm")
        {
            var loginMethod = getById("J-loginFormMethod");
			if(loginMethod === null)
			{
				return false;
			}

			var style = window.getComputedStyle(loginMethod);
			if (style === null)
			{
				return false;
			}
			var qrcode = getById("J-qrcode-target");
			if (qrcode === null)
			{
				return false;
			}

			qrcode.click();
		}

		return true;
	}

	function HandleDouyu()
    {
        // 获取按钮
        var element = getByClassName("scanicon-toLogin js-qrcode-switch");
        if (element === null)
        {
            return false;
		}

		// 点击按钮
		element.click();

		// 获取Form
		var formElement = getByClassName("login-form login-by-phoneNum");
		if (formElement !== null)
		{
			formElement.setAttribute("class", "login-form login-by-nickname");
		}

		// 修改标签
		var tabElement = getByClassName("loginbox-login-subtype");
		if (tabElement !== null)
		{
			var spanArray = tabElement.getElementsByTagName("span");
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

		return true;
	}

	function HandleXiami()
    {
        var switchBtn = getById("J_LoginSwitch");
        if (switchBtn === null)
        {
            return false;
		}

		switchBtn.click();
		return true;
    }

	function HandleBaiduYun()
    {
		var switchBtn = getById("TANGRAM__PSP_4__footerULoginBtn");
		if (switchBtn === null)
		{
			return false;
		}

		switchBtn.click();
		return true;
	}

	function Handlejd()
    {
		var qrcodeBtn = getByClassName("login-tab-l");
		if (qrcodeBtn === null)
		{
			return false;
		}
		var link = getByTagName("a", 0, qrcodeBtn);
		if (link === null)
		{
			return false;
		}

		if (link.getAttribute("class") != "checked")
		{
			return false;
		}

		var loginBtn = getByClassName("login-tab-r");
		if (loginBtn === null)
		{
			return false;
		}

		loginBtn.click();
		return true;
	}
	
	function Handle12306()
	{
		var loginCode = getByClassName("login-code");
		if (loginCode === null)
		{
			return false;
		}

		var style = loginCode.getAttribute("style");
		if (style.length != 0 && style.indexOf("display: block;") == -1)
		{
			return false;
		}

		// 点击
		var loginBtn = getByClassName("login-hd-account");
		if (loginBtn !== null)
		{
			loginBtn.click();
		}

		// 隐藏二维码
		style = style.replace("display: block", "display: none");
		loginCode.setAttribute("style", style);

		return true;
	}

	function HandleIqiyi()
	{
		var elements = document.getElementsByClassName("login-frame");
		if (elements === null || elements.length == 0)
		{
			return false;
		}

		var hasLoginFrameFlag = false;
		var finalElement = null;
		for (var index = 0; index < elements.length; ++index)
		{
			var element = elements[index];
			if (element.getAttribute("class") == "login-frame"
				&& element.getAttribute("data-loginele") == "codeLogin")
			{
				element.setAttribute("class", "login-frame dn");
				hasLoginFrameFlag = true;
			}

			if (element.getAttribute("data-loginele") == "passLogin")
			{
				finalElement = element;
			}
		}

		if (hasLoginFrameFlag && finalElement !== null)
		{
			finalElement.setAttribute("class", "login-frame");
		}

		return hasLoginFrameFlag;
	}

	function HandleQzone()
	{
		var iframe = getById("login_frame");
		var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
		var qrlogin = getByClassName("qlogin", innerDoc);
		if (qrlogin === null)
		{
			return false;
		}

		var style = qrlogin.getAttribute("style");
		console.log("%s", style);
		if (style.indexOf("dispaly: block") != -1)
		{
			style = style.replace("display: block", "display: none");
			qrlogin.setAttribute("style", style);

			var normallogin = getByClassName("web_qr_login", innerDoc);
			style = normallogin.getAttribute("style");
			style = style.replace("display: none", "display: block");
			normallogin.setAttribute("style", style);
		}

		return true;
	}

	const handle_funcs =
	{
		"www.alipay.com" : HandleMainAlipay,
		"auth.alipay.com" : HandleAuthAlipay,
		"www.xiami.com" : HandleMainXiami,
		"passport.douyu.com" : HandleDouyu,
		"login.xiami.com" : HandleXiami,
		"passport.xiami.com" : HandleXiami,
		"pan.baidu.com" : HandleBaiduYun,
		"passport.jd.com" : Handlejd,
		"kyfw.12306.cn" : Handle12306,
		"www.iqiyi.com" : HandleIqiyi,
	};

	function commonFunc_Loop(func)
	{
		var repeatAction = setInterval(function(){
			if (func())
			{
				clearInterval(repeatAction);
				console.log("Handle '%s' Succ.", location.host);
			}
		}, 50);
	}

	function __Main()
	{
		if (handle_funcs[location.host] != undefined)
		{
			commonFunc_Loop(handle_funcs[location.host]);
		}
	}

	__Main();
})();
