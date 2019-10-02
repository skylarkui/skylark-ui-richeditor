define([
  "skylark-domx-query",
  "../Toolbar",
  "../RichEditor",
  "./ListAction"
],function($,Toolbar,RichEditor,ListAction){ 
   var UnorderListAction = ListAction.inherit({
      type : 'ul',

      name : 'ul',

      icon : 'list-ul',

      htmlTag : 'ul',

      shortcut : 'cmd+.',

      _init : function() {
        if (this.editor.editable.util.os.mac) {
          this.title = this.title + ' ( Cmd + . )';
        } else {
          this.title = this.title + ' ( Ctrl + . )';
          this.shortcut = 'ctrl+.';
        }
        return ListAction.prototype._init.call(this);
      }

   });


    RichEditor.addons.actions.ul = UnorderListAction;

    return UnorderListAction;

});