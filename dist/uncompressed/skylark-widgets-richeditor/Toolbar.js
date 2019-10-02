define([
  "skylark-langx/langx",
  "skylark-utils-dom/query",
  "skylark-widgets-swt/Toolbar"
],function(langx,$,_Toolbar){ 



  var Toolbar = _Toolbar.inherit({
    pluginName : "lark.richeditor.toolbar",

    _construct : function(editor,opts) {
      this.editor =editor;
      _Toolbar.prototype._construct.call(this,opts);
    },

    _init : function() {
      _Toolbar.prototype._init.call(this);
      this._render();
    }

  });

  Toolbar.prototype._render = function() {
    var k, len, name, ref;
    this.buttons = [];
    //this.wrapper = $(this._tpl.wrapper).prependTo(this.editor.wrapper);
    this.wrapper = $(this._elm).prependTo(this.editor.wrapper);
    ref = this.opts.toolbar;
    for (k = 0, len = ref.length; k < len; k++) {
      name = ref[k];
      if (name === '|') {
        this.addSeparator();
        continue;
      }
      if (!this.constructor.buttons[name]) {
        throw new Error("richeditor: invalid toolbar button " + name);
        continue;
      }
      this.buttons.push(new this.constructor.buttons[name]({
        toolbar : this,
        editor: this.editor
      }));
    }
    if (this.opts.toolbarHidden) {
      return this.wrapper.hide();
    }
  };

  Toolbar.prototype.findButton = function(name) {
    var button;
    button = this.list.find('.toolbar-item-' + name).data('button');
    return button != null ? button : null;
  };

  Toolbar.addButton = function(btn) {
    return this.buttons[btn.prototype.name] = btn;
  };

  Toolbar.buttons = {};

  return Toolbar;

});