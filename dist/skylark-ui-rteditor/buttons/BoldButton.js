/**
 * skylark-ui-rteditor - The skylark rteditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-rteditor/
 * @license MIT
 */
define(["skylark-utils-dom/query","../Toolbar","../RichEditor","../Button"],function(t,i,o,e){var r=e.inherit({});return r.prototype.name="bold",r.prototype.icon="bold",r.prototype.htmlTag="b, strong",r.prototype.disableTag="pre",r.prototype.shortcut="cmd+b",r.prototype._init=function(){return this.editor.editable.util.os.mac?this.title=this.title+" ( Cmd + b )":(this.title=this.title+" ( Ctrl + b )",this.shortcut="ctrl+b"),e.prototype._init.call(this)},r.prototype._activeStatus=function(){var t;return t=this.editor.editable.isActive("bold"),this.setActive(t),this.active},r.prototype.command=function(){return this.editor.editable.bold()},o.Toolbar.addButton(r),r});
//# sourceMappingURL=../sourcemaps/buttons/BoldButton.js.map
