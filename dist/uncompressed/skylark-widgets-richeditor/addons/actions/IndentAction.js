define([
  "skylark-domx-query",
  "../Toolbar",
  "../RichEditor",
  "skylark-widgets-base/Action"
],function($,Toolbar,RichEditor,Action){ 
  
   var IndentAction = Action.inherit({
      name :'indent',

      icon : 'indent',

      _init : function() {
        var hotkey;
        hotkey = this.editor.opts.tabIndent === false ? '' : ' (Tab)';
        this.title = this._t(this.name) + hotkey;
        return Action.prototype._init.call(this);
      },

      _status : function() {},

      _execute : function() {
        return this.editor.editable.indent()
      }

   });


   RichEditor.addons.actions.indent = IndentAction; 


   return IndentAction;
});