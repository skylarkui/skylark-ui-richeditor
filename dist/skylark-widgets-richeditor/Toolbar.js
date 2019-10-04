/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-utils-dom/query","skylark-widgets-swt/Toolbar","./ToolButton","./addons"],function(t,o,r,i,n){var e=r.inherit({pluginName:"lark.richeditor.toolbar",_construct:function(t,o){this.editor=t,r.prototype._construct.call(this,o)},_init:function(){r.prototype._init.call(this),this._render()}});return e.prototype._render=function(){var t,r,e,s;for(this.buttons=[],this.wrapper=o(this._elm).prependTo(this.editor.wrapper),t=0,r=(s=this.opts.toolbar).length;t<r;t++)if("|"!==(e=s[t])){var a=this.editor.findAction(e),l=n.toolbar.items[e];l||(l=i),this.buttons.push(new l({action:a,toolbar:this}))}else this.addSeparator();if(this.opts.toolbarHidden)return this.wrapper.hide()},e.prototype.findButton=function(t){var o;return null!=(o=this.list.find(".toolbar-item-"+t).data("button"))?o:null},e.addButton=function(t){return this.buttons[t.prototype.name]=t},e.buttons={},e});
//# sourceMappingURL=sourcemaps/Toolbar.js.map