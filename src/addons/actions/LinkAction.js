define([
  "skylark-domx-query",
  "../Toolbar",
  "../RichEditor",
  "skylark-widgets-base/Action",
  "../i18n",
  "./LinkPopover"
],function($,Toolbar,RichEditor,Action,i18n,LinkPopover){ 
  

  var LinkAction = Action.inherit({

   });


  LinkAction.prototype.name = 'link';

  LinkAction.prototype.icon = 'link';

  LinkAction.prototype.htmlTag = 'a';

  LinkAction.prototype.disableTag = 'pre';

  LinkAction.prototype.render = function() {
    var args;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    Action.prototype.render.apply(this, args);
    return this.popover = new LinkPopover({
      Action: this
    });
  };

  LinkAction.prototype._status = function() {
   Action.prototype._status.call(this);
    if (this.active && !this.editor.editable.selection.rangeAtEndOf(this.node)) {
      return this.popover.show(this.node);
    } else {
      return this.popover.hide();
    }
  };

  LinkAction.prototype.command = function() {
    if (this.active) {
      this.popover.one('popovershow', (function(_this) {
        return function() {
          if (linkText) {
            _this.popover.urlEl.focus();
            return _this.popover.urlEl[0].select();
          } else {
            _this.popover.textEl.focus();
            return _this.popover.textEl[0].select();
          }
        };
      })(this));

    }

    return this.editor.editable.link(this.active,i18n.translate('linkText'));

  };

  RichEditor.Toolbar.addAction(LinkAction);

  return LinkAction;

});