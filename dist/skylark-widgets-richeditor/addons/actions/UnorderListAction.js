/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../RichEditor","./ListAction"],function(t,i,l,e){var o=e.inherit({type:"ul",name:"ul",icon:"list-ul",htmlTag:"ul",shortcut:"cmd+.",_init:function(){return this.editor.editable.util.os.mac?this.title=this.title+" ( Cmd + . )":(this.title=this.title+" ( Ctrl + . )",this.shortcut="ctrl+."),e.prototype._init.call(this)}});return l.addons.actions.ul=o,o});
//# sourceMappingURL=../../sourcemaps/addons/actions/UnorderListAction.js.map
