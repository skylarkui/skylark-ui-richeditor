/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../RichEditor","skylark-widgets-base/Action"],function(t,i,n,e){var o=e.inherit({name:"outdent",icon:"outdent",_init:function(){var t;return t=!1===this.editor.opts.tabIndent?"":" (Shift + Tab)",this.title=this._t(this.name)+t,e.prototype._init.call(this)},_status:function(){},_execute:function(){return this.editor.editable.outdent()}});return n.addons.actions.outdent=o,o});
//# sourceMappingURL=../../sourcemaps/addons/actions/OutdentAction.js.map
