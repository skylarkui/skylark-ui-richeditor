/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../RichEditor","skylark-widgets-base/Action"],function(t,e,i,r){var s=r.inherit({name:"strikethrough",icon:"strikethrough",htmlTag:"strike",disableTag:"pre",_activeStatus:function(){var t;return t=this.editor.editable.isActive("strikethrough"),this.setActive(t),this.active},_execute:function(){return this.editor.editable.strikethrough()}});return i.addons.actions.strikethrough=s});
//# sourceMappingURL=../../sourcemaps/addons/actions/StrikethroughAction.js.map
