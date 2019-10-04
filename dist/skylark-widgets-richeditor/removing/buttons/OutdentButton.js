/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../RichEditor","../Button"],function(t,o,n,i){var e=i.inherit({});return e.prototype.name="outdent",e.prototype.icon="outdent",e.prototype._init=function(){var t;return t=!1===this.editor.opts.tabIndent?"":" (Shift + Tab)",this.title=this._t(this.name)+t,i.prototype._init.call(this)},e.prototype._status=function(){},e.prototype.command=function(){return this.editor.editable.outdent()},n.Toolbar.addButton(e),e});
//# sourceMappingURL=../../sourcemaps/removing/buttons/OutdentButton.js.map
