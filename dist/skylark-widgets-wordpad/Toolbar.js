/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-langx/langx","skylark-domx-query","skylark-domx-panels/Toolbar","skylark-widgets-base/Widget","./ToolButton"],function(t,o,n,a,i,l){var r=a.inherit({klassName:"Toolbar",pluginName:"lark.wordpad.toolbar",options:{template:'<div class="domx-toolbar"><ul></ul></div>'},_construct:function(t,o){a.prototype._construct.call(this,t,o)},_init:function(){this._xtoolbar=n.instantiate(this._elm,this.options),this.buttons=[];for(var t=this.options.actions,o=0;o<t.length;o++){var a=t[o];if("|"!==a.name){var l=a.toolItemCtor;l||(l=i),this.buttons.push(new l({action:a,toolbar:this}))}else this._xtoolbar.addSeparator()}},addToolItem:function(t){this._xtoolbar.addToolItem(t)},findButton:function(t){var o;return null!=(o=this._xtoolbar.list.find(".toolbar-item-"+t).data("button"))?o:null}});return r.addButton=function(t){return this.buttons[t.prototype.name]=t},r.buttons={},r});
//# sourceMappingURL=sourcemaps/Toolbar.js.map
