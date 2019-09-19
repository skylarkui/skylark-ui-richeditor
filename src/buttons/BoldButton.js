define([
  "skylark-domx-query",
  "../Toolbar",
  "../RichEditor",
  "../Button"
],function($,Toolbar,RichEditor,Button){ 
  
    var BoldButton = Button.inherit({

    });

    BoldButton.prototype.name = 'bold';

    BoldButton.prototype.icon = 'bold';

    BoldButton.prototype.htmlTag = 'b, strong';

    BoldButton.prototype.disableTag = 'pre';

    BoldButton.prototype.shortcut = 'cmd+b';

    BoldButton.prototype._init = function() {
      if (this.editor.editable.util.os.mac) {
        this.title = this.title + ' ( Cmd + b )';
      } else {
        this.title = this.title + ' ( Ctrl + b )';
        this.shortcut = 'ctrl+b';
      }
      return Button.prototype._init.call(this);
    };

    BoldButton.prototype._activeStatus = function() {
      var active;
      active = this.editor.editable.isActive('bold');
      this.setActive(active);
      return this.active;
    };

    BoldButton.prototype.command = function() {
      return this.editor.editable.bold();
    };


    RichEditor.Toolbar.addButton(BoldButton);

    return BoldButton;

});