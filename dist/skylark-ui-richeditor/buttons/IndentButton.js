/**
 * skylark-ui-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-richeditor/
 * @license MIT
 */
define(["skylark-utils-dom/query","../Toolbar","../RichEditor","../Button"],function(t,n,o,i){var e=i.inherit({});return e.prototype.name="indent",e.prototype.icon="indent",e.prototype._init=function(){var t;return t=!1===this.editor.opts.tabIndent?"":" (Tab)",this.title=this._t(this.name)+t,i.prototype._init.call(this)},e.prototype._status=function(){},e.prototype.command=function(){return this.editor.editable.indent()},o.Toolbar.addButton(e),e});
//# sourceMappingURL=../sourcemaps/buttons/IndentButton.js.map