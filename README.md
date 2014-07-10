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

##Options
- url: 
  - Type: String
  - Description: URL of SharePoint site that you want to make a procedurally generated site directory of.
