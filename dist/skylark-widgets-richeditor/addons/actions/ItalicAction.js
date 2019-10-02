/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../RichEditor","skylark-widgets-base/Action"],function(t,i,e,a){var r=a.inherit({name:"italic",icon:"italic",htmlTag:"i",disableTag:"pre",shortcut:"cmd+i",_init:function(){return this.editor.editable.util.os.mac?this.title=this.title+" ( Cmd + i )":(this.title=this.title+" ( Ctrl + i )",this.shortcut="ctrl+i"),a.prototype._init.call(this)},_activeStatus:function(){var t;return t=this.editor.editable.isActive("italic"),this.setActive(t),this.active},_execute:function(){return this.editor.editable.italic()}});return e.addons.actions.italic=r,r});
//# sourceMappingURL=../../sourcemaps/addons/actions/ItalicAction.js.map
