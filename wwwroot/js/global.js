var optsOpen = false;
var whichOpt;
var opt = document.getElementById("optWindow");
var optsFunc = null;

function heartbeat() {

}

function sortJS(objArray, prop, descending) {
    prop = 'attributes.' + prop;
    if (arguments.length < 2) throw new Error("sortJsonArrayByProp requires 2 arguments");
    var direct = (descending != null) ? -1 : 1; //Default to ascending

    if (objArray && objArray.constructor === Array) {
        var propPath = (prop.constructor === Array) ? prop : prop.split(".");
        console.log("err:" + propPath);
        objArray.sort(function (a, b) {
            for (var p in propPath) {
                if (a[propPath[p]] && b[propPath[p]]) {
                    a = a[propPath[p]];
                    b = b[propPath[p]];
                }
            }
            // convert numeric strings to integers
            a = a.toString();
            b = b.toString();
            a = a.match(/^\d+$/) ? +a : a;
            b = b.match(/^\d+$/) ? +b : b;
            return ((a < b) ? -1 * direct : ((a > b) ? 1 * direct : 0));
        });
    }
}

function newFormData(action, js) {
    var data = new FormData();
    data.append("action", action);
    data.append("strjson", jstring(js));

    return data;
}


function jparse(vr) {
    return JSON.parse(vr);
}
function jstring(js) {
    return JSON.stringify(js);
}

function xconfirm(msg, elems, funcname) {
    var main = document.getElementById("confirmWindow");
    main.style.zIndex = 5000;

    main.innerHTML = "";
    main.style.display = "";
    main.style.width = "40%";
    main.style.height = "40%";

    if (msg != null || elems != null) {
        document.getElementById("PageContainer").style.opacity = ".3";
        document.getElementById("optWindow").style.opacity = ".6";

        if (msg != null) {
            main.appendChild(dyn("div", "innerHTML=" + msg.replace("---", "\\n")));
        }
        else {
            section("confirmWindow", elems);
        }
        console.log(msg);

        //bottom buttons
        var inner = dyn("div", "style=position:absolute; bottom:5px;");
        main.appendChild(inner);
        inner.appendChild(dyn("div", "id=confirmFooter"));

        if (funcname == "xconfirm()" || funcname == null) {
            //only one option ... window is purely informational
            inner.appendChild(dyn("label", "style=padding-right:10px",
                dyn("label", "id=xconfirmOK|class=liteblueButton|onclick=xconfirm()|innerHTML=OK")
            ));
            xconfirmOK.focus();
        } else if (funcname == "cancel") {
            //only one option ... window is purely informational
            inner.appendChild(dyn("label", "style=padding-right:10px",
                dyn("label", "id=xconfirmOK|class=liteblueButton|onclick=xconfirm()|innerHTML=Cancel")
            ));
            xconfirmOK.focus();
        } else {
            //provides option other than cancel ... window requires confirmation
            inner.appendChild(dyn("label", "style=padding-right:10px",
                dyn("label", "id=xconfirmCancel|class=liteblueButton|onclick=xconfirm()|innerHTML=Cancel")
            ));
            inner.appendChild(dyn("label", "style=padding-right:10px",
                dyn("label", "class=liteblueButton|onclick=" + funcname + "|innerHTML=Continue")
            ));
            xconfirmCancel.focus();
        }
    } else {
        document.getElementById("PageContainer").style.opacity = "1";
        document.getElementById("optWindow").style.opacity = "1";
        main.style.display = "none";
    }

}

function opts(closeOpen) {
    document.getElementById("PageContainer").style.opacity = (!closeOpen) ? "1" : ".3";
    document.getElementById("optWindow").style.opacity = (!closeOpen) ? "1" : ".6";
    opt.style.opacity = "1";

    optsOpen = closeOpen;
    opt.innerHTML = "";
    opt.style.display = (optsOpen) ? "" : "none";
    if (optsFunc != null) {
        window[optsFunc]();
    }
}

function clrSubmit() {
    document.getElementById("soSubmit").innerHTML = "";
}

function showOpts(wo, xtra, appendTitle, scroll, closeFunc) {
    if (optsOpen && whichOpt == wo) {
        opts(false);
    } else {
        opt.style.height = "500px";
        opt.style.width = "1000px";

        opts(true);
        whichOpt = wo;

        opt.appendChild(
            dyn("div",
                "id=optWindow_hdr|class=shadowSection hdr|style=position:relative|innerHTML=" + wo + "&nbsp;"));
        section("optWindow_hdr", [
            ((appendTitle == null) ? "" : "label|id=optWindow_hdr_appendTitle| - " + appendTitle),
            "label|id=showOptsHeaderOpts|class=excludePrint|style=float:right"
        ]);
        dragElement(opt);
        opt.style.height = "500px";

        opt.appendChild(dyn("div", "id=optWindow_extrahdr|class=shadowSection|style=display:none"));


        section("showOptsHeaderOpts", [
            "label|style=float:right;padding-right:10px|id=soSubmit",
            "label|style=padding-left:10px",
            "label|class=liteblueButton|onclick=" + ((closeFunc != null) ? closeFunc : "clrSubmit(); showOpts('" + wo + "')") + "|innerHTML=Close",
            "label|style=padding-left:10px",
            "img|style=float:right; display:none; cursor:pointer;width:25px;height:25px|src=popout.png|onclick=popOut('" + wo + "', " + ((xtra != null) ? "'" + xtra + "'" : "") + ")"
        ]);

        var ht = opt.clientHeight - 60;
        var main = dyn("div", "id=optMain|style=width:100%;height:" + ht + "px;position:relative;padding:10px;");
        opt.appendChild(main);
        window[wo.replace(/ /g, "")](main, xtra);

        if (scroll) { main.style.overflowY = "scroll" }
        else { main.style.overflowY = ""; }
    }
}