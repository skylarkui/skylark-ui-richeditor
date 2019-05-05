define([
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button"
],function($,Toolbar,RichEditor,Button){ 
  

   var HrButton = Button.inherit({

   });


  HrButton.prototype.name = 'hr';

  HrButton.prototype.icon = 'minus';

  HrButton.prototype.htmlTag = 'hr';

  HrButton.prototype._status = function() {};

  HrButton.prototype.command = function() {
    return this.editor.editable.hr();
  };

  RichEditor.Toolbar.addButton(HrButton);

  return HrButton;
	
});