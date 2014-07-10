#SP-Directory
============

Procedurally generates a nested site directory for a SharePoint site.

##Usage
============
###Installation
All files must be placed on the same domain as your SharePoint site to avoid errors associated with cross-domain scripting.

###Markup & Initialization
```HTML
<div id="spdir></div>

<script type="text/javascript">
  spdirectory.initModule($('#spdir'), {url: 'top level site url goes here'});
</script>
```

##Variables
-spdirectory
  - Description: Module namespace.  You must use this variable to configure and initialize the directory module.

##Methods
- initModule
  - Parameters
    - $target : Target DOM element that you wish to call initModule on.
    - options : Object containing the various options you wish to pass to initModule.

##Options
- url: 
  - Type: String
  - Description: URL of SharePoint site that you want to make a procedurally generated site directory of.
- jstree:
  - Type: Boolean
  - Description: Specifies whether or not you wish to call the [jsTree](http//wwww.jstree.com) plugin on your directory after it has been constructed. 
