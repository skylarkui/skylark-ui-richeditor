/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../Action","../../i18n"],function(t,e,i,s){var o=i.inherit({name:"fullscreen",icon:"fullscreen",needFocus:!1,_init:function(){i.prototype._init.call(this),this.window=t(window),this.body=t("body"),this.editable=this.editor.body},status:function(){return this.setActive(this.body.hasClass(this.constructor.cls))},_execute:function(){var e,i,s;return this.body.toggleClass(this.constructor.cls),(i=this.body.hasClass(this.constructor.cls))?(e=this.editable.outerHeight()-this.editable.height(),this.window.on("resize.wordpad-fullscreen-"+this.editor.id,(s=this,function(){return s._resize({height:s.window.height()-t(s.editor.toolbar._elm).outerHeight()-e})})).resize()):(this.window.off("resize.wordpad-fullscreen-"+this.editor.id).resize(),this._resize({height:"auto"})),this.setActive(i)},_resize:function(t){return this.editable.height(t.height)}});return o.cls="wordpad-fullscreen",o.i18n={"zh-CN":{fullscreen:"全屏"}},e.actions.fullscreen=o,o});
//# sourceMappingURL=../../sourcemaps/addons/actions/FullScreenAction.js.map
