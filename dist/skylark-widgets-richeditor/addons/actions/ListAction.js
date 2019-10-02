/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-utils-dom/noder","skylark-domx-query","../Toolbar","../RichEditor","skylark-widgets-base/Action"],function(t,e,i,r,o){var a=o.inherit({});return a.prototype.type="",a.prototype.disableTag="pre, table",a.prototype.command=function(t){return this.editor.editable.list(this.type,t,this.disableTag)},a});
//# sourceMappingURL=../../sourcemaps/addons/actions/ListAction.js.map
