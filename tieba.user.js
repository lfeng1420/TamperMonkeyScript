// ==UserScript==
// @name         tieba
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动签到并屏蔽右侧广告（话题列表、会员、下载app、推荐应用、大家都在搜）
// @author       lfeng
// @match        *://tieba.baidu.com/*
// @match        tieba.baidu.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    String.prototype.startWith=function(str){
        if(str==null||str==""||this.length==0||str.length>this.length)
            return false;
        if(this.substr(0,str.length)==str)
            return true;
        else
            return false;
        return true;
    };

    String.prototype.endWith=function(str){
        if(str==null||str==""||this.length==0||str.length>this.length)
            return false;
        if(this.substring(this.length-str.length)==str)
            return true;
        else
            return false;
        return true;
    };


    // 是否需要删除元素
    function IsNeedRemove(removeElements, name)
    {
        var names = name.split(' ');
        for (var i = 0; i < names.length; ++i)
        {
            for (var j = 0; j < removeElements.length; ++j)
            {
                if (names[i] == removeElements[j])
                {
                    return true;
                }
            }
        }

        return false;
    }


    // 自动签到
    var elements = document.getElementsByClassName("j_signbtn sign_btn_bright j_cansign");
    if (elements && elements.length > 0)
    {
        var signBtn = elements[0];
        signBtn.click();
        signBtn.click();
    }

    // 移除部分元素
    var remove_child_name = new Array("app_download_box", "topic_list_box", "celebrity", "my_app", "j_encourage_entry", "search_back_box");
    var children = document.all || document.getElementsByTagName("*");
    for (var i = 0; i < children.length; ++i)
    {
        var child = children[i];
        if (child.className.startWith("aside_region"))console.log("%s", child.className);
        if (IsNeedRemove(remove_child_name, child.className))
        {
            child.parentElement.removeChild(child);
        }
    }
})();
