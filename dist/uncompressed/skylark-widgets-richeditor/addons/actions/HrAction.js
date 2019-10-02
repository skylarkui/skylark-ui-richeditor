define([
  "skylark-domx-query",
  "../Toolbar",
  "../RichEditor",
  "skylark-widgets-base/Action"
],function($,Toolbar,RichEditor,Action){ 
  
   var HrAction = Action.inherit({

	  name : 'hr',

	  icon : 'minus',

	  htmlTag : 'hr',

	  _status : function() {},

	  _execute : function() {
	    return this.editor.editable.hr();
	  }

   });


  RichEditor.addons.actions.hr = HrAction; 

  return HrAction;	
});