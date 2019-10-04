define([
  "skylark-langx/langx",
  "skylark-utils-dom/query",
  "skylark-domx-contents/Editable",
  "skylark-widgets-base/Widget",
  "./Toolbar",
  "./uploader",
  "./i18n",
  "./addons"

],function(langx, $, Editable,Widget,Toolbar,uploader,i18n,addons){ 

  var RichEditor = Widget.inherit({
      options : {
        srcNodeRef: null,
        placeholder: '',
        defaultImage: 'images/image.png',
        params: {},
        upload: false,
        template : "<div class=\"richeditor\">\n  <div class=\"richeditor-wrapper\">\n    <div class=\"richeditor-placeholder\"></div>\n    <div class=\"richeditor-body\" contenteditable=\"true\">\n    </div>\n  </div>\n</div>"
      },


    _init : function() {
      this._actions = [];

      //this.opts = langx.extend({}, this.opts, opts);
      this.opts = this.options;

      var e, editor, uploadOpts;
      this.textarea = $(this.opts.srcNodeRef);

      this.opts.placeholder = this.opts.placeholder || this.textarea.attr('placeholder');

      if (!this.textarea.length) {
        throw new Error('richeditor: param textarea is required.');
        return;
      }

      editor = this.textarea.data('richeditor');
      if (editor != null) {
        editor.destroy();
      }
      this.id = ++RichEditor.count;
      this._render();


      var self = this;
      this.editable = new Editable(this._elm,{
        classPrefix : "richeditor-",
        textarea : this.textarea,
        body : this.body
      });

      // TODO
      this.editable.on("all",function(e,data){
        return self.trigger(e.type,data);
      });

      if (this.opts.upload && uploader) {
        uploadOpts = typeof this.opts.upload === 'object' ? this.opts.upload : {};
        this.uploader = uploader(uploadOpts);
      }

      this.toolbar = new Toolbar(this,{
        toolbar: this.opts.toolbar,
        toolbarFloat:  this.opts.toolbarFloat,
        toolbarHidden:  this.opts.toolbarHidden,
        toolbarFloatOffset:  this.opts.toolbarFloatOffset

      });

      if (this.opts.placeholder) {
        this.on('valuechanged', function() {
          return self._placeholder();
        });
      }
      this.setValue(this.textarea.val().trim() || '');
      if (this.textarea.attr('autofocus')) {
        return self.focus();
      }


    }
  });

  RichEditor.prototype.triggerHandler =  RichEditor.prototype.trigger = function(type,data) {
    var args, ref;
    args = [type];
    if (data) {
      args = args.concat(data);
    }
    langx.Evented.prototype.trigger.apply(this, args);
    return this;
  };


  //RichEditor.connect(Util);

  //RichEditor.connect(InputManager);

  //RichEditor.connect(Selection);

  //RichEditor.connect(UndoManager);

  //RichEditor.connect(Keystroke);

  //RichEditor.connect(Formatter);

  //RichEditor.connect(Toolbar);

  //RichEditor.connect(Indentation);

  //RichEditor.connect(Clipboard);

  RichEditor.count = 0;


  RichEditor.prototype._render = function() {
    var key, ref, results, val;

    //this.el = $(this._tpl).insertBefore(this.textarea);
    this.el = $(this._elm).insertBefore (this.textarea);

    this.wrapper = this.el.find('.richeditor-wrapper');
    this.body = this.wrapper.find('.richeditor-body');
    this.placeholderEl = this.wrapper.find('.richeditor-placeholder').append(this.opts.placeholder);
    this.el.data('richeditor', this);
    this.wrapper.append(this.textarea);
    this.textarea.data('richeditor', this).blur();
    this.body.attr('tabindex', this.textarea.attr('tabindex'));

    if (this.opts.params) {
      ref = this.opts.params;
      results = [];
      for (key in ref) {
        val = ref[key];
        results.push($('<input/>', {
          type: 'hidden',
          name: key,
          value: val
        }).insertAfter(this.textarea));
      }
      return results;
    }
  };

  RichEditor.prototype._placeholder = function() {
    var children;
    children = this.body.children();
    if (children.length === 0 || (children.length === 1 && this.util.isEmptyNode(children) && parseInt(children.css('margin-left') || 0) < this.opts.indentWidth)) {
      return this.placeholderEl.show();
    } else {
      return this.placeholderEl.hide();
    }
  };

  RichEditor.prototype.setValue = function(val) {
    this.hidePopover();

    this.editable.setValue(val);

    return this.trigger('valuechanged');
  };

  RichEditor.prototype.getValue = function() {
    return this.editable.getValue();
  };

  RichEditor.prototype.focus = function() {
    return this.editable.focus();
  };

  RichEditor.prototype.blur = function() {
    return this.editable.blur();
  };

  RichEditor.prototype.findAction = function(name) {
    if (!this._actions[name]) {
      if (!this.constructor.addons.actions[name]) {
        throw new Error("richeditor: invalid action " + name);
      }

      this._actions[name] = new this.constructor.addons.actions[name]({
        editor: this
      });

    }

    return this._actions[name];
  };

  RichEditor.prototype.hidePopover = function() {
    return this.el.find('.richeditor-popover').each(function(i, popover) {
      popover = $(popover).data('popover');
      if (popover.active) {
        return popover.hide();
      }
    });
  };

  RichEditor.prototype.destroy = function() {
    this.triggerHandler('destroy');
    this.textarea.closest('form').off('.richeditor .richeditor-' + this.id);
    this.selection.clear();
    this.inputManager.focused = false;
    this.textarea.insertBefore(this.el).hide().val('').removeData('richeditor');
    this.el.remove();
    $(document).off('.richeditor-' + this.id);
    $(window).off('.richeditor-' + this.id);
    return this.off();
  };


  RichEditor.Toolbar = Toolbar;

  RichEditor.i18n = i18n;

  RichEditor.addons = addons;


  return RichEditor;

});
