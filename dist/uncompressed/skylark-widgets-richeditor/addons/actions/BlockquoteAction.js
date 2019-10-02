define([
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "skylark-widgets-base/Action"
],function($,Toolbar,RichEditor,Action){ 
   var BlockquoteAction = Action.inherit({
      name : 'blockquote',

      icon : 'quote-left',

      htmlTag : 'blockquote',

      disableTag : 'pre, table',

      _execute : function() {
        return this.editor.editable.blockquote(this.htmlTag,this.disableTag);
      }
   });


   RichEditor.addons.actions.blockquote = BlockquoteAction; 

   return BlockquoteAction;
});