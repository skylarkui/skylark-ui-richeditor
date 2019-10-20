define([
  "skylark-domx-query",
  "../Toolbar",
  "../RichEditor",
  "./ListButton"
],function($,Toolbar,RichEditor,ListButton){ 
   var UnorderListButton = ListButton.inherit({

   });

    UnorderListButton.prototype.type = 'ul';

    UnorderListButton.prototype.name = 'ul';

    UnorderListButton.prototype.icon = 'list-ul';

    UnorderListButton.prototype.htmlTag = 'ul';

    UnorderListButton.prototype.shortcut = 'cmd+.';

    UnorderListButton.prototype._init = function() {
      if (this.editor.editable.util.os.mac) {
        this.title = this.title + ' ( Cmd + . )';
      } else {
        this.title = this.title + ' ( Ctrl + . )';
        this.shortcut = 'ctrl+.';
      }
      return ListButton.prototype._init.call(this);
    };

    RichEditor.Toolbar.addButton(UnorderListButton);  

    return UnorderListButton;

});