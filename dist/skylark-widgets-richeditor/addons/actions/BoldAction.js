/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../RichEditor","skylark-widgets-base/Action"],function(t,i,e,o){var r=o.inherit({name:"bold",icon:"bold",htmlTag:"b, strong",disableTag:"pre",shortcut:"cmd+b",_init:function(){return this.editor.editable.util.os.mac?this.title=this.title+" ( Cmd + b )":(this.title=this.title+" ( Ctrl + b )",this.shortcut="ctrl+b"),o.prototype._init.call(this)},_activeStatus:function(){var t;return t=this.editor.editable.isActive("bold"),this.setActive(t),this.active},_execute:function(){return this.editor.editable.bold()}});return e.addons.actions.bold=r,r});
//# sourceMappingURL=../../sourcemaps/addons/actions/BoldAction.js.map
