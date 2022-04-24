var ajax_IX = 0;

function getData(url, data, func, jsonResults, noload) {
    ajax_IX++;
    var currentAjaxIX = ajax_IX;

    if (url == null) { url = "#adHoc"; }
    url = "../" + url.replace(/#/, "main/");

    if (noload == null) {
        //create loading image
        xloading(true, currentAjaxIX);
    }

    try {
        var xx = new XMLHttpRequest();
        xx.onreadystatechange = function () {
            try {
                if (this.readyState == 4 && this.status == 200) {
                    if (noload == null) {
                        //close loading image
                        xloading(false, currentAjaxIX);
                    }
                    var vr = this.responseText;
                    if (vr == "Logout") {
                        window.location.href = "Home/Index";
                    } else if (vr.split(":")[0] == "error") {
                        console.log(vr);
                    }
                    else {
                        if (jsonResults) { func(jparse(vr)); }
                        else { func(vr); }
                    }
                } else if (this.readyState == 4 && this.status != 200) {
                    console.log("This process returned the following status code: " + this.status);
                }
            } catch (e) {
                console.log("ajax error at : " + url);
                console.log(e);
                for (var pair of data.entries()) {
                    console.log(pair[0] + ', ' + pair[1]);
                }
                console.log(e);
            }
        };

        xx.open("POST", url, true);
        xx.onerror = function (e) {
            console.log(e);
        };

        if (data == null) {
            data = new FormData();
        }
        data.append("csrf", document.getElementById("csrfToken").value);

        if (data != null) {
            xx.send(data);
        } else {
            xx.send();
        }
    } catch (e) {
        console.log(e);
    }
}

function xloading(showme, ix) {
    var elemLoading = document.getElementById("adhocLoading_" + ix);
    try { PageContainer.removeChild(elemLoading); } catch (e) { };

    if (showme) {
        elemLoading = dyn("img", "id=adhocLoading_" + ix + "|class=cursor|onclick=xloading(false, " + ix + ")|title=Click here to remove loading image [id: " + ix + "]" +
            "|style=z-index:3000;position:absolute;top:60px;left:45%;|src=loading.gif");
        try { PageContainer.appendChild(elemLoading); } catch (e) { };
    }
}