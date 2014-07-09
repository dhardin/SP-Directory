#SP-Directory
============

Procedurally generates a nested site directory for a SharePoint site.

##Usage
###

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
