define([
  "skylark-domx-query",
  "../Toolbar",
  "../RichEditor",
  "../Button"
],function($,Toolbar,RichEditor,Button){ 
   var BlockquoteButton = Button.inherit({

   });

  BlockquoteButton.prototype.name = 'blockquote';

  BlockquoteButton.prototype.icon = 'quote-left';

  BlockquoteButton.prototype.htmlTag = 'blockquote';

  BlockquoteButton.prototype.disableTag = 'pre, table';

  BlockquoteButton.prototype.command = function() {
    return this.editor.editable.blockquote(this.htmlTag,this.disableTag);
  };

  RichEditor.Toolbar.addButton(BlockquoteButton); 

  return BlockquoteButton;

});