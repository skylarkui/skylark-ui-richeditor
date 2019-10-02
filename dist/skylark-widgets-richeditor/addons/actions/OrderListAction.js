/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../RichEditor","./ListAction"],function(t,i,o,l){var e=l.inherit({type:"ol",name:"ol",icon:"list-ol",htmlTag:"ol",shortcut:"cmd+/",_init:function(){return this.editor.editable.util.os.mac?this.title=this.title+" ( Cmd + / )":(this.title=this.title+" ( ctrl + / )",this.shortcut="ctrl+/"),l.prototype._init.call(this)}});return o.addons.actions.ol=e});
//# sourceMappingURL=../../sourcemaps/addons/actions/OrderListAction.js.map
