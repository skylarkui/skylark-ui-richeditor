define([
  "skylark-domx-query",
  "../Toolbar",
  "../RichEditor",
  "skylark-widgets-base/Action",
  "../i18n"
],function($,Toolbar,RichEditor,Action,i18n){ 
   var AlignmentAction = Action.inherit({
      _construct : function() {
        Action.prototype._construct.apply(this,["alignment",{
          icon : 'align-left',
          htmlTag : 'p, h1, h2, h3, h4, td, th',
          menu : [
            {
              name: 'left',
              text: i18n.translate('alignLeft'),
              icon: 'align-left',
              param: 'left'
            }, {
              name: 'center',
              text: i18n.translate('alignCenter'),
              icon: 'align-center',
              param: 'center'
            }, {
              name: 'right',
              text: i18n.translate('alignRight'),
              icon: 'align-right',
              param: 'right'
            }
          ]    

        }]);
      },


      _init : function() {

        return Action.prototype._init.call(this);
      },

      _exectute : function(align) {
        return this.editable.alignment(align,this.htmlTag);
      }
    });




  AlignmentAction.prototype.setActive = function(active, align) {
    if (align == null) {
      align = 'left';
    }
    if (align !== 'left' && align !== 'center' && align !== 'right') {
      align = 'left';
    }
    if (align === 'left') {
      Action.prototype.setActive.call(this, false);
    } else {
      Action.prototype.setActive.call(this, active);
    }
    this.el.removeClass('align-left align-center align-right');
    if (active) {
      this.el.addClass('align-' + align);
    }
    this.setIcon('align-' + align);
    return this.menuEl.find('.menu-item').show().end().find('.menu-item-' + align).hide();
  };

  AlignmentAction.prototype._status = function() {
    var value = this.editor.editable.status("alignment",this.htmlTag);
    if (value) {
      this.setDisabled(false);
      return this.setActive(true, value);
    } else {
      this.setDisabled(true);
      return this.setActive(false);
    }    
  };


  return RichEditor.addons.actions.alignment = AlignmentAction;
});