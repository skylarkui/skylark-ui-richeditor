/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../RichEditor","./ListButton"],function(t,o,i,r){var e=r.inherit({});return e.prototype.type="ul",e.prototype.name="ul",e.prototype.icon="list-ul",e.prototype.htmlTag="ul",e.prototype.shortcut="cmd+.",e.prototype._init=function(){return this.editor.editable.util.os.mac?this.title=this.title+" ( Cmd + . )":(this.title=this.title+" ( Ctrl + . )",this.shortcut="ctrl+."),r.prototype._init.call(this)},i.Toolbar.addButton(e),e});
//# sourceMappingURL=../../sourcemaps/removing/buttons/UnorderListButton.js.map