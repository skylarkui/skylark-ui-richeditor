/**
 * skylark-ui-rteditor - The skylark rteditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-rteditor/
 * @license MIT
 */
define(["skylark-utils-dom/query","../Toolbar","../RichEditor","../Button"],function(t,e,i,r){var o=r.inherit({});return o.prototype.name="underline",o.prototype.icon="underline",o.prototype.htmlTag="u",o.prototype.disableTag="pre",o.prototype.shortcut="cmd+u",o.prototype.render=function(){return this.editor.editable.util.os.mac?this.title=this.title+" ( Cmd + u )":(this.title=this.title+" ( Ctrl + u )",this.shortcut="ctrl+u"),r.prototype.render.call(this)},o.prototype._activeStatus=function(){var t;return t=this.editor.editable.isActive("underline"),this.setActive(t),this.active},o.prototype.command=function(){return this.editor.editable.underline()},i.Toolbar.addButton(o),o});
//# sourceMappingURL=../sourcemaps/buttons/UnderlineButton.js.map
