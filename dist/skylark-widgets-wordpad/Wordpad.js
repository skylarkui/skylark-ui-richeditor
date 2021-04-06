/**
 * skylark-widgets-wordpad - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-wordpad/
 * @license MIT
 */
define(["skylark-langx/skylark","skylark-langx/langx","skylark-domx-query","skylark-domx-contents/Editable","skylark-widgets-base/Widget","skylark-widgets-toolbars/Toolbar","./uploader","./i18n","./addons"],function(t,e,a,i,o,r,s,n,d){var l=o.inherit({klassName:"Wordpad",pluginName:"lark.wordpad",options:{classes:{icons:{html:"fa fa-html5",header:"fa fa-header",bold:"fa fa-bold",italic:"fa fa-italic",underline:"fa fa-underline",strikethrough:"fa fa-strikethrough",fontScale:"fa fa-text-height",fontColor:"fa fa-font",mark:"fa fa-pencil",blockquote:"fa fa-quote-right",listul:"fa fa-list-ul",listol:"fa fa-list-ol",code:"fa fa-code",table:"fa fa-table",fullscreen:"fa fa-expand",emoji:"fa fa-smile-o",link:"fa fa-link",image:"fa fa-picture-o",video:"fa fa-video-camera",hr:"fa fa-minus",indent:"fa fa-indent",outdent:"fa fa-dedent",alignLeft:"fa fa-align-left",alignCenter:"fa fa-align-center",alignRight:"fa fa-align-right",alignJustify:"fa fa-align-justify"}},srcNodeRef:null,placeholder:"",addons:{actions:{image:{placeholderImage:"images/image.png"},video:{placeholderPoster:"images/poster.jpg"}},toolbar:{items:{emoji:{}}}},params:{},upload:!1,template:'<div class="lark-wordpad">\n  <div class="wordpad-wrapper">\n    <div class="wordpad-placeholder"></div>\n    <div class="wordpad-body" contenteditable="true">\n    </div>\n  </div>\n</div>'},_init:function(){var t,e;if(this._actions=[],this.opts=this.options,this.textarea=a(this.options.srcNodeRef),this.options.placeholder=this.options.placeholder||this.textarea.attr("placeholder"),!this.textarea.length)throw new Error("Wordpad: param textarea is required.");null!=(t=this.textarea.data("wordpad"))&&t.destroy(),this.id=++l.count,this._render();var o=this;this.editable=new i(this._elm,{classPrefix:"lark-wordpad-",textarea:this.textarea,body:this.body}),this.editable.on("all",function(t,e){return o.trigger(t.type,e)}),this.options.upload&&s&&(e="object"==typeof this.options.upload?this.options.upload:{},this.uploader=s(e));for(var n=[],h=this.options.toolbar,p=0,f=h.length;p<f;p++){var c=h[p];if("|"!==c){var u=this.findAction(c),g=d.toolbar.items[c];u.toolItemCtor=g,n.push(u)}else n.push({name:"|"})}if(this.toolbar=new r({actions:n,classes:{icons:this.options.classes.icons}}),this.toolbar.mount(this._elm,"prepend"),this.options.placeholder&&this.on("valuechanged",function(){return o._placeholder()}),this.setValue(this.textarea.val().trim()||""),this.textarea.attr("autofocus"))return o.focus()}});return l.prototype.triggerHandler=l.prototype.trigger=function(t,a){var i;return i=[t],a&&(i=i.concat(a)),e.Evented.prototype.trigger.apply(this,i),this},l.count=0,l.prototype._render=function(){var t,e,i,o;if(this.el=a(this._elm).insertBefore(this.textarea),this.wrapper=this.el.find(".wordpad-wrapper"),this.body=this.wrapper.find(".wordpad-body"),this.placeholderEl=this.wrapper.find(".wordpad-placeholder").append(this.options.placeholder),this.el.data("wordpad",this),this.wrapper.append(this.textarea),this.textarea.data("wordpad",this).blur(),this.body.attr("tabindex",this.textarea.attr("tabindex")),this.options.params){for(t in i=[],e=this.options.params)o=e[t],i.push(a("<input/>",{type:"hidden",name:t,value:o}).insertAfter(this.textarea));return i}},l.prototype._placeholder=function(){var t;return 0===(t=this.body.children()).length||1===t.length&&this.editable.util.isEmptyNode(t)&&parseInt(t.css("margin-left")||0)<this.options.indentWidth?this.placeholderEl.show():this.placeholderEl.hide()},l.prototype.setValue=function(t){return this.hidePopover(),this.editable.setValue(t),this.trigger("valuechanged")},l.prototype.getValue=function(){return this.editable.getValue()},l.prototype.sync=function(){return this.editable.sync(),this},l.prototype.focus=function(){return this.editable.focus(),this},l.prototype.blur=function(){return this.editable.blur(),this},l.prototype.findAction=function(t){var e=this._actions[t];if(!e){if(!this.constructor.addons.actions[t])throw new Error("Wordpad: invalid action "+t);e=this._actions[t]=new this.constructor.addons.actions[t]({editor:this}),this._actions.push(e)}return e},l.prototype.hidePopover=function(){return this.el.find(".wordpad-popover").each(function(t,e){if((e=a(e).data("popover")).active)return e.hide()})},l.prototype.destroy=function(){return this.trigger("destroy"),this.textarea.closest("form").off(".Wordpad .wordpad-"+this.id),this.selection.clear(),this.inputManager.focused=!1,this.textarea.insertBefore(this.el).hide().val("").removeData("wordpad"),this.el.remove(),a(document).off(".wordpad-"+this.id),a(window).off(".wordpad-"+this.id),this.off()},l.Toolbar=r,l.i18n=n,l.addons=d,t.attach("widgets.Wordpad",l)});
//# sourceMappingURL=sourcemaps/Wordpad.js.map
