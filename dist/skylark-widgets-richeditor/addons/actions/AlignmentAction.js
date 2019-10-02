/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-domx-query","../Toolbar","../RichEditor","skylark-widgets-base/Action","../i18n"],function(t,e,i,n,a){var l=n.inherit({_construct:function(){n.prototype._construct.apply(this,["alignment",{icon:"align-left",htmlTag:"p, h1, h2, h3, h4, td, th",menu:[{name:"left",text:a.translate("alignLeft"),icon:"align-left",param:"left"},{name:"center",text:a.translate("alignCenter"),icon:"align-center",param:"center"},{name:"right",text:a.translate("alignRight"),icon:"align-right",param:"right"}]}])},_init:function(){return n.prototype._init.call(this)},_exectute:function(t){return this.editable.alignment(t,this.htmlTag)}});return l.prototype.setActive=function(t,e){return null==e&&(e="left"),"left"!==e&&"center"!==e&&"right"!==e&&(e="left"),"left"===e?n.prototype.setActive.call(this,!1):n.prototype.setActive.call(this,t),this.el.removeClass("align-left align-center align-right"),t&&this.el.addClass("align-"+e),this.setIcon("align-"+e),this.menuEl.find(".menu-item").show().end().find(".menu-item-"+e).hide()},l.prototype._status=function(){var t=this.editor.editable.status("alignment",this.htmlTag);return t?(this.setDisabled(!1),this.setActive(!0,t)):(this.setDisabled(!0),this.setActive(!1))},i.addons.actions.alignment=l});
//# sourceMappingURL=../../sourcemaps/addons/actions/AlignmentAction.js.map
