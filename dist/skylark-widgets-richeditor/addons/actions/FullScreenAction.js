/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../RichEditor","skylark-widgets-base/Action","../i18n"],function(t,i,e,s,r){var o=s.inherit({name:"fullscreen",needFocus:!1,_init:function(){return s.prototype._init.call(this),this.window=t(window),this.body=t("body"),this.editable=this.editor.body,this.toolbar=this.toolbar.wrapper},iconClassOf:function(){return"icon-fullscreen"},status:function(){return this.setActive(this.body.hasClass(this.constructor.cls))},_execute:function(){var t,i,e;return this.body.toggleClass(this.constructor.cls),(i=this.body.hasClass(this.constructor.cls))?(t=this.editable.outerHeight()-this.editable.height(),this.window.on("resize.richeditor-fullscreen-"+this.editor.id,(e=this,function(){return e._resize({height:e.window.height()-e.toolbar.outerHeight()-t})})).resize()):(this.window.off("resize.richeditor-fullscreen-"+this.editor.id).resize(),this._resize({height:"auto"})),this.setActive(i)},_resize:function(t){return this.editable.height(t.height)}});return o.cls="richeditor-fullscreen",o.i18n={"zh-CN":{fullscreen:"全屏"}},e.addons.actions.fullscreen=o,o});
//# sourceMappingURL=../../sourcemaps/addons/actions/FullScreenAction.js.map
