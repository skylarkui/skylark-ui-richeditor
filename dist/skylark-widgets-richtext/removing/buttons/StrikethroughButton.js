/**
 * skylark-widgets-richtext - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richtext/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../RichEditor","../Button"],function(t,e,r,o){var i=o.inherit({});return i.prototype.name="strikethrough",i.prototype.icon="strikethrough",i.prototype.htmlTag="strike",i.prototype.disableTag="pre",i.prototype._activeStatus=function(){var t;return t=this.editor.editable.isActive("strikethrough"),this.setActive(t),this.active},i.prototype.command=function(){return this.editor.editable.strikethrough()},r.Toolbar.addButton(i),i});
//# sourceMappingURL=../../sourcemaps/removing/buttons/StrikethroughButton.js.map
