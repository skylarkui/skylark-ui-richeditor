/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","skylark-domx-panels/Toolbar","./ToolButton","./addons"],function(t,o,r,n,i){var e=r.inherit({pluginName:"lark.wordpad.toolbar",_construct:function(t,o){this.editor=t;var n=this.$('<div class="domx-toolbar"><ul></ul></div>')[0];r.prototype._construct.call(this,n,o),this._render()}});return e.prototype._render=function(){var t,r,e,a;for(this.buttons=[],this.wrapper=o(this._elm).prependTo(this.editor.wrapper),t=0,r=(a=this.opts.toolbar).length;t<r;t++)if("|"!==(e=a[t])){var s=this.editor.findAction(e),l=i.toolbar.items[e];l||(l=n),this.buttons.push(new l({action:s,toolbar:this}))}else this.addSeparator();if(this.opts.toolbarHidden)return this.wrapper.hide()},e.prototype.findButton=function(t){var o;return null!=(o=this.list.find(".toolbar-item-"+t).data("button"))?o:null},e.addButton=function(t){return this.buttons[t.prototype.name]=t},e.buttons={},e});
//# sourceMappingURL=sourcemaps/Toolbar.js.map
