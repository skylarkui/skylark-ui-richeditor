/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-utils-dom/query","skylark-widgets-swt/Toolbar"],function(t,r,o){var i=o.inherit({pluginName:"lark.richeditor.toolbar",_construct:function(t,r){this.editor=t,o.prototype._construct.call(this,r)},_init:function(){o.prototype._init.call(this),this._render()}});return i.prototype._render=function(){var t,o,i,n;for(this.buttons=[],this.wrapper=r(this._elm).prependTo(this.editor.wrapper),t=0,o=(n=this.opts.toolbar).length;t<o;t++)if("|"!==(i=n[t])){if(!this.constructor.buttons[i])throw new Error("richeditor: invalid toolbar button "+i);this.buttons.push(new this.constructor.buttons[i]({toolbar:this,editor:this.editor}))}else this.addSeparator();if(this.opts.toolbarHidden)return this.wrapper.hide()},i.prototype.findButton=function(t){var r;return null!=(r=this.list.find(".toolbar-item-"+t).data("button"))?r:null},i.addButton=function(t){return this.buttons[t.prototype.name]=t},i.buttons={},i});
//# sourceMappingURL=sourcemaps/Toolbar.js.map
