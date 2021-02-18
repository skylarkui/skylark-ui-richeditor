define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "skylark-domx-panels/Toolbar",
  "skylark-widgets-base/Widget",
  "./ToolButton",
  "./addons"
],function(langx,$,_Toolbar, Widget,ToolButton,addons){ 
  var Toolbar = Widget.inherit({
    klassName : "Toolbar",
    pluginName : "lark.wordpad.toolbar",

    options : {
      template : "<div class=\"domx-toolbar\"><ul></ul></div>"
    },

    _construct : function(editor,opts) {
      this.editor =editor;
      var elm = this.$("<div class=\"domx-toolbar\"><ul></ul></div>")[0];
      Widget.prototype._construct.call(this,elm,opts);
     
    },

    _init : function() {
      this._xtoolbar = _Toolbar.instantiate(this._elm,this.options);
      var k, len, name, ref;
      this.buttons = [];
      //this.wrapper = $(this._tpl.wrapper).prependTo(this.editor.wrapper);
      this.wrapper = $(this._elm).prependTo(this.editor.wrapper);
      ref = this.options.toolbar;
      for (k = 0, len = ref.length; k < len; k++) {
        name = ref[k];
        if (name === '|') {
          this._xtoolbar.addSeparator();
          continue;
        }

        var action  = this.editor.findAction(name),
            toolItemCtor = addons.toolbar.items[name];

        if (!toolItemCtor) {
          toolItemCtor = ToolButton;
        }

        this.buttons.push(new toolItemCtor({
          "action" : action,
          "toolbar" : this
        }));
      }
      //if (this.options.toolbarHidden) {
       // return this.wrapper.hide();
      //}
    },

    addToolItem : function(item) {
      this._xtoolbar.addToolItem(item);
    },

    findButton : function(name) {
      var button;
      button = this._xtoolbar.list.find('.toolbar-item-' + name).data('button');
      return button != null ? button : null;
    }
  });


  Toolbar.addButton = function(btn) {
    return this.buttons[btn.prototype.name] = btn;
  };

  Toolbar.buttons = {};

  return Toolbar;

});