define([
  "skylark-domx-query",
  "../Toolbar",
  "../RichEditor",
  "skylark-widgets-base/Action"
],function($,Toolbar,RichEditor,Action){ 
  
  var StrikethroughAction = Action.inherit({
    name : 'strikethrough',

    icon : 'strikethrough',

    htmlTag : 'strike',

    disableTag : 'pre',

    _activeStatus : function() {
      var active;
      active = this.editor.editable.isActive('strikethrough');
      this.setActive(active);
      return this.active;
    },

    _execute : function() {
      return this.editor.editable.strikethrough();
    }

  });


  return RichEditor.addons.actions.strikethrough = StrikethroughAction;	
});