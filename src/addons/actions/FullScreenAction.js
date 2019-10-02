define([
  "skylark-domx-query",
  "../Toolbar",
  "../RichEditor",
  "skylark-widgets-base/Action",
  "../i18n"
],function($,Toolbar,RichEditor,Action,i18n){ 

  
  var FullScrennAction = Action.inherit({
    name : 'fullscreen',

    needFocus : false,

    _init : function() {
      Action.prototype._init.call(this);

      this.window = $(window);
      this.body = $('body');
      this.editable = this.editor.body;
      return this.toolbar = this.toolbar.wrapper;
    },

    iconClassOf : function() {
      return 'icon-fullscreen';
    },


    status : function() {
      return this.setActive(this.body.hasClass(this.constructor.cls));
    },

    _execute : function() {
      var editablePadding, isFullscreen;
      this.body.toggleClass(this.constructor.cls);
      isFullscreen = this.body.hasClass(this.constructor.cls);
      if (isFullscreen) {
        editablePadding = this.editable.outerHeight() - this.editable.height();
        this.window.on("resize.richeditor-fullscreen-" + this.editor.id, (function(_this) {
          return function() {
            return _this._resize({
              height: _this.window.height() - _this.toolbar.outerHeight() - editablePadding
            });
          };
        })(this)).resize();
      } else {
        this.window.off("resize.richeditor-fullscreen-" + this.editor.id).resize();
        this._resize({
          height: 'auto'
        });
      }
      return this.setActive(isFullscreen);
    },

    _resize : function(size) {
      return this.editable.height(size.height);
    }
  });

  FullScrennAction.cls = 'richeditor-fullscreen';

  FullScrennAction.i18n = {
    'zh-CN': {
      fullscreen: '全屏'
    }
  };


  RichEditor.addons.actions.fullscreen = FullScrennAction; 


  return FullScrennAction;

 }); 