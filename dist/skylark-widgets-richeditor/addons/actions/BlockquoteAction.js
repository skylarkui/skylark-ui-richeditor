/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
define(["skylark-utils-dom/query","../Toolbar","../RichEditor","skylark-widgets-base/Action"],function(e,t,o,i){var a=i.inherit({name:"blockquote",icon:"quote-left",htmlTag:"blockquote",disableTag:"pre, table",_execute:function(){return this.editor.editable.blockquote(this.htmlTag,this.disableTag)}});return o.addons.actions.blockquote=a,a});
//# sourceMappingURL=../../sourcemaps/addons/actions/BlockquoteAction.js.map
