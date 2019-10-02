define([
  "skylark-utils-dom/noder",
  "skylark-domx-query",
  "../Toolbar",
  "../RichEditor",
  "skylark-widgets-base/Action"
],function(noder,$,Toolbar,RichEditor,Action){ 
  var ListAction = Action.inherit({

   });


    ListAction.prototype.type = '';

    ListAction.prototype.disableTag = 'pre, table';

    ListAction.prototype.command = function(param) {
      return this.editor.editable.list(this.type,param,this.disableTag);
    };

    return ListAction;
	
});