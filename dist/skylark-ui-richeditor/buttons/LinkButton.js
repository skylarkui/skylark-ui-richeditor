/**
 * skylark-ui-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylarkui/skylark-ui-richeditor/
 * @license MIT
 */
define(["skylark-utils-dom/query","../Toolbar","../RichEditor","../Button","../i18n","./LinkPopover"],function(t,o,e,r,i,p){var n=r.inherit({});return n.prototype.name="link",n.prototype.icon="link",n.prototype.htmlTag="a",n.prototype.disableTag="pre",n.prototype.render=function(){var t;return t=1<=arguments.length?Array.prototype.slice.call(arguments,0):[],r.prototype.render.apply(this,t),this.popover=new p({button:this})},n.prototype._status=function(){return r.prototype._status.call(this),this.active&&!this.editor.editable.selection.rangeAtEndOf(this.node)?this.popover.show(this.node):this.popover.hide()},n.prototype.command=function(){var t;return this.active&&this.popover.one("popovershow",(t=this,function(){return linkText?(t.popover.urlEl.focus(),t.popover.urlEl[0].select()):(t.popover.textEl.focus(),t.popover.textEl[0].select())})),this.editor.editable.link(this.active,i.translate("linkText"))},e.Toolbar.addButton(n),n});
//# sourceMappingURL=../sourcemaps/buttons/LinkButton.js.map
