/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","skylark-domx-panels/Toolbar","skylark-widgets-base/Widget","./ToolButton","./addons"],function(t,o,r,i,n,e){var s=r.inherit({pluginName:"lark.wordpad.toolbar",_construct:function(t,o){this.editor=t;var i=this.$('<div class="domx-toolbar"><ul></ul></div>')[0];r.prototype._construct.call(this,i,o),this._render()}});return s.prototype._render=function(){var t,r,i,s;for(this.buttons=[],this.wrapper=o(this._elm).prependTo(this.editor.wrapper),t=0,r=(s=this.opts.toolbar).length;t<r;t++)if("|"!==(i=s[t])){var a=this.editor.findAction(i),l=e.toolbar.items[i];l||(l=n),this.buttons.push(new l({action:a,toolbar:this}))}else this.addSeparator();if(this.opts.toolbarHidden)return this.wrapper.hide()},s.prototype.findButton=function(t){var o;return null!=(o=this.list.find(".toolbar-item-"+t).data("button"))?o:null},s.addButton=function(t){return this.buttons[t.prototype.name]=t},s.buttons={},s});
//# sourceMappingURL=sourcemaps/Toolbar.old.js.map
