/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../Wordpad","../Button","./CodePopover"],function(t,e,o,n,i){var r=n.inherit({});return r.prototype.name="code",r.prototype.icon="code",r.prototype.htmlTag="pre",r.prototype.disableTag="ul, ol, table",r.prototype._init=function(){var e;return n.prototype._init.call(this),this.editor.on("decorate",(e=this,function(o,n){return n.find("pre").each(function(o,n){return e.decorate(t(n))})})),this.editor.on("undecorate",function(e){return function(o,n){return n.find("pre").each(function(o,n){return e.undecorate(t(n))})}}(this))},r.prototype.render=function(){var t;return t=1<=arguments.length?Array.prototype.slice.call(arguments,0):[],n.prototype.render.apply(this,t),this.popover=new i({button:this})},r.prototype._checkMode=function(){var e;return e=this.editor.editable.selection.range(),t(e.cloneContents()).find(this.editor.editable.util.blockNodes.join(","))>0||e.collapsed&&0===this.editor.editable.selection.startNodes().filter("code").length?(this.inlineMode=!1,this.htmlTag="pre"):(this.inlineMode=!0,this.htmlTag="code")},r.prototype._status=function(){if(this._checkMode(),n.prototype._status.call(this),!this.inlineMode)return this.active?this.popover.show(this.node):this.popover.hide()},r.prototype.decorate=function(t){var e,o,n,i;if((e=t.find("> code")).length>0&&(o=null!=(n=e.attr("class"))&&null!=(i=n.match(/lang-(\S+)/))?i[1]:void 0,e.contents().unwrap(),o))return t.attr("data-lang",o)},r.prototype.undecorate=function(e){var o,n;return n=e.attr("data-lang"),o=t("<code/>"),n&&-1!==n&&o.addClass("lang-"+n),e.wrapInner(o).removeAttr("data-lang")},r.prototype.command=function(){return this.inlineMode?this._inlineCommand():this._blockCommand()},r.prototype._blockCommand=function(){return this.editor.editable.blockCode(this.htmlTag,this.disableTag)},r.prototype._inlineCommand=function(){return this.editor.editable.inlineCode(this.active)},o.Toolbar.addButton(r),r});
//# sourceMappingURL=../../sourcemaps/removing/buttons/CodeButton.js.map
