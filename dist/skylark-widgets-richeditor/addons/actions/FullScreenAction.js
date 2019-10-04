/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-domx-query","../../addons","../../Action","../../i18n"],function(i,t,e,s){var r=e.inherit({name:"fullscreen",needFocus:!1,_init:function(){e.prototype._init.call(this),this.window=i(window),this.body=i("body"),this.editable=this.editor.body},iconClassOf:function(){return"icon-fullscreen"},status:function(){return this.setActive(this.body.hasClass(this.constructor.cls))},_execute:function(){var i,t,e;return this.body.toggleClass(this.constructor.cls),(t=this.body.hasClass(this.constructor.cls))?(i=this.editable.outerHeight()-this.editable.height(),this.window.on("resize.richeditor-fullscreen-"+this.editor.id,(e=this,function(){return e._resize({height:e.window.height()-e.editor.toolbar.outerHeight()-i})})).resize()):(this.window.off("resize.richeditor-fullscreen-"+this.editor.id).resize(),this._resize({height:"auto"})),this.setActive(t)},_resize:function(i){return this.editable.height(i.height)}});return r.cls="richeditor-fullscreen",r.i18n={"zh-CN":{fullscreen:"全屏"}},t.actions.fullscreen=r,r});
//# sourceMappingURL=../../sourcemaps/addons/actions/FullScreenAction.js.map
