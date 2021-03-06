﻿var jQuery = "https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.0.2.min.js";

// Is MDS enabled?
if ("undefined" != typeof g_MinimalDownload && g_MinimalDownload && (window.location.pathname.toLowerCase()).endsWith("/_layouts/15/start.aspx") && "undefined" != typeof asyncDeltaManager) {
    // Register script for MDS if possible
    RegisterModuleInit("PnP-Partner-Pack-Overrides.js", JavaScript_Embed); //MDS registration
    JavaScript_Embed(); //non MDS run
} else {
    JavaScript_Embed();
}

function JavaScript_Embed() {

    loadScript(jQuery, function () {
        $(document).ready(function () {
            // SP.SOD.executeOrDelayUntilScriptLoaded(function () { ReplaceLinks(); }, 'sp.js');
            SP.SOD.executeFunc('sp.js', 'SP.ClientContext', replaceLinks);
        });
    });
}

function replaceLinks() {
    var ctx = SP.ClientContext.get_current();
    var web = ctx.get_web();
    ctx.load(web, 'Url');

    ctx.executeQueryAsync(
        function () { // on success

            var currentScriptUrl = $('#PnPPartnerPackOverrides').attr('src');
            var addInSiteUrl = currentScriptUrl.substring(0, currentScriptUrl.indexOf("/Templates/Overrides/"));
            // addInSiteUrl = "https://localhost:44300";
            var hostWebUrl = web.get_url();

            // Customize the viewlsts.aspx page
            if (IsOnPage("viewlsts.aspx")) {
                // Replace the "New Sub Site" link
                $("#createnewsite").attr("href", addInSiteUrl + "/Home/CreateSubSite?SPHostUrl=" + encodeURIComponent(hostWebUrl));
            }

            // Customize the settings.aspx page
            if (IsOnPage("settings.aspx")) {
                // Add the "Save site as Provisioning Template" link
                var manageSiteFeaturesCommand = $("#ctl00_PlaceHolderMain_SiteTasks_RptControls_ManageSiteFeatures");
                if (manageSiteFeaturesCommand != undefined) {
                    manageSiteFeaturesCommand.parent().parent().append('<li class="ms-linksection-listItem"><a id="ctl00_PlaceHolderMain_SiteTasks_RptControls_SaveAsProvisioningTemplate" href="' + addInSiteUrl + '/Home/SaveSiteAsTemplate?SPHostUrl=' + encodeURIComponent(hostWebUrl) + '">Save site as Provisioning Template</a></li>');
                }

                //var saveSiteCommand = $("#ctl00_PlaceHolderMain_SiteTasks_RptControls_SaveAsTemplate");
                //if (saveSiteCommand != undefined) {
                //    saveSiteCommand.attr("href", addInSiteUrl + "Home/SaveSiteTemplate?SPHostUrl=" + encodeURIComponent(hostWebUrl));
                //    saveSiteCommand.text("Save site as Provisioning Template");
                //}
            }
        },
        function (s, e) { // on failure
            console.error(e.get_message());
        }
    );
}

function IsOnPage(pageName) {
    if (window.location.href.toLowerCase().indexOf(pageName.toLowerCase()) > -1) {
        return true;
    } else {
        return false;
    }
}

function loadScript(url, callback) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = url;

    // Attach handlers for all browsers
    var done = false;
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState
					|| this.readyState == "loaded"
					|| this.readyState == "complete")) {
            done = true;

            // Continue your code
            callback();

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        }
    };

    head.appendChild(script);
}
