/*
 * spdirectory.js
 * Root namespace module
*/

/*jslint          browser : true,     continue : true,
  devel   : true,  indent : 2,        maxerr   : 50,
  newcapp : true,   nomen : true,     plusplus : true,
  regexp  : true,  sloppy : true,         vars : false,
  white   : true
*/
/*global $, spdirectory */

var spdirectory = (function () {
    //----------------- BEGIN MODULE SCOPE VARIABLES ---------------
    var
        configMap = {
            main_html: '<ul class="sp-dir"><li data-jstree="{icon:"images/home.png", opened:true}"><a href="#">Home</a><ul class="tree-top"></ul></li></ul>',
            settings_map : {
                url: true
            },
            tree_item_map : {
                pageParentList: String()
                    + '<ul class="parentPage">'
                        + '<li>'
                            + '<a>Pages</a>'
                            + '<ul class="pages"></ul>'
                        + '</li>'
                    + '</ul>',
                listParentList: String()
                  + '<ul class="parentList">'
                      + '<li>'
                          + '<a>Lists</a>'
                          + '<ul class="lists"></ul>'
                      + '</li>'
                  + '</ul>',
                child: '<li><a></a></li>'
            },
            data_tree_map : {//data-jstree=
                home: '{ icon:"images/home.png" }',
                page: '{ icon:"images/tree.png" }',
                list: '{ icon:"images/list.png" }'
            }
        },
        settings_map = {
            url: ""
        },
        stateMap = {
            $container: null
        },
        jqueryMap = {},
        
        initModule, setJqueryMap, getData, getWebs, getLists, printError, processResults, populateTree;

    //----------------- END MODULE SCOPE VARIABLES ---------------
    //----------------- BEGIN UTILITY METHODS --------------------

    getWebs = function (url, $target, callback) {
        var results = [],
            
        // Create the SOAP request
         soapEnv =
            '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                <soap:Body>\
                  <GetWebCollection xmlns="http://schemas.microsoft.com/sharepoint/soap/" />\
                </soap:Body>\
            </soap:Envelope>';

       
        $.ajax({
            url: url + "/_vti_bin/webs.asmx",
            type: "POST",
            dataType: "xml",
            data: soapEnv,
            error: printError,
            complete:  function(xData, status){
                $(xData.responseText).find("web").each(function () {
                    var $this = $(this)[0],
                    title, url;

                    title = $this.title;
                    url = $this.getAttribute('url');
                    results.push({ title: title, url: url, type: 'web' });
                });

                if (callback) {
                    callback(results, $target);
                }
            },
            contentType: "text/xml; charset=\"utf-8\""
        });
    };

    getLists = function (url, $target, callback) {
        var results = [],

        // Create the SOAP request
         soapEnv =
            '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
                <soap:Body>\
                  <GetListCollection xmlns="http://schemas.microsoft.com/sharepoint/soap/" />\
                </soap:Body>\
            </soap:Envelope>';


        $.ajax({
            url: url + "/_vti_bin/lists.asmx",
            type: "POST",
            dataType: "xml",
            data: soapEnv,
            error: printError,
            complete: function (xData, status) {
                $(xData.responseText).find("list").each(function () {
                    var $this = $(this)[0],
                    title, url;

                    title = $this.title;
                    url = $this.getAttribute('DefaultViewUrl');
                    results.push({ title: title, url: url, type: 'list' });
                });

                if (callback) {
                    callback(results, $target);
                }
            },
            contentType: "text/xml; charset=\"utf-8\""
        });
    };

    printError = function (XMLHttpRequest, textStatus, errorThrown) {
        console.log("There was an error: " + errorThrown + " " + textStatus);
        console.log(XMLHttpRequest.responseText);
    };

    processResult = function (arr, $target, type) {
        var i;
        //var i,
        //    targetTitle = options.targetTitle || "",
        //    targetUrl = options.targetUrl || "",
        //    targetIcon = options.targetIcon || "";
        if (arr.length == 0 && $target.find('ul')) {
            if (type == 'list') {
                $target.find('.parentPage').remove();
            }
            else {
                $target.find('.parentList').remove();
            }
        }

        for (i = 0; i < arr.length; i++){
            var $listItem = $(configMap.tree_item_map.child),
                $pageChildList = $(configMap.tree_item_map.pageParentList),
                $listChildList = $(configMap.tree_item_map.listParentList);

           

            $listItem.find('a').text(arr[i].title);
            $listItem.find('a').attr('href', arr[i].url);
           
            $listItem.attr('data-jstree', arr[i].type == 'web' ? configMap.data_tree_map.page : configMap.data_tree_map.list);
            $listItem.appendTo($target);
            

           

            if (type == 'web') {
                $pageChildList.appendTo($listItem);
                $listChildList.appendTo($listItem);

                getLists(arr[i].url, $listChildList.find('.lists'), function (results, $targetList) {
                    processResult(results, $targetList, 'list');
                });

                getWebs(arr[i].url, $pageChildList.find('.pages'), function (results, $targetList) {
                    processResult(results, $targetList, 'web');
               
                });
            }
        }
    };

    //----------------- END UTILITY METHODS ----------------------
    //--------------------- BEGIN DOM METHODS --------------------
    // Begin DOM method /setJqueryMap/
    setJqueryMap = function () {
        var
        $container = stateMap.$container;
        
        jqueryMap = {
            $container: $container,
            $tree: $container.find('.sp-dir'),
            $treeTop: $container.find('.tree-top')
        };
    };
    // End DOM method /setJqueryMap/

    populateTree = function (data) {

    };
    //--------------------- END DOM METHODS --------------------

    initModule = function ($container, options) {
        var $tree = $(configMap.main_html),
            isRecursive = true;

        if (options.url) {
            settings_map.url = options.url;
        } else {
            return;
        }

        $tree.appendTo($container);
        stateMap.$container = $container;

        setJqueryMap();
        getWebs(settings_map.url, jqueryMap.$treeTop, function (results, $target) {
            processResult(results, $target, 'web');
        });

        //initiate tree
        //setTimeout(function () {
        //    jqueryMap.$container.jstree();
        //}, 10000);
        jqueryMap.$tree
           // listen for event
           .on('changed.jstree', function (e, data) {
               var i, j, r = [], href, text;
               for (i = 0, j = data.selected.length; i < j; i++) {
                   href = data.instance.get_node(data.selected[i])['a_attr'].href;
               }
               if (href != '#') {
                   window.open(href);
               }
           });
    };
    return { initModule: initModule };
}());