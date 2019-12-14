define([
  "./Wordpad", 
  "./Action",
  "./Popover",
  "./Toolbar",
  "./ToolButton", 

  "./addons/actions/AlignmentAction", 
  "./addons/actions/BlockquoteAction", 
  "./addons/actions/BoldAction", 
  "./addons/actions/CodeAction", 
  "./addons/actions/CodePopover", 
  "./addons/actions/ColorAction", 
  "./addons/actions/EmojiAction", 
  "./addons/actions/FontScaleAction", 
  "./addons/actions/FullScreenAction", 
  "./addons/actions/HrAction", 
  "./addons/actions/HtmlAction", 
  "./addons/actions/ImageAction", 
  "./addons/actions/ImagePopover", 
  "./addons/actions/IndentAction", 
  "./addons/actions/ItalicAction", 
  "./addons/actions/LinkAction", 
  "./addons/actions/LinkPopover", 
  "./addons/actions/ListAction", 
  "./addons/actions/MarkAction", 
  "./addons/actions/OrderListAction", 
  "./addons/actions/OutdentAction",
  "./addons/actions/StrikethroughAction", 
  "./addons/actions/TableAction", 
  "./addons/actions/TitleAction", 
  "./addons/actions/UnderlineAction", 
  "./addons/actions/UnorderListAction",
  "./addons/actions/VideoAction",

  "./addons/toolbar/items/AlignmentButton",
  "./addons/toolbar/items/ColorButton",
  "./addons/toolbar/items/EmojiButton",
  "./addons/toolbar/items/TableButton",
  "./addons/toolbar/items/TitleButton",

  "./addons/AutoSave",
  "./addons/Dropzone"
],function(Wordpad){
	
  return Wordpad;
});