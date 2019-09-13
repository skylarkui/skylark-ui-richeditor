/**
 * skylark-widgets-richeditor - The skylark richeditor widget
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-widgets/skylark-widgets-richeditor/
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define([], function () {
    'use strict';
    var exports = {};
    var module = { exports: {} };
    define([
        'skylark-langx/langx',
        'skylark-utils-dom/query',
        'skylark-domx-contents/editable',
        './Toolbar',
        './uploader',
        './i18n'
    ], function (langx, $, editable, Toolbar, uploader, i18n) {
        var RichEditor = langx.Evented.inherit({
            init: function (opts) {
                this.opts = langx.extend({}, this.opts, opts);
                var e, editor, uploadOpts;
                this.textarea = $(this.opts.textarea);
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
                this.editable = editable(this.el, {
                    classPrefix: 'richeditor-',
                    textarea: this.textarea,
                    body: this.body
                });
                this.editable.on('all', function (e, data) {
                    return self.trigger(e.type, data);
                });
                if (this.opts.upload && uploader) {
                    uploadOpts = typeof this.opts.upload === 'object' ? this.opts.upload : {};
                    this.uploader = uploader(uploadOpts);
                }
                this.toolbar = new Toolbar(this, {
                    toolbar: this.opts.toolbar,
                    toolbarFloat: this.opts.toolbarFloat,
                    toolbarHidden: this.opts.toolbarHidden,
                    toolbarFloatOffset: this.opts.toolbarFloatOffset
                });
                if (this.opts.placeholder) {
                    this.on('valuechanged', function () {
                        return self._placeholder();
                    });
                }
                this.setValue(this.textarea.val().trim() || '');
                if (this.textarea.attr('autofocus')) {
                    return self.focus();
                }
            }
        });
        RichEditor.prototype.triggerHandler = RichEditor.prototype.trigger = function (type, data) {
            var args, ref;
            args = [type];
            if (data) {
                args = args.concat(data);
            }
            langx.Evented.prototype.trigger.apply(this, args);
            return this;
        };
        RichEditor.count = 0;
        RichEditor.prototype.opts = {
            textarea: null,
            placeholder: '',
            defaultImage: 'images/image.png',
            params: {},
            upload: false
        };
        RichEditor.prototype._tpl = '<div class="richeditor">\n  <div class="richeditor-wrapper">\n    <div class="richeditor-placeholder"></div>\n    <div class="richeditor-body" contenteditable="true">\n    </div>\n  </div>\n</div>';
        RichEditor.prototype._render = function () {
            var key, ref, results, val;
            this.el = $(this._tpl).insertBefore(this.textarea);
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
        RichEditor.prototype._placeholder = function () {
            var children;
            children = this.body.children();
            if (children.length === 0 || children.length === 1 && this.util.isEmptyNode(children) && parseInt(children.css('margin-left') || 0) < this.opts.indentWidth) {
                return this.placeholderEl.show();
            } else {
                return this.placeholderEl.hide();
            }
        };
        RichEditor.prototype.setValue = function (val) {
            this.hidePopover();
            this.editable.setValue(val);
            return this.trigger('valuechanged');
        };
        RichEditor.prototype.getValue = function () {
            return this.editable.getValue();
        };
        RichEditor.prototype.focus = function () {
            return this.editable.focus();
        };
        RichEditor.prototype.blur = function () {
            return this.editable.blur();
        };
        RichEditor.prototype.hidePopover = function () {
            return this.el.find('.richeditor-popover').each(function (i, popover) {
                popover = $(popover).data('popover');
                if (popover.active) {
                    return popover.hide();
                }
            });
        };
        RichEditor.prototype.destroy = function () {
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
        return RichEditor;
    });
    function __isEmptyObject(obj) {
        var attr;
        for (attr in obj)
            return !1;
        return !0;
    }
    function __isValidToReturn(obj) {
        return typeof obj != 'object' || Array.isArray(obj) || !__isEmptyObject(obj);
    }
    if (__isValidToReturn(module.exports))
        return module.exports;
    else if (__isValidToReturn(exports))
        return exports;
});
define("skylark-widgets-richeditor/RichEditor", function(){});

define('skylark-widgets-richeditor/i18n',[

],function(){ 

    var i18n =  {
      'zh-CN': {
        'blockquote': '引用',
        'bold': '加粗文字',
        'code': '插入代码',
        'color': '文字颜色',
        'coloredText': '彩色文字',
        'hr': '分隔线',
        'image': '插入图片',
        'externalImage': '外链图片',
        'uploadImage': '上传图片',
        'uploadFailed': '上传失败了',
        'uploadError': '上传出错了',
        'imageUrl': '图片地址',
        'imageSize': '图片尺寸',
        'imageAlt': '图片描述',
        'restoreImageSize': '还原图片尺寸',
        'uploading': '正在上传',
        'indent': '向右缩进',
        'outdent': '向左缩进',
        'italic': '斜体文字',
        'link': '插入链接',
        'linkText': '链接文字',
        'linkUrl': '链接地址',
        'linkTarget': '打开方式',
        'openLinkInCurrentWindow': '在当前窗口中打开',
        'openLinkInNewWindow': '在新窗口中打开',
        'removeLink': '移除链接',
        'ol': '有序列表',
        'ul': '无序列表',
        'strikethrough': '删除线文字',
        'table': '表格',
        'deleteRow': '删除行',
        'insertRowAbove': '在上面插入行',
        'insertRowBelow': '在下面插入行',
        'deleteColumn': '删除列',
        'insertColumnLeft': '在左边插入列',
        'insertColumnRight': '在右边插入列',
        'deleteTable': '删除表格',
        'title': '标题',
        'normalText': '普通文本',
        'underline': '下划线文字',
        'alignment': '水平对齐',
        'alignCenter': '居中',
        'alignLeft': '居左',
        'alignRight': '居右',
        'selectLanguage': '选择程序语言',
        'fontScale': '字体大小',
        'fontScaleXLarge': '超大字体',
        'fontScaleLarge': '大号字体',
        'fontScaleNormal': '正常大小',
        'fontScaleSmall': '小号字体',
        'fontScaleXSmall': '超小字体'
      },
      'en-US': {
        'blockquote': 'Block Quote',
        'bold': 'Bold',
        'code': 'Code',
        'color': 'Text Color',
        'coloredText': 'Colored Text',
        'hr': 'Horizontal Line',
        'image': 'Insert Image',
        'externalImage': 'External Image',
        'uploadImage': 'Upload Image',
        'uploadFailed': 'Upload failed',
        'uploadError': 'Error occurs during upload',
        'imageUrl': 'Url',
        'imageSize': 'Size',
        'imageAlt': 'Alt',
        'restoreImageSize': 'Restore Origin Size',
        'uploading': 'Uploading',
        'indent': 'Indent',
        'outdent': 'Outdent',
        'italic': 'Italic',
        'link': 'Insert Link',
        'linkText': 'Text',
        'linkUrl': 'Url',
        'linkTarget': 'Target',
        'openLinkInCurrentWindow': 'Open link in current window',
        'openLinkInNewWindow': 'Open link in new window',
        'removeLink': 'Remove Link',
        'ol': 'Ordered List',
        'ul': 'Unordered List',
        'strikethrough': 'Strikethrough',
        'table': 'Table',
        'deleteRow': 'Delete Row',
        'insertRowAbove': 'Insert Row Above',
        'insertRowBelow': 'Insert Row Below',
        'deleteColumn': 'Delete Column',
        'insertColumnLeft': 'Insert Column Left',
        'insertColumnRight': 'Insert Column Right',
        'deleteTable': 'Delete Table',
        'title': 'Title',
        'normalText': 'Text',
        'underline': 'Underline',
        'alignment': 'Alignment',
        'alignCenter': 'Align Center',
        'alignLeft': 'Align Left',
        'alignRight': 'Align Right',
        'selectLanguage': 'Select Language',
        'fontScale': 'Font Size',
        'fontScaleXLarge': 'X Large Size',
        'fontScaleLarge': 'Large Size',
        'fontScaleNormal': 'Normal Size',
        'fontScaleSmall': 'Small Size',
        'fontScaleXSmall': 'X Small Size'
      },

      translate : function() {
        var args, key, ref, result;
        key = arguments[0], args = 2 <= arguments.length ? Array.prototype.slice.call(arguments, 1) : [];
        result = ((ref = i18n[this.locale]) != null ? ref[key] : void 0) || '';
        if (!(args.length > 0)) {
          return result;
        }
        result = result.replace(/([^%]|^)%(?:(\d+)\$)?s/g, function(p0, p, position) {
          if (position) {
            return p + args[parseInt(position) - 1];
          } else {
            return p + args.shift();
          }
        });
        return result.replace(/%%s/g, '%s');
      }

    };

    return i18n;
});
define('skylark-widgets-richeditor/Button',[
  "skylark-langx/langx",
  "skylark-utils-dom/query",
  "./RichEditor",
  "./i18n"
],function(langx, $,RichEditor,i18n){ 
  var slice = [].slice;

  var Button = langx.Evented.inherit( {
    init : function(opts) {
      this.toolbar = opts.toolbar;
      this.editor = opts.toolbar.editor;
      this.title = i18n.translate(this.name);
      this._init();
    }
  }); 

  Button.prototype._tpl = {
    item: '<li><a tabindex="-1" unselectable="on" class="toolbar-item" href="javascript:;"><span></span></a></li>',
    menuWrapper: '<div class="toolbar-menu"></div>',
    menuItem: '<li><a tabindex="-1" unselectable="on" class="menu-item" href="javascript:;"><span></span></a></li>',
    separator: '<li><span class="separator"></span></li>'
  };

  Button.prototype.name = '';

  Button.prototype.icon = '';

  Button.prototype.title = '';

  Button.prototype.text = '';

  Button.prototype.htmlTag = '';

  Button.prototype.disableTag = '';

  Button.prototype.menu = false;

  Button.prototype.active = false;

  Button.prototype.disabled = false;

  Button.prototype.needFocus = true;

  Button.prototype.shortcut = null;


  Button.prototype._init = function() {
    var k, len, ref, tag;
    this.render();
    this.el.on('mousedown', (function(_this) {
      return function(e) {
        var exceed, noFocus, param;
        e.preventDefault();
        noFocus = _this.needFocus && !_this.editor.editable.inputManager.focused;
        if (_this.el.hasClass('disabled')) {
          return false;
        }
        if (noFocus) {
          _this.editor.focus();
        }
        if (_this.menu) {
          _this.wrapper.toggleClass('menu-on').siblings('li').removeClass('menu-on');
          if (_this.wrapper.is('.menu-on')) {
            exceed = _this.menuWrapper.offset().left + _this.menuWrapper.outerWidth() + 5 - _this.editor.wrapper.offset().left - _this.editor.wrapper.outerWidth();
            if (exceed > 0) {
              _this.menuWrapper.css({
                'left': 'auto',
                'right': 0
              });
            }
            _this.trigger('menuexpand');
          }
          return false;
        }
        param = _this.el.data('param');
        _this.command(param);
        return false;
      };
    })(this));
    this.wrapper.on('click', 'a.menu-item', (function(_this) {
      return function(e) {
        var btn, noFocus, param;
        e.preventDefault();
        btn = $(e.currentTarget);
        _this.wrapper.removeClass('menu-on');
        noFocus = _this.needFocus && !_this.editor.editable.inputManager.focused;
        if (btn.hasClass('disabled') || noFocus) {
          return false;
        }
        _this.toolbar.wrapper.removeClass('menu-on');
        param = btn.data('param');
        _this.command(param);
        return false;
      };
    })(this));
    this.wrapper.on('mousedown', 'a.menu-item', function(e) {
      return false;
    });
    this.editor.on('blur', (function(_this) {
      return function() {
        var editorActive;
        editorActive = _this.editor.body.is(':visible') && _this.editor.body.is('[contenteditable]');
        if (!(editorActive && !_this.editor.editable.clipboard.pasting)) {
          return;
        }
        _this.setActive(false);
        return _this.setDisabled(false);
      };
    })(this));
    if (this.shortcut != null) {
      this.editor.editable.hotkeys.add(this.shortcut, (function(_this) {
        return function(e) {
          _this.el.mousedown();
          return false;
        };
      })(this));
    }
    ref = this.htmlTag.split(',');
    for (k = 0, len = ref.length; k < len; k++) {
      tag = ref[k];
      tag = langx.trim(tag);
      if (tag && langx.inArray(tag, this.editor.editable.formatter._allowedTags) < 0) {
        this.editor.editable.formatter._allowedTags.push(tag);
      }
    }
    return this.editor.on('selectionchanged', (function(_this) {
      return function(e) {
        if (_this.editor.editable.inputManager.focused) {
          return _this._status();
        }
      };
    })(this));
  };

  Button.prototype.iconClassOf = function(icon) {
    if (icon) {
      return "richeditor-icon richeditor-icon-" + icon;
    } else {
      return '';
    }
  };

  Button.prototype.setIcon = function(icon) {
    return this.el.find('span').removeClass().addClass(this.iconClassOf(icon)).text(this.text);
  };

  Button.prototype.render = function() {
    this.wrapper = $(this._tpl.item).appendTo(this.toolbar.list);
    this.el = this.wrapper.find('a.toolbar-item');
    this.el.attr('title', this.title).addClass("toolbar-item-" + this.name).data('button', this);
    this.setIcon(this.icon);
    if (!this.menu) {
      return;
    }
    this.menuWrapper = $(this._tpl.menuWrapper).appendTo(this.wrapper);
    this.menuWrapper.addClass("toolbar-menu-" + this.name);
    return this.renderMenu();
  };

  Button.prototype.renderMenu = function() {
    var $menuBtnEl, $menuItemEl, k, len, menuItem, ref, ref1, results;
    if (!langx.isArray(this.menu)) {
      return;
    }
    this.menuEl = $('<ul/>').appendTo(this.menuWrapper);
    ref = this.menu;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      menuItem = ref[k];
      if (menuItem === '|') {
        $(this._tpl.separator).appendTo(this.menuEl);
        continue;
      }
      $menuItemEl = $(this._tpl.menuItem).appendTo(this.menuEl);
      $menuBtnEl = $menuItemEl.find('a.menu-item').attr({
        'title': (ref1 = menuItem.title) != null ? ref1 : menuItem.text,
        'data-param': menuItem.param
      }).addClass('menu-item-' + menuItem.name);
      if (menuItem.icon) {
        results.push($menuBtnEl.find('span').addClass(this.iconClassOf(menuItem.icon)));
      } else {
        results.push($menuBtnEl.find('span').text(menuItem.text));
      }
    }
    return results;
  };

  Button.prototype.setActive = function(active) {
    if (active === this.active) {
      return;
    }
    this.active = active;
    return this.el.toggleClass('active', this.active);
  };

  Button.prototype.setDisabled = function(disabled) {
    if (disabled === this.disabled) {
      return;
    }
    this.disabled = disabled;
    return this.el.toggleClass('disabled', this.disabled);
  };

  Button.prototype._disableStatus = function() {
    var disabled, endNodes, startNodes;
    startNodes = this.editor.editable.selection.startNodes();
    endNodes = this.editor.editable.selection.endNodes();
    disabled = startNodes.filter(this.disableTag).length > 0 || endNodes.filter(this.disableTag).length > 0;
    this.setDisabled(disabled);
    if (this.disabled) {
      this.setActive(false);
    }
    return this.disabled;
  };

  Button.prototype._activeStatus = function() {
    var active, endNode, endNodes, startNode, startNodes;
    startNodes = this.editor.editable.selection.startNodes();
    endNodes = this.editor.editable.selection.endNodes();
    startNode = startNodes.filter(this.htmlTag);
    endNode = endNodes.filter(this.htmlTag);
    active = startNode.length > 0 && endNode.length > 0 && startNode.is(endNode);
    this.node = active ? startNode : null;
    this.setActive(active);
    return this.active;
  };

  Button.prototype._status = function() {
    this._disableStatus();
    if (this.disabled) {
      return;
    }
    return this._activeStatus();
  };

  Button.prototype.command = function(param) {};

  Button.prototype._t = i18n.translate;
  

  RichEditor.Button = Button;

  return Button;
});
define('skylark-widgets-richeditor/Popover',[
  "skylark-langx/langx",
  "skylark-utils-dom/query",
  "./RichEditor",
  "./i18n"
],function(langx,$,RichEditor,i18n){ 

  var Popover = langx.Evented.inherit({
     init : function(opts) {
      this.button = opts.button;
      this.editor = opts.button.editor;
      this._init();
    }
  });


  Popover.prototype.offset = {
    top: 4,
    left: 0
  };

  Popover.prototype.target = null;

  Popover.prototype.active = false;

  Popover.prototype._init = function() {
    this.el = $('<div class="richeditor-popover"></div>').appendTo(this.editor.el).data('popover', this);
    this.render();
    this.el.on('mouseenter', (function(_this) {
      return function(e) {
        return _this.el.addClass('hover');
      };
    })(this));
    return this.el.on('mouseleave', (function(_this) {
      return function(e) {
        return _this.el.removeClass('hover');
      };
    })(this));
  };

  Popover.prototype.render = function() {};

  Popover.prototype._initLabelWidth = function() {
    var $fields;
    $fields = this.el.find('.settings-field');
    if (!($fields.length > 0)) {
      return;
    }
    this._labelWidth = 0;
    $fields.each((function(_this) {
      return function(i, field) {
        var $field, $label;
        $field = $(field);
        $label = $field.find('label');
        if (!($label.length > 0)) {
          return;
        }
        return _this._labelWidth = Math.max(_this._labelWidth, $label.width());
      };
    })(this));
    return $fields.find('label').width(this._labelWidth);
  };

  Popover.prototype.show = function($target, position) {
    if (position == null) {
      position = 'bottom';
    }
    if ($target == null) {
      return;
    }
    this.el.siblings('.richeditor-popover').each(function(i, popover) {
      popover = $(popover).data('popover');
      if (popover.active) {
        return popover.hide();
      }
    });
    if (this.active && this.target) {
      this.target.removeClass('selected');
    }
    this.target = $target.addClass('selected');
    if (this.active) {
      this.refresh(position);
      return this.trigger('popovershow');
    } else {
      this.active = true;
      this.el.css({
        left: -9999
      }).show();
      if (!this._labelWidth) {
        this._initLabelWidth();
      }
      this.editor.editable.util.reflow();
      this.refresh(position);
      return this.trigger('popovershow');
    }
  };

  Popover.prototype.hide = function() {
    if (!this.active) {
      return;
    }
    if (this.target) {
      this.target.removeClass('selected');
    }
    this.target = null;
    this.active = false;
    this.el.hide();
    return this.trigger('popoverhide');
  };

  Popover.prototype.refresh = function(position) {
    var editorOffset, left, maxLeft, targetH, targetOffset, top;
    if (position == null) {
      position = 'bottom';
    }
    if (!this.active) {
      return;
    }
    editorOffset = this.editor.el.offset();
    targetOffset = this.target.offset();
    targetH = this.target.outerHeight();
    if (position === 'bottom') {
      top = targetOffset.top - editorOffset.top + targetH;
    } else if (position === 'top') {
      top = targetOffset.top - editorOffset.top - this.el.height();
    }
    maxLeft = this.editor.wrapper.width() - this.el.outerWidth() - 10;
    left = Math.min(targetOffset.left - editorOffset.left, maxLeft);
    return this.el.css({
      top: top + this.offset.top,
      left: left + this.offset.left
    });
  };

  Popover.prototype.destroy = function() {
    this.target = null;
    this.active = false;
    this.editor.off('.linkpopover');
    return this.el.remove();
  };

  Popover.prototype._t = function(name) {
    var args, ref, result;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    result = i18n.translate.apply(i18n, args);
    return result;
  };

  RichEditor.Popover = Popover;

  return Popover;

	
});
define('skylark-widgets-richeditor/Toolbar',[
  "skylark-langx/langx",
  "skylark-utils-dom/query"
],function(langx,$){ 

  var Toolbar = langx.Evented.inherit({
    init : function(editor,opts) {
      var floatInitialized, initToolbarFloat, toolbarHeight;
      this.editor = editor;

      this.opts = langx.extend({}, this.opts, opts);

      if (!this.opts.toolbar) {
        return;
      }
      if (!langx.isArray(this.opts.toolbar)) {
        this.opts.toolbar = ['bold', 'italic', 'underline', 'strikethrough', '|', 'ol', 'ul', 'blockquote', 'code', '|', 'link', 'image', '|', 'indent', 'outdent'];
      }
      this._render();
      this.list.on('click', function(e) {
        return false;
      });
      this.wrapper.on('mousedown', (function(_this) {
        return function(e) {
          return _this.list.find('.menu-on').removeClass('.menu-on');
        };
      })(this));
      $(document).on('mousedown.richeditor' + this.editor.id, (function(_this) {
        return function(e) {
          return _this.list.find('.menu-on').removeClass('.menu-on');
        };
      })(this));
      if (!this.opts.toolbarHidden && this.opts.toolbarFloat) {
        this.wrapper.css('top', this.opts.toolbarFloatOffset);
        toolbarHeight = 0;
        initToolbarFloat = (function(_this) {
          return function() {
            _this.wrapper.css('position', 'static');
            _this.wrapper.width('auto');
            _this.editor.editable.util.reflow(_this.wrapper);
            _this.wrapper.width(_this.wrapper.outerWidth());
            _this.wrapper.css('left', _this.editor.editable.util.os.mobile ? _this.wrapper.position().left : _this.wrapper.offset().left);
            _this.wrapper.css('position', '');
            toolbarHeight = _this.wrapper.outerHeight();
            _this.editor.placeholderEl.css('top', toolbarHeight);
            return true;
          };
        })(this);
        floatInitialized = null;
        $(window).on('resize.richeditor-' + this.editor.id, function(e) {
          return floatInitialized = initToolbarFloat();
        });
        $(window).on('scroll.richeditor-' + this.editor.id, (function(_this) {
          return function(e) {
            var bottomEdge, scrollTop, topEdge;
            if (!_this.wrapper.is(':visible')) {
              return;
            }
            topEdge = _this.editor.wrapper.offset().top;
            bottomEdge = topEdge + _this.editor.wrapper.outerHeight() - 80;
            scrollTop = $(document).scrollTop() + _this.opts.toolbarFloatOffset;
            if (scrollTop <= topEdge || scrollTop >= bottomEdge) {
              _this.editor.wrapper.removeClass('toolbar-floating').css('padding-top', '');
              if (_this.editor.editable.util.os.mobile) {
                return _this.wrapper.css('top', _this.opts.toolbarFloatOffset);
              }
            } else {
              floatInitialized || (floatInitialized = initToolbarFloat());
              _this.editor.wrapper.addClass('toolbar-floating').css('padding-top', toolbarHeight);
              if (_this.editor.editable.util.os.mobile) {
                return _this.wrapper.css('top', scrollTop - topEdge + _this.opts.toolbarFloatOffset);
              }
            }
          };
        })(this));
      }
      this.editor.on('destroy', (function(_this) {
        return function() {
          return _this.buttons.length = 0;
        };
      })(this));
      $(document).on("mousedown.richeditor-" + this.editor.id, (function(_this) {
        return function(e) {
          return _this.list.find('li.menu-on').removeClass('menu-on');
        };
      })(this));
    }

  });

  Toolbar.pluginName = 'Toolbar';

  Toolbar.prototype.opts = {
    toolbar: true,
    toolbarFloat: true,
    toolbarHidden: false,
    toolbarFloatOffset: 0
  };

  Toolbar.prototype._tpl = {
    wrapper: '<div class="richeditor-toolbar"><ul></ul></div>',
    separator: '<li><span class="separator"></span></li>'
  };


  Toolbar.prototype._render = function() {
    var k, len, name, ref;
    this.buttons = [];
    this.wrapper = $(this._tpl.wrapper).prependTo(this.editor.wrapper);
    this.list = this.wrapper.find('ul');
    ref = this.opts.toolbar;
    for (k = 0, len = ref.length; k < len; k++) {
      name = ref[k];
      if (name === '|') {
        $(this._tpl.separator).appendTo(this.list);
        continue;
      }
      if (!this.constructor.buttons[name]) {
        throw new Error("richeditor: invalid toolbar button " + name);
        continue;
      }
      this.buttons.push(new this.constructor.buttons[name]({
        toolbar : this,
        editor: this.editor
      }));
    }
    if (this.opts.toolbarHidden) {
      return this.wrapper.hide();
    }
  };

  Toolbar.prototype.findButton = function(name) {
    var button;
    button = this.list.find('.toolbar-item-' + name).data('button');
    return button != null ? button : null;
  };

  Toolbar.addButton = function(btn) {
    return this.buttons[btn.prototype.name] = btn;
  };

  Toolbar.buttons = {};

  return Toolbar;

});
define('skylark-widgets-richeditor/buttons/AlignmentButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button",
  "../i18n"
],function($,Toolbar,RichEditor,Button,i18n){ 
   var AlignmentButton = Button.inherit({

    });


  AlignmentButton.prototype.name = "alignment";

  AlignmentButton.prototype.icon = 'align-left';

  AlignmentButton.prototype.htmlTag = 'p, h1, h2, h3, h4, td, th';

  AlignmentButton.prototype._init = function() {
    this.menu = [
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
    ];
    return Button.prototype._init.call(this);
  };

  AlignmentButton.prototype.setActive = function(active, align) {
    if (align == null) {
      align = 'left';
    }
    if (align !== 'left' && align !== 'center' && align !== 'right') {
      align = 'left';
    }
    if (align === 'left') {
      Button.prototype.setActive.call(this, false);
    } else {
      Button.prototype.setActive.call(this, active);
    }
    this.el.removeClass('align-left align-center align-right');
    if (active) {
      this.el.addClass('align-' + align);
    }
    this.setIcon('align-' + align);
    return this.menuEl.find('.menu-item').show().end().find('.menu-item-' + align).hide();
  };

  AlignmentButton.prototype._status = function() {
    var value = this.editor.editable.status("alignment",this.htmlTag);
    if (value) {
      this.setDisabled(false);
      return this.setActive(true, value);
    } else {
      this.setDisabled(true);
      return this.setActive(false);
    }    
  };

  AlignmentButton.prototype.command = function(align) {
    return this.editor.editable.alignment(align,this.htmlTag);
  };

  RichEditor.Toolbar.addButton(AlignmentButton);

  return AlignmentButton;

});
define('skylark-widgets-richeditor/buttons/BlockquoteButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button"
],function($,Toolbar,RichEditor,Button){ 
   var BlockquoteButton = Button.inherit({

   });

  BlockquoteButton.prototype.name = 'blockquote';

  BlockquoteButton.prototype.icon = 'quote-left';

  BlockquoteButton.prototype.htmlTag = 'blockquote';

  BlockquoteButton.prototype.disableTag = 'pre, table';

  BlockquoteButton.prototype.command = function() {
    return this.editor.editable.blockquote(this.htmlTag,this.disableTag);
  };

  RichEditor.Toolbar.addButton(BlockquoteButton); 

  return BlockquoteButton;

});
define('skylark-widgets-richeditor/buttons/BoldButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button"
],function($,Toolbar,RichEditor,Button){ 
  
    var BoldButton = Button.inherit({

    });

    BoldButton.prototype.name = 'bold';

    BoldButton.prototype.icon = 'bold';

    BoldButton.prototype.htmlTag = 'b, strong';

    BoldButton.prototype.disableTag = 'pre';

    BoldButton.prototype.shortcut = 'cmd+b';

    BoldButton.prototype._init = function() {
      if (this.editor.editable.util.os.mac) {
        this.title = this.title + ' ( Cmd + b )';
      } else {
        this.title = this.title + ' ( Ctrl + b )';
        this.shortcut = 'ctrl+b';
      }
      return Button.prototype._init.call(this);
    };

    BoldButton.prototype._activeStatus = function() {
      var active;
      active = this.editor.editable.isActive('bold');
      this.setActive(active);
      return this.active;
    };

    BoldButton.prototype.command = function() {
      return this.editor.editable.bold();
    };


    RichEditor.Toolbar.addButton(BoldButton);

    return BoldButton;

});
define('skylark-widgets-richeditor/buttons/CodePopover',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Popover"
],function($,Toolbar,RichEditor,Popover){ 
  
   var CodePopover = Popover.inherit({

   });

  CodePopover.prototype.render = function() {
    var $option, k, lang, len, ref;
    this._tpl = "<div class=\"code-settings\">\n  <div class=\"settings-field\">\n    <select class=\"select-lang\">\n      <option value=\"-1\">" + (this._t('selectLanguage')) + "</option>\n    </select>\n  </div>\n</div>";
    this.langs = this.editor.opts.codeLanguages || [
      {
        name: 'Bash',
        value: 'bash'
      }, {
        name: 'C++',
        value: 'c++'
      }, {
        name: 'C#',
        value: 'cs'
      }, {
        name: 'CSS',
        value: 'css'
      }, {
        name: 'Erlang',
        value: 'erlang'
      }, {
        name: 'Less',
        value: 'less'
      }, {
        name: 'Sass',
        value: 'sass'
      }, {
        name: 'Diff',
        value: 'diff'
      }, {
        name: 'CoffeeScript',
        value: 'coffeescript'
      }, {
        name: 'HTML,XML',
        value: 'html'
      }, {
        name: 'JSON',
        value: 'json'
      }, {
        name: 'Java',
        value: 'java'
      }, {
        name: 'JavaScript',
        value: 'js'
      }, {
        name: 'Markdown',
        value: 'markdown'
      }, {
        name: 'Objective C',
        value: 'oc'
      }, {
        name: 'PHP',
        value: 'php'
      }, {
        name: 'Perl',
        value: 'parl'
      }, {
        name: 'Python',
        value: 'python'
      }, {
        name: 'Ruby',
        value: 'ruby'
      }, {
        name: 'SQL',
        value: 'sql'
      }
    ];
    this.el.addClass('code-popover').append(this._tpl);
    this.selectEl = this.el.find('.select-lang');
    ref = this.langs;
    for (k = 0, len = ref.length; k < len; k++) {
      lang = ref[k];
      $option = $('<option/>', {
        text: lang.name,
        value: lang.value
      }).appendTo(this.selectEl);
    }
    this.selectEl.on('change', (function(_this) {
      return function(e) {
        var selected;
        _this.lang = _this.selectEl.val();
        selected = _this.target.hasClass('selected');
        _this.target.removeClass().removeAttr('data-lang');
        if (_this.lang !== -1) {
          _this.target.attr('data-lang', _this.lang);
        }
        if (selected) {
          _this.target.addClass('selected');
        }
        return _this.editor.trigger('valuechanged');
      };
    })(this));
    return this.editor.on('valuechanged', (function(_this) {
      return function(e) {
        if (_this.active) {
          return _this.refresh();
        }
      };
    })(this));
  };

  CodePopover.prototype.show = function() {
    var args;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    Popover.prototype.show.apply(this, args);
    this.lang = this.target.attr('data-lang');
    if (this.lang != null) {
      return this.selectEl.val(this.lang);
    } else {
      return this.selectEl.val(-1);
    }
  };

  return CodePopover;

});
define('skylark-widgets-richeditor/buttons/CodeButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button",
  "./CodePopover"
],function($,Toolbar,RichEditor,Button,CodePopover){ 
  

   var CodeButton = Button.inherit({

   });



  CodeButton.prototype.name = 'code';

  CodeButton.prototype.icon = 'code';

  CodeButton.prototype.htmlTag = 'pre';

  CodeButton.prototype.disableTag = 'ul, ol, table';

  CodeButton.prototype._init = function() {
    Button.prototype._init.call(this);
    this.editor.on('decorate', (function(_this) {
      return function(e, $el) {
        return $el.find('pre').each(function(i, pre) {
          return _this.decorate($(pre));
        });
      };
    })(this));
    return this.editor.on('undecorate', (function(_this) {
      return function(e, $el) {
        return $el.find('pre').each(function(i, pre) {
          return _this.undecorate($(pre));
        });
      };
    })(this));
  };

  CodeButton.prototype.render = function() {
    var args;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    Button.prototype.render.apply(this, args);
    return this.popover = new CodePopover({
      button: this
    });
  };

  CodeButton.prototype._checkMode = function() {
    var $blockNodes, range;
    range = this.editor.editable.selection.range();
    if (($blockNodes = $(range.cloneContents()).find(this.editor.editable.util.blockNodes.join(','))) > 0 || (range.collapsed && this.editor.editable.selection.startNodes().filter('code').length === 0)) {
      this.inlineMode = false;
      return this.htmlTag = 'pre';
    } else {
      this.inlineMode = true;
      return this.htmlTag = 'code';
    }
  };

  CodeButton.prototype._status = function() {
    this._checkMode();
    Button.prototype._status.call(this);
    if (this.inlineMode) {
      return;
    }
    if (this.active) {
      return this.popover.show(this.node);
    } else {
      return this.popover.hide();
    }
  };

  CodeButton.prototype.decorate = function($pre) {
    var $code, lang, ref, ref1;
    $code = $pre.find('> code');
    if ($code.length > 0) {
      lang = (ref = $code.attr('class')) != null ? (ref1 = ref.match(/lang-(\S+)/)) != null ? ref1[1] : void 0 : void 0;
      $code.contents().unwrap();
      if (lang) {
        return $pre.attr('data-lang', lang);
      }
    }
  };

  CodeButton.prototype.undecorate = function($pre) {
    var $code, lang;
    lang = $pre.attr('data-lang');
    $code = $('<code/>');
    if (lang && lang !== -1) {
      $code.addClass('lang-' + lang);
    }
    return $pre.wrapInner($code).removeAttr('data-lang');
  };

  CodeButton.prototype.command = function() {
    if (this.inlineMode) {
      return this._inlineCommand();
    } else {
      return this._blockCommand();
    }
  };

  CodeButton.prototype._blockCommand = function() {
    return this.editor.editable.blockCode(this.htmlTag,this.disableTag);
  };

  CodeButton.prototype._inlineCommand = function() {
    return this.editor.editable.inlineCode(this.active);
  };

  RichEditor.Toolbar.addButton(CodeButton);    

  return CodeButton;

});
define('skylark-widgets-richeditor/buttons/ColorButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button",
  "../i18n"
],function($,Toolbar,RichEditor,Button,i18n){ 
  

   var ColorButton = Button.inherit({

   });


  ColorButton.prototype.name = 'color';

  ColorButton.prototype.icon = 'tint';

  ColorButton.prototype.disableTag = 'pre';

  ColorButton.prototype.menu = true;

  ColorButton.prototype.render = function() {
    var args;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    return Button.prototype.render.apply(this, args);
  };

  ColorButton.prototype.renderMenu = function() {
    $('<ul class="color-list">\n  <li><a href="javascript:;" class="font-color font-color-1"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-2"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-3"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-4"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-5"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-6"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-7"></a></li>\n  <li><a href="javascript:;" class="font-color font-color-default"></a></li>\n</ul>').appendTo(this.menuWrapper);
    this.menuWrapper.on('mousedown', '.color-list', function(e) {
      return false;
    });
    return this.menuWrapper.on('click', '.font-color', (function(_this) {
      return function(e) {
        var $link, $p, hex, range, rgb, textNode;
        _this.wrapper.removeClass('menu-on');
        $link = $(e.currentTarget);
        if ($link.hasClass('font-color-default')) {
          $p = _this.editor.body.find('p, li');
          if (!($p.length > 0)) {
            return;
          }
          rgb = window.getComputedStyle($p[0], null).getPropertyValue('color');
          hex = _this._convertRgbToHex(rgb);
        } else {
          rgb = window.getComputedStyle($link[0], null).getPropertyValue('background-color');
          hex = _this._convertRgbToHex(rgb);
        }
        if (!hex) {
          return;
        }

        return _this.editor.editable.fontColor(hex,$link.hasClass('font-color-default'),i18n.translate('coloredText'));
      };
    })(this));
  };

  ColorButton.prototype._convertRgbToHex = function(rgb) {
    var match, re, rgbToHex;
    re = /rgb\((\d+),\s?(\d+),\s?(\d+)\)/g;
    match = re.exec(rgb);
    if (!match) {
      return '';
    }
    rgbToHex = function(r, g, b) {
      var componentToHex;
      componentToHex = function(c) {
        var hex;
        hex = c.toString(16);
        if (hex.length === 1) {
          return '0' + hex;
        } else {
          return hex;
        }
      };
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    };
    return rgbToHex(match[1] * 1, match[2] * 1, match[3] * 1);
  };

  RichEditor.Toolbar.addButton(ColorButton);

  return ColorButton;
	
});
define('skylark-widgets-richeditor/buttons/FontScaleButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button",
  "../i18n"
],function($,Toolbar,RichEditor,Button,i18n){ 
  
   var FontScaleButton = Button.inherit({

   });



  FontScaleButton.prototype.name = 'fontScale';

  FontScaleButton.prototype.icon = 'font';

  FontScaleButton.prototype.htmlTag = 'span';

  FontScaleButton.prototype.disableTag = 'pre, h1, h2, h3, h4, h5';


  FontScaleButton.prototype._init = function() {
    this.menu = [
      {
        name: '150%',
        text: i18n.translate('fontScaleXLarge'),
        param: '5'
      }, {
        name: '125%',
        text: i18n.translate('fontScaleLarge'),
        param: '4'
      }, {
        name: '100%',
        text: i18n.translate('fontScaleNormal'),
        param: '3'
      }, {
        name: '75%',
        text: i18n.translate('fontScaleSmall'),
        param: '2'
      }, {
        name: '50%',
        text: i18n.translate('fontScaleXSmall'),
        param: '1'
      }
    ];
    return Button.prototype._init.call(this);
  };

  FontScaleButton.prototype._activeStatus = function() {
    var active, endNode, endNodes, range, startNode, startNodes;
    range = this.editor.editable.selection.range();
    startNodes = this.editor.editable.selection.startNodes();
    endNodes = this.editor.editable.selection.endNodes();
    startNode = startNodes.filter('span[style*="font-size"]');
    endNode = endNodes.filter('span[style*="font-size"]');
    active = startNodes.length > 0 && endNodes.length > 0 && startNode.is(endNode);
    this.setActive(active);
    return this.active;
  };

  FontScaleButton.prototype.command = function(param) {
    return this.editor.editable.fontScale(param);
  };

  RichEditor.Toolbar.addButton(FontScaleButton);

  return FontScaleButton;

});
define('skylark-widgets-richeditor/buttons/HrButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button"
],function($,Toolbar,RichEditor,Button){ 
  

   var HrButton = Button.inherit({

   });


  HrButton.prototype.name = 'hr';

  HrButton.prototype.icon = 'minus';

  HrButton.prototype.htmlTag = 'hr';

  HrButton.prototype._status = function() {};

  HrButton.prototype.command = function() {
    return this.editor.editable.hr();
  };

  RichEditor.Toolbar.addButton(HrButton);

  return HrButton;
	
});
define('skylark-widgets-richeditor/buttons/ImagePopover',[
  "skylark-langx/langx",
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Popover"
],function(langx, $,Toolbar,RichEditor,Popover){ 
   var ImagePopover = Popover.inherit({

   });

  ImagePopover.prototype.offset = {
    top: 6,
    left: -4
  };

  ImagePopover.prototype.render = function() {
    var tpl;
    tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field\">\n    <label>" + (this._t('imageUrl')) + "</label>\n    <input class=\"image-src\" type=\"text\" tabindex=\"1\" />\n    <a class=\"btn-upload\" href=\"javascript:;\"\n      title=\"" + (this._t('uploadImage')) + "\" tabindex=\"-1\">\n      <span class=\"richeditor-icon richeditor-icon-upload\"></span>\n    </a>\n  </div>\n  <div class='settings-field'>\n    <label>" + (this._t('imageAlt')) + "</label>\n    <input class=\"image-alt\" id=\"image-alt\" type=\"text\" tabindex=\"1\" />\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('imageSize')) + "</label>\n    <input class=\"image-size\" id=\"image-width\" type=\"text\" tabindex=\"2\" />\n    <span class=\"times\">×</span>\n    <input class=\"image-size\" id=\"image-height\" type=\"text\" tabindex=\"3\" />\n    <a class=\"btn-restore\" href=\"javascript:;\"\n      title=\"" + (this._t('restoreImageSize')) + "\" tabindex=\"-1\">\n      <span class=\"richeditor-icon richeditor-icon-undo\"></span>\n    </a>\n  </div>\n</div>";
    this.el.addClass('image-popover').append(tpl);
    this.srcEl = this.el.find('.image-src');
    this.widthEl = this.el.find('#image-width');
    this.heightEl = this.el.find('#image-height');
    this.altEl = this.el.find('#image-alt');
    this.srcEl.on('keydown', (function(_this) {
      return function(e) {
        var range;
        if (!(e.which === 13 && !_this.target.hasClass('uploading'))) {
          return;
        }
        e.preventDefault();
        range = document.createRange();
        _this.button.editor.editable.selection.setRangeAfter(_this.target, range);
        return _this.hide();
      };
    })(this));
    this.srcEl.on('blur', (function(_this) {
      return function(e) {
        return _this._loadImage(_this.srcEl.val());
      };
    })(this));
    this.el.find('.image-size').on('blur', (function(_this) {
      return function(e) {
        _this._resizeImg($(e.currentTarget));
        return _this.el.data('popover').refresh();
      };
    })(this));
    this.el.find('.image-size').on('keyup', (function(_this) {
      return function(e) {
        var inputEl;
        inputEl = $(e.currentTarget);
        if (!(e.which === 13 || e.which === 27 || e.which === 9)) {
          return _this._resizeImg(inputEl, true);
        }
      };
    })(this));
    this.el.find('.image-size').on('keydown', (function(_this) {
      return function(e) {
        var $img, inputEl, range;
        inputEl = $(e.currentTarget);
        if (e.which === 13 || e.which === 27) {
          e.preventDefault();
          if (e.which === 13) {
            _this._resizeImg(inputEl);
          } else {
            _this._restoreImg();
          }
          $img = _this.target;
          _this.hide();
          range = document.createRange();
          return _this.button.editor.editable.selection.setRangeAfter($img, range);
        } else if (e.which === 9) {
          return _this.el.data('popover').refresh();
        }
      };
    })(this));
    this.altEl.on('keydown', (function(_this) {
      return function(e) {
        var range;
        if (e.which === 13) {
          e.preventDefault();
          range = document.createRange();
          _this.button.editor.editable.selection.setRangeAfter(_this.target, range);
          return _this.hide();
        }
      };
    })(this));
    this.altEl.on('keyup', (function(_this) {
      return function(e) {
        if (e.which === 13 || e.which === 27 || e.which === 9) {
          return;
        }
        _this.alt = _this.altEl.val();
        return _this.target.attr('alt', _this.alt);
      };
    })(this));
    this.el.find('.btn-restore').on('click', (function(_this) {
      return function(e) {
        _this._restoreImg();
        return _this.el.data('popover').refresh();
      };
    })(this));
    this.editor.on('valuechanged', (function(_this) {
      return function(e) {
        if (_this.active) {
          return _this.refresh();
        }
      };
    })(this));
    return this._initUploader();
  };

  ImagePopover.prototype._initUploader = function() {
    var $uploadBtn, createInput;
    $uploadBtn = this.el.find('.btn-upload');
    if (this.editor.uploader == null) {
      $uploadBtn.remove();
      return;
    }
    createInput = (function(_this) {
      return function() {
        if (_this.input) {
          _this.input.remove();
        }
        return _this.input = $('<input/>', {
          type: 'file',
          title: _this._t('uploadImage'),
          multiple: true,
          accept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
        }).appendTo($uploadBtn);
      };
    })(this);
    createInput();
    this.el.on('click mousedown', 'input[type=file]', function(e) {
      return e.stopPropagation();
    });
    return this.el.on('change', 'input[type=file]', (function(_this) {
      return function(e) {
        _this.editor.uploader.upload(_this.input, {
          inline: true,
          img: _this.target
        });
        return createInput();
      };
    })(this));
  };

  ImagePopover.prototype._resizeImg = function(inputEl, onlySetVal) {
    var height, value, width;
    if (onlySetVal == null) {
      onlySetVal = false;
    }
    value = inputEl.val() * 1;
    if (!(this.target && (langx.isNumber(value) || value < 0))) {
      return;
    }
    if (inputEl.is(this.widthEl)) {
      width = value;
      height = this.height * value / this.width;
      this.heightEl.val(height);
    } else {
      height = value;
      width = this.width * value / this.height;
      this.widthEl.val(width);
    }
    if (!onlySetVal) {
      this.target.attr({
        width: width,
        height: height
      });
      return this.editor.trigger('valuechanged');
    }
  };

  ImagePopover.prototype._restoreImg = function() {
    var ref, size;
    size = ((ref = this.target.data('image-size')) != null ? ref.split(",") : void 0) || [this.width, this.height];
    this.target.attr({
      width: size[0] * 1,
      height: size[1] * 1
    });
    this.widthEl.val(size[0]);
    this.heightEl.val(size[1]);
    return this.editor.trigger('valuechanged');
  };

  ImagePopover.prototype._loadImage = function(src, callback) {
    if (/^data:image/.test(src) && !this.editor.uploader) {
      if (callback) {
        callback(false);
      }
      return;
    }
    if (this.target.attr('src') === src) {
      return;
    }
    return this.button.loadImage(this.target, src, (function(_this) {
      return function(img) {
        var blob;
        if (!img) {
          return;
        }
        if (_this.active) {
          _this.width = img.width;
          _this.height = img.height;
          _this.widthEl.val(_this.width);
          _this.heightEl.val(_this.height);
        }
        if (/^data:image/.test(src)) {
          blob = _this.editor.editable.util.dataURLtoBlob(src);
          blob.name = "Base64 Image.png";
          _this.editor.uploader.upload(blob, {
            inline: true,
            img: _this.target
          });
        } else {
          _this.editor.trigger('valuechanged');
        }
        if (callback) {
          return callback(img);
        }
      };
    })(this));
  };

  ImagePopover.prototype.show = function() {
    var $img, args;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    Popover.prototype.show.apply(this, args);
    $img = this.target;
    this.width = $img.width();
    this.height = $img.height();
    this.alt = $img.attr('alt');
    if ($img.hasClass('uploading')) {
      return this.srcEl.val(this._t('uploading')).prop('disabled', true);
    } else {
      this.srcEl.val($img.attr('src')).prop('disabled', false);
      this.widthEl.val(this.width);
      this.heightEl.val(this.height);
      return this.altEl.val(this.alt);
    }
  };

  return ImagePopover;

});
define('skylark-widgets-richeditor/buttons/ImageButton',[
  "skylark-langx/langx",
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button",
  "./ImagePopover"
],function(langx, $,Toolbar,RichEditor,Button,ImagePopover){ 
   var ImageButton = Button.inherit({

   });


  ImageButton.prototype.name = 'image';

  ImageButton.prototype.icon = 'picture-o';

  ImageButton.prototype.htmlTag = 'img';

  ImageButton.prototype.disableTag = 'pre, table';

  ImageButton.prototype.defaultImage = '';

  ImageButton.prototype.needFocus = false;

  ImageButton.prototype._init = function() {
    var item, k, len, ref;
    if (this.editor.opts.imageButton) {
      if (Array.isArray(this.editor.opts.imageButton)) {
        this.menu = [];
        ref = this.editor.opts.imageButton;
        for (k = 0, len = ref.length; k < len; k++) {
          item = ref[k];
          this.menu.push({
            name: item + '-image',
            text: this._t(item + 'Image')
          });
        }
      } else {
        this.menu = false;
      }
    } else {
      if (this.editor.uploader != null) {
        this.menu = [
          {
            name: 'upload-image',
            text: this._t('uploadImage')
          }, {
            name: 'external-image',
            text: this._t('externalImage')
          }
        ];
      } else {
        this.menu = false;
      }
    }
    this.defaultImage = this.editor.opts.defaultImage;
    this.editor.body.on('click', 'img:not([data-non-image])', (function(_this) {
      return function(e) {
        var $img, range;
        $img = $(e.currentTarget);
        range = document.createRange();
        range.selectNode($img[0]);
        _this.editor.editable.selection.range(range);
        if (!_this.editor.editable.util.support.onselectionchange) {
          _this.editor.trigger('selectionchanged');
        }
        return false;
      };
    })(this));
    this.editor.body.on('mouseup', 'img:not([data-non-image])', function(e) {
      return false;
    });
    this.editor.on('selectionchanged.image', (function(_this) {
      return function() {
        var $contents, $img, range;
        range = _this.editor.editable.selection.range();
        if (range == null) {
          return;
        }
        $contents = $(range.cloneContents()).contents();
        if ($contents.length === 1 && $contents.is('img:not([data-non-image])')) {
          $img = $(range.startContainer).contents().eq(range.startOffset);
          return _this.popover.show($img);
        } else {
          return _this.popover.hide();
        }
      };
    })(this));
    this.editor.on('valuechanged.image', (function(_this) {
      return function() {
        var $masks;
        $masks = _this.editor.wrapper.find('.richeditor-image-loading');
        if (!($masks.length > 0)) {
          return;
        }
        return $masks.each(function(i, mask) {
          var $img, $mask, file;
          $mask = $(mask);
          $img = $mask.data('img');
          if (!($img && $img.parent().length > 0)) {
            $mask.remove();
            if ($img) {
              file = $img.data('file');
              if (file) {
                _this.editor.uploader.cancel(file);
                if (_this.editor.body.find('img.uploading').length < 1) {
                  return _this.editor.uploader.trigger('uploadready', [file]);
                }
              }
            }
          }
        });
      };
    })(this));
    return Button.prototype._init.call(this);
  };

  ImageButton.prototype.render = function() {
    var args;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    Button.prototype.render.apply(this, args);
    this.popover = new ImagePopover({
      button: this
    });
    if (this.editor.opts.imageButton === 'upload') {
      return this._initUploader(this.el);
    }
  };

  ImageButton.prototype.renderMenu = function() {
    Button.prototype.renderMenu.call(this);
    return this._initUploader();
  };

  ImageButton.prototype._initUploader = function($uploadItem) {
    var $input, createInput, uploadProgress;
    if ($uploadItem == null) {
      $uploadItem = this.menuEl.find('.menu-item-upload-image');
    }
    if (this.editor.uploader == null) {
      this.el.find('.btn-upload').remove();
      return;
    }
    $input = null;
    createInput = (function(_this) {
      return function() {
        if ($input) {
          $input.remove();
        }
        return $input = $('<input/>', {
          type: 'file',
          title: _this._t('uploadImage'),
          multiple: true,
          accept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg'
        }).appendTo($uploadItem);
      };
    })(this);
    createInput();
    $uploadItem.on('click mousedown', 'input[type=file]', function(e) {
      return e.stopPropagation();
    });
    $uploadItem.on('change', 'input[type=file]', (function(_this) {
      return function(e) {
        if (_this.editor.editable.inputManager.focused) {
          _this.editor.uploader.upload($input, {
            inline: true
          });
          createInput();
        } else {
          _this.editor.one('focus', function(e) {
            _this.editor.uploader.upload($input, {
              inline: true
            });
            return createInput();
          });
          _this.editor.focus();
        }
        return _this.wrapper.removeClass('menu-on');
      };
    })(this));
    this.editor.uploader.on('beforeupload', (function(_this) {
      return function(e, file) {
        var $img;
        if (!file.inline) {
          return;
        }
        if (file.img) {
          $img = $(file.img);
        } else {
          $img = _this.createImage(file.name);
          file.img = $img;
        }
        $img.addClass('uploading');
        $img.data('file', file);
        return _this.editor.uploader.readImageFile(file.obj, function(img) {
          var src;
          if (!$img.hasClass('uploading')) {
            return;
          }
          src = img ? img.src : _this.defaultImage;
          return _this.loadImage($img, src, function() {
            if (_this.popover.active) {
              _this.popover.refresh();
              return _this.popover.srcEl.val(_this._t('uploading')).prop('disabled', true);
            }
          });
        });
      };
    })(this));
    uploadProgress = langx.proxy(this.editor.editable.util.throttle(function(e, file, loaded, total) {
      var $img, $mask, percent;
      if (!file.inline) {
        return;
      }
      $mask = file.img.data('mask');
      if (!$mask) {
        return;
      }
      $img = $mask.data('img');
      if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
        $mask.remove();
        return;
      }
      percent = loaded / total;
      percent = (percent * 100).toFixed(0);
      if (percent > 99) {
        percent = 99;
      }
      return $mask.find('.progress').height((100 - percent) + "%");
    }, 500), this);
    this.editor.uploader.on('uploadprogress', uploadProgress);
    this.editor.uploader.on('uploadsuccess', (function(_this) {
      return function(e, file, result) {
        var $img, img_path, msg;
        if (!file.inline) {
          return;
        }
        $img = file.img;
        if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
          return;
        }
        if (typeof result !== 'object') {
          try {
            result = JSON.parse(result);
          } catch (_error) {
            e = _error;
            result = {
              success: false
            };
          }
        }
        if (result.success === false) {
          msg = result.msg || _this._t('uploadFailed');
          alert(msg);
          img_path = _this.defaultImage;
        } else {
          img_path = result.file_path;
        }
        _this.loadImage($img, img_path, function() {
          var $mask;
          $img.removeData('file');
          $img.removeClass('uploading').removeClass('loading');
          $mask = $img.data('mask');
          if ($mask) {
            $mask.remove();
          }
          $img.removeData('mask');
          _this.editor.trigger('valuechanged');
          if (_this.editor.body.find('img.uploading').length < 1) {
            return _this.editor.uploader.trigger('uploadready', [file, result]);
          }
        });
        if (_this.popover.active) {
          _this.popover.srcEl.prop('disabled', false);
          return _this.popover.srcEl.val(result.file_path);
        }
      };
    })(this));
    return this.editor.uploader.on('uploaderror', (function(_this) {
      return function(e, file, xhr) {
        var $img, msg, result;
        if (!file.inline) {
          return;
        }
        if (xhr.statusText === 'abort') {
          return;
        }
        if (xhr.responseText) {
          try {
            result = JSON.parse(xhr.responseText);
            msg = result.msg;
          } catch (_error) {
            e = _error;
            msg = _this._t('uploadError');
          }
        }
        $img = file.img;
        if (!($img.hasClass('uploading') && $img.parent().length > 0)) {
          return;
        }
        _this.loadImage($img, _this.defaultImage, function() {
          var $mask;
          $img.removeData('file');
          $img.removeClass('uploading').removeClass('loading');
          $mask = $img.data('mask');
          if ($mask) {
            $mask.remove();
          }
          return $img.removeData('mask');
        });
        if (_this.popover.active) {
          _this.popover.srcEl.prop('disabled', false);
          _this.popover.srcEl.val(_this.defaultImage);
        }
        _this.editor.trigger('valuechanged');
        if (_this.editor.body.find('img.uploading').length < 1) {
          return _this.editor.uploader.trigger('uploadready', [file, result]);
        }
      };
    })(this));
  };

  ImageButton.prototype._status = function() {
    return this._disableStatus();
  };

  ImageButton.prototype.loadImage = function($img, src, callback) {
    var $mask, img, positionMask;
    positionMask = (function(_this) {
      return function() {
        var imgOffset, wrapperOffset;
        imgOffset = $img.offset();
        wrapperOffset = _this.editor.wrapper.offset();
        return $mask.css({
          top: imgOffset.top - wrapperOffset.top,
          left: imgOffset.left - wrapperOffset.left,
          width: $img.width(),
          height: $img.height()
        }).show();
      };
    })(this);
    $img.addClass('loading');
    $mask = $img.data('mask');
    if (!$mask) {
      $mask = $('<div class="richeditor-image-loading">\n  <div class="progress"></div>\n</div>').hide().appendTo(this.editor.wrapper);
      positionMask();
      $img.data('mask', $mask);
      $mask.data('img', $img);
    }
    img = new Image();
    img.onload = (function(_this) {
      return function() {
        var height, width;
        if (!$img.hasClass('loading') && !$img.hasClass('uploading')) {
          return;
        }
        width = img.width;
        height = img.height;
        $img.attr({
          src: src,
          width: width,
          height: height,
          'data-image-size': width + ',' + height
        }).removeClass('loading');
        if ($img.hasClass('uploading')) {
          _this.editor.editable.util.reflow(_this.editor.body);
          positionMask();
        } else {
          $mask.remove();
          $img.removeData('mask');
        }
        if (langx.isFunction(callback)) {
          return callback(img);
        }
      };
    })(this);
    img.onerror = function() {
      if (langx.isFunction(callback)) {
        callback(false);
      }
      $mask.remove();
      return $img.removeData('mask').removeClass('loading');
    };
    return img.src = src;
  };

  ImageButton.prototype.createImage = function(name) {
    var $img, range;
    if (name == null) {
      name = 'Image';
    }
    if (!this.editor.editable.inputManager.focused) {
      this.editor.focus();
    }
    range = this.editor.editable.selection.range();
    range.deleteContents();
    this.editor.editable.selection.range(range);
    $img = $('<img/>').attr('alt', name);
    range.insertNode($img[0]);
    this.editor.editable.selection.setRangeAfter($img, range);
    this.editor.trigger('valuechanged');
    return $img;
  };

  ImageButton.prototype.command = function(src) {
    var $img;
    $img = this.createImage();
    return this.loadImage($img, src || this.defaultImage, (function(_this) {
      return function() {
        _this.editor.trigger('valuechanged');
        _this.editor.editable.util.reflow($img);
        $img.click();
        return _this.popover.one('popovershow', function() {
          _this.popover.srcEl.focus();
          return _this.popover.srcEl[0].select();
        });
      };
    })(this));
  };

  RichEditor.Toolbar.addButton(ImageButton);	

  return ImageButton;

});
define('skylark-widgets-richeditor/buttons/IndentButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button"
],function($,Toolbar,RichEditor,Button){ 
  
   var IndentButton = Button.inherit({

   });


  IndentButton.prototype.name = 'indent';

  IndentButton.prototype.icon = 'indent';

  IndentButton.prototype._init = function() {
    var hotkey;
    hotkey = this.editor.opts.tabIndent === false ? '' : ' (Tab)';
    this.title = this._t(this.name) + hotkey;
    return Button.prototype._init.call(this);
  };

  IndentButton.prototype._status = function() {};

  IndentButton.prototype.command = function() {
    return this.editor.editable.indent();
  };

  RichEditor.Toolbar.addButton(IndentButton);	

  return IndentButton;
});
define('skylark-widgets-richeditor/buttons/ItalicButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button"
],function($,Toolbar,RichEditor,Button){ 
  

  var ItalicButton = Button.inherit({

   });


  ItalicButton.prototype.name = 'italic';

  ItalicButton.prototype.icon = 'italic';

  ItalicButton.prototype.htmlTag = 'i';

  ItalicButton.prototype.disableTag = 'pre';

  ItalicButton.prototype.shortcut = 'cmd+i';

  ItalicButton.prototype._init = function() {
    if (this.editor.editable.util.os.mac) {
      this.title = this.title + " ( Cmd + i )";
    } else {
      this.title = this.title + " ( Ctrl + i )";
      this.shortcut = 'ctrl+i';
    }
    return Button.prototype._init.call(this);
  };

  ItalicButton.prototype._activeStatus = function() {
    var active;
    active = this.editor.editable.isActive('italic');
    this.setActive(active);
    return this.active;
  };

  ItalicButton.prototype.command = function() {
    return this.editor.editable.italic();
  };

  RichEditor.Toolbar.addButton(ItalicButton); 

  return ItalicButton;

});
define('skylark-widgets-richeditor/buttons/LinkPopover',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Popover"
],function($,Toolbar,RichEditor,Popover){ 
  var LinkPopover = Popover.inherit({

  });

  LinkPopover.prototype.render = function() {
    var tpl;
    tpl = "<div class=\"link-settings\">\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkText')) + "</label>\n    <input class=\"link-text\" type=\"text\"/>\n    <a class=\"btn-unlink\" href=\"javascript:;\" title=\"" + (this._t('removeLink')) + "\"\n      tabindex=\"-1\">\n      <span class=\"richeditor-icon richeditor-icon-unlink\"></span>\n    </a>\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkUrl')) + "</label>\n    <input class=\"link-url\" type=\"text\"/>\n  </div>\n  <div class=\"settings-field\">\n    <label>" + (this._t('linkTarget')) + "</label>\n    <select class=\"link-target\">\n      <option value=\"_blank\">" + (this._t('openLinkInNewWindow')) + " (_blank)</option>\n      <option value=\"_self\">" + (this._t('openLinkInCurrentWindow')) + " (_self)</option>\n    </select>\n  </div>\n</div>";
    this.el.addClass('link-popover').append(tpl);
    this.textEl = this.el.find('.link-text');
    this.urlEl = this.el.find('.link-url');
    this.unlinkEl = this.el.find('.btn-unlink');
    this.selectTarget = this.el.find('.link-target');
    this.textEl.on('keyup', (function(_this) {
      return function(e) {
        if (e.which === 13) {
          return;
        }
        _this.target.text(_this.textEl.val());
        return _this.editor.editable.inputManager.throttledValueChanged();
      };
    })(this));
    this.urlEl.on('keyup', (function(_this) {
      return function(e) {
        var val;
        if (e.which === 13) {
          return;
        }
        val = _this.urlEl.val();
        if (!(/^(http|https|ftp|ftps|file)?:\/\/|^(mailto|tel)?:|^\//ig.test(val) || !val)) {
          val = 'http://' + val;
        }
        _this.target.attr('href', val);
        return _this.editor.editable.inputManager.throttledValueChanged();
      };
    })(this));
    $([this.urlEl[0], this.textEl[0]]).on('keydown', (function(_this) {
      return function(e) {
        var range;
        if (e.which === 13 || e.which === 27 || (!e.shiftKey && e.which === 9 && $(e.target).hasClass('link-url'))) {
          e.preventDefault();
          range = document.createRange();
          _this.editor.editable.selection.setRangeAfter(_this.target, range);
          _this.hide();
          return _this.editor.editable.inputManager.throttledValueChanged();
        }
      };
    })(this));
    this.unlinkEl.on('click', (function(_this) {
      return function(e) {
        var range, txtNode;
        txtNode = document.createTextNode(_this.target.text());
        _this.target.replaceWith(txtNode);
        _this.hide();
        range = document.createRange();
        _this.editor.editable.selection.setRangeAfter(txtNode, range);
        return _this.editor.editable.inputManager.throttledValueChanged();
      };
    })(this));
    return this.selectTarget.on('change', (function(_this) {
      return function(e) {
        _this.target.attr('target', _this.selectTarget.val());
        return _this.editor.editable.inputManager.throttledValueChanged();
      };
    })(this));
  };

  LinkPopover.prototype.show = function() {
    var args;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    Popover.prototype.show.apply(this, args);
    this.textEl.val(this.target.text());
    return this.urlEl.val(this.target.attr('href'));
  };

  return LinkPopover;

});
define('skylark-widgets-richeditor/buttons/LinkButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button",
  "../i18n",
  "./LinkPopover"
],function($,Toolbar,RichEditor,Button,i18n,LinkPopover){ 
  

  var LinkButton = Button.inherit({

   });


  LinkButton.prototype.name = 'link';

  LinkButton.prototype.icon = 'link';

  LinkButton.prototype.htmlTag = 'a';

  LinkButton.prototype.disableTag = 'pre';

  LinkButton.prototype.render = function() {
    var args;
    args = 1 <= arguments.length ? Array.prototype.slice.call(arguments, 0) : [];
    Button.prototype.render.apply(this, args);
    return this.popover = new LinkPopover({
      button: this
    });
  };

  LinkButton.prototype._status = function() {
   Button.prototype._status.call(this);
    if (this.active && !this.editor.editable.selection.rangeAtEndOf(this.node)) {
      return this.popover.show(this.node);
    } else {
      return this.popover.hide();
    }
  };

  LinkButton.prototype.command = function() {
    if (this.active) {
      this.popover.one('popovershow', (function(_this) {
        return function() {
          if (linkText) {
            _this.popover.urlEl.focus();
            return _this.popover.urlEl[0].select();
          } else {
            _this.popover.textEl.focus();
            return _this.popover.textEl[0].select();
          }
        };
      })(this));

    }

    return this.editor.editable.link(this.active,i18n.translate('linkText'));

  };

  RichEditor.Toolbar.addButton(LinkButton);

  return LinkButton;

});
define('skylark-widgets-richeditor/buttons/ListButton',[
  "skylark-utils-dom/noder",
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button"
],function(noder,$,Toolbar,RichEditor,Button){ 
  var ListButton = Button.inherit({

   });


    ListButton.prototype.type = '';

    ListButton.prototype.disableTag = 'pre, table';

    ListButton.prototype.command = function(param) {
      return this.editor.editable.list(this.type,param,this.disableTag);
    };

    return ListButton;
	
});
define('skylark-widgets-richeditor/buttons/OrderListButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "./ListButton"
],function($,Toolbar,RichEditor,ListButton){ 
  var OrderListButton = ListButton.inherit({

   });


    OrderListButton.prototype.type = 'ol';

    OrderListButton.prototype.name = 'ol';

    OrderListButton.prototype.icon = 'list-ol';

    OrderListButton.prototype.htmlTag = 'ol';

    OrderListButton.prototype.shortcut = 'cmd+/';

    OrderListButton.prototype._init = function() {
      if (this.editor.editable.util.os.mac) {
        this.title = this.title + ' ( Cmd + / )';
      } else {
        this.title = this.title + ' ( ctrl + / )';
        this.shortcut = 'ctrl+/';
      }
      return ListButton.prototype._init.call(this);
    };

    RichEditor.Toolbar.addButton(OrderListButton);

    return OrderListButton;
	
});
define('skylark-widgets-richeditor/buttons/OutdentButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button"
],function($,Toolbar,RichEditor,Button){ 
  var OutdentButton = Button.inherit({

   });


  OutdentButton.prototype.name = 'outdent';

  OutdentButton.prototype.icon = 'outdent';

  OutdentButton.prototype._init = function() {
    var hotkey;
    hotkey = this.editor.opts.tabIndent === false ? '' : ' (Shift + Tab)';
    this.title = this._t(this.name) + hotkey;
    return Button.prototype._init.call(this);
  };

  OutdentButton.prototype._status = function() {};

  OutdentButton.prototype.command = function() {
    return this.editor.editable.outdent();
  };

  RichEditor.Toolbar.addButton(OutdentButton);	

  return OutdentButton;

});
define('skylark-widgets-richeditor/buttons/StrikethroughButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button"
],function($,Toolbar,RichEditor,Button){ 
  
  var StrikethroughButton = Button.inherit({

   });


  StrikethroughButton.prototype.name = 'strikethrough';

  StrikethroughButton.prototype.icon = 'strikethrough';

  StrikethroughButton.prototype.htmlTag = 'strike';

  StrikethroughButton.prototype.disableTag = 'pre';

  StrikethroughButton.prototype._activeStatus = function() {
    var active;
    active = this.editor.editable.isActive('strikethrough');
    this.setActive(active);
    return this.active;
  };

  StrikethroughButton.prototype.command = function() {
    return this.editor.editable.strikethrough();
  };

  RichEditor.Toolbar.addButton(StrikethroughButton);	

  return StrikethroughButton;

});
define('skylark-utils-dom/tables',[
    "./dom",
    "skylark-domx-tables"
], function(dom, tables) {

  return dom.tables = tables;
});
define('skylark-widgets-richeditor/buttons/TableButton',[
  "skylark-langx/langx",
  "skylark-utils-dom/tables",
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button"
],function(langx,tables,$,Toolbar,RichEditor,Button){ 
  var TableButton = Button.inherit({

   });


  TableButton.prototype.name = 'table';

  TableButton.prototype.icon = 'table';

  TableButton.prototype.htmlTag = 'table';

  TableButton.prototype.disableTag = 'pre, li, blockquote';

  TableButton.prototype.menu = true;

  TableButton.prototype._init = function() {
    Button.prototype._init.call(this);
    langx.merge(this.editor.editable.formatter._allowedTags, ['thead', 'th', 'tbody', 'tr', 'td', 'colgroup', 'col']);
    langx.extend(this.editor.editable.formatter._allowedAttributes, {
      td: ['rowspan', 'colspan'],
      col: ['width']
    });
    langx.extend(this.editor.editable.formatter._allowedStyles, {
      td: ['text-align'],
      th: ['text-align']
    });
    this._initShortcuts();
    this._initResize();
    this.editor.on('decorate', (function(_this) {
      return function(e, $el) {
        return $el.find('table').each(function(i, table) {
          return _this.decorate($(table));
        });
      };
    })(this));
    this.editor.on('undecorate', (function(_this) {
      return function(e, $el) {
        return $el.find('table').each(function(i, table) {
          return _this.undecorate($(table));
        });
      };
    })(this));
    this.editor.on('selectionchanged.table', (function(_this) {
      return function(e) {
        var $container, range;
        _this.editor.body.find('.richeditor-table td, .richeditor-table th').removeClass('active');
        range = _this.editor.editable.selection.range();
        if (!range) {
          return;
        }
        $container = _this.editor.editable.selection.containerNode();
        if (range.collapsed && $container.is('.richeditor-table')) {
          _this.editor.editable.selection.setRangeAtEndOf($container);
        }
        return $container.closest('td, th', _this.editor.body).addClass('active');
      };
    })(this));
    this.editor.on('blur.table', (function(_this) {
      return function(e) {
        return _this.editor.body.find('.richeditor-table td, .richeditor-table th').removeClass('active');
      };
    })(this));
    this.editor.editable.keystroke.add('up', 'td', (function(_this) {
      return function(e, $node) {
        _this._tdNav($node, 'up');
        return true;
      };
    })(this));
    this.editor.editable.keystroke.add('up', 'th', (function(_this) {
      return function(e, $node) {
        _this._tdNav($node, 'up');
        return true;
      };
    })(this));
    this.editor.editable.keystroke.add('down', 'td', (function(_this) {
      return function(e, $node) {
        _this._tdNav($node, 'down');
        return true;
      };
    })(this));
    return this.editor.editable.keystroke.add('down', 'th', (function(_this) {
      return function(e, $node) {
        _this._tdNav($node, 'down');
        return true;
      };
    })(this));
  };

  TableButton.prototype._tdNav = function($td, direction) {
    var $anotherTr, $tr, action, anotherTag, index, parentTag, ref;
    if (direction == null) {
      direction = 'up';
    }
    action = direction === 'up' ? 'prev' : 'next';
    ref = direction === 'up' ? ['tbody', 'thead'] : ['thead', 'tbody'], parentTag = ref[0], anotherTag = ref[1];
    $tr = $td.parent('tr');
    $anotherTr = this["_" + action + "Row"]($tr);
    if (!($anotherTr.length > 0)) {
      return true;
    }
    index = $tr.find('td, th').index($td);
    return this.editor.editable.selection.setRangeAtEndOf($anotherTr.find('td, th').eq(index));
  };

  TableButton.prototype._initResize = function() {

    tables.resizable(document,{
      cssClasses : {
        resizeHandle : "richeditor-resize-handle",
        wrapper : "richeditor-table"
      }
    });

  };

  TableButton.prototype._initShortcuts = function() {
    this.editor.editable.hotkeys.add('ctrl+alt+up', (function(_this) {
      return function(e) {
        _this.editMenu.find('.menu-item[data-param=insertRowAbove]').click();
        return false;
      };
    })(this));
    this.editor.editable.hotkeys.add('ctrl+alt+down', (function(_this) {
      return function(e) {
        _this.editMenu.find('.menu-item[data-param=insertRowBelow]').click();
        return false;
      };
    })(this));
    this.editor.editable.hotkeys.add('ctrl+alt+left', (function(_this) {
      return function(e) {
        _this.editMenu.find('.menu-item[data-param=insertColLeft]').click();
        return false;
      };
    })(this));
    return this.editor.editable.hotkeys.add('ctrl+alt+right', (function(_this) {
      return function(e) {
        _this.editMenu.find('.menu-item[data-param=insertColRight]').click();
        return false;
      };
    })(this));
  };

  TableButton.prototype.renderMenu = function() {
    var $table;
    $("<div class=\"menu-create-table\">\n</div>\n<div class=\"menu-edit-table\">\n  <ul>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteRow\">\n        <span>" + (this._t('deleteRow')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowAbove\">\n        <span>" + (this._t('insertRowAbove')) + " ( Ctrl + Alt + ↑ )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertRowBelow\">\n        <span>" + (this._t('insertRowBelow')) + " ( Ctrl + Alt + ↓ )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteCol\">\n        <span>" + (this._t('deleteColumn')) + "</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColLeft\">\n        <span>" + (this._t('insertColumnLeft')) + " ( Ctrl + Alt + ← )</span>\n      </a>\n    </li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"insertColRight\">\n        <span>" + (this._t('insertColumnRight')) + " ( Ctrl + Alt + → )</span>\n      </a>\n    </li>\n    <li><span class=\"separator\"></span></li>\n    <li>\n      <a tabindex=\"-1\" unselectable=\"on\" class=\"menu-item\"\n        href=\"javascript:;\" data-param=\"deleteTable\">\n        <span>" + (this._t('deleteTable')) + "</span>\n      </a>\n    </li>\n  </ul>\n</div>").appendTo(this.menuWrapper);
    this.createMenu = this.menuWrapper.find('.menu-create-table');
    this.editMenu = this.menuWrapper.find('.menu-edit-table');
    $table = this.createTable(6, 6).appendTo(this.createMenu);
    this.createMenu.on('mouseenter', 'td, th', (function(_this) {
      return function(e) {
        var $td, $tr, $trs, num;
        _this.createMenu.find('td, th').removeClass('selected');
        $td = $(e.currentTarget);
        $tr = $td.parent();
        num = $tr.find('td, th').index($td) + 1;
        $trs = $tr.prevAll('tr').addBack();
        if ($tr.parent().is('tbody')) {
          $trs = $trs.add($table.find('thead tr'));
        }
        return $trs.find("td:lt(" + num + "), th:lt(" + num + ")").addClass('selected');
      };
    })(this));
    this.createMenu.on('mouseleave', function(e) {
      return $(e.currentTarget).find('td, th').removeClass('selected');
    });
    return this.createMenu.on('mousedown', 'td, th', (function(_this) {
      return function(e) {
        var $closestBlock, $td, $tr, colNum, rowNum;
        _this.wrapper.removeClass('menu-on');
        if (!_this.editor.editable.inputManager.focused) {
          return;
        }
        $td = $(e.currentTarget);
        $tr = $td.parent();
        colNum = $tr.find('td').index($td) + 1;
        rowNum = $tr.prevAll('tr').length + 1;
        if ($tr.parent().is('tbody')) {
          rowNum += 1;
        }
        $table = _this.createTable(rowNum, colNum, true);
        $closestBlock = _this.editor.editable.selection.blockNodes().last();
        if (_this.editor.editable.util.isEmptyNode($closestBlock)) {
          $closestBlock.replaceWith($table);
        } else {
          $closestBlock.after($table);
        }
        _this.decorate($table);
        _this.editor.editable.selection.setRangeAtStartOf($table.find('th:first'));
        _this.editor.trigger('valuechanged');
        return false;
      };
    })(this));
  };

  TableButton.prototype.decorate = function($table) {
    return $(tables.decorate($table[0],{
      tableDecorate : 'richeditor-table',
      resizeHandle : 'richeditor-resize-handle'
    }));

  };

  TableButton.prototype.undecorate = function($table) {
    return $(tables.undecorate($table[0],{
      tableDecorate : 'richeditor-table',
      resizeHandle : 'richeditor-resize-handle'
    }));

  };


  TableButton.prototype.createTable = function(row, col, phBr) {
    return $(tables.createTable(row,col,phBr ? this.editor.editable.util.phBr : null));
  };

  TableButton.prototype.refreshTableWidth = function($table) {
    return table.refreshTableWidth($table[0]);
  };

  TableButton.prototype.setActive = function(active) {
    Button.prototype.setActive.call(this, active);
    if (active) {
      this.createMenu.hide();
      return this.editMenu.show();
    } else {
      this.createMenu.show();
      return this.editMenu.hide();
    }
  };

  TableButton.prototype.deleteRow = function($td) {
    var self = this,
        ret; 

    tables.deleteRow($td[0],function(newTr,index){
      if (newTr) {
        ret = self.editor.editable.selection.setRangeAtEndOf($(newTr).find('td, th').eq(index));
      }
    })

    return ret;
  };

  TableButton.prototype.insertRow = function($td, direction) {
    var self = this,
        ret; 

    tables.insertRow($td[0],direction,self.editor.editable.util.phBr,function(newTr,index){
      ret =  self.editor.editable.selection.setRangeAtStartOf($(newTr).find('td, th').eq(index));
    })

    return ret;

  };

  TableButton.prototype.deleteCol = function($td) {
    var self = this,
        ret; 

    tables.deleteCol($td[0],function(newTd){
      if (newTd) {
        ret = self.editor.editable.selection.setRangeAtEndOf($(newTd));
      }
    })

    return ret;
  };

  TableButton.prototype.insertCol = function($td, direction) {
    var self = this,
        ret; 

    tables.insertCol($td[0],direction,self.editor.editable.util.phBr,function(newTd){
      ret = self.editor.editable.selection.setRangeAtStartOf($(newTd));
    })

    return ret;
  };

  TableButton.prototype.deleteTable = function($td) {
    var self = this;
    tables.deleteTable($td[0],function($block){
      if ($block.length > 0) {
        return self.editor.editable.selection.setRangeAtStartOf($block);
      }
    });
  };

  TableButton.prototype.command = function(param) {
    var $td;
    $td = this.editor.editable.selection.containerNode().closest('td, th');
    if (!($td.length > 0)) {
      return;
    }
    if (param === 'deleteRow') {
      this.deleteRow($td);
    } else if (param === 'insertRowAbove') {
      this.insertRow($td, 'before');
    } else if (param === 'insertRowBelow') {
      this.insertRow($td);
    } else if (param === 'deleteCol') {
      this.deleteCol($td);
    } else if (param === 'insertColLeft') {
      this.insertCol($td, 'before');
    } else if (param === 'insertColRight') {
      this.insertCol($td);
    } else if (param === 'deleteTable') {
      this.deleteTable($td);
    } else {
      return;
    }
    return this.editor.trigger('valuechanged');
  };

  RichEditor.Toolbar.addButton(TableButton);

  return TableButton;


});
define('skylark-widgets-richeditor/buttons/TitleButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button",
  "../i18n"
],function($,Toolbar,RichEditor,Button,i18n){ 
  var TitleButton = Button.inherit({

   });

  TitleButton.prototype.name = 'title';

  TitleButton.prototype.htmlTag = 'h1, h2, h3, h4, h5';

  TitleButton.prototype.disableTag = 'pre, table';

  TitleButton.prototype._init = function() {
    this.menu = [
      {
        name: 'normal',
        text: i18n.translate('normalText'),
        param: 'p'
      }, '|', {
        name: 'h1',
        text: i18n.translate('title') + ' 1',
        param: 'h1'
      }, {
        name: 'h2',
        text: i18n.translate('title') + ' 2',
        param: 'h2'
      }, {
        name: 'h3',
        text: i18n.translate('title') + ' 3',
        param: 'h3'
      }, {
        name: 'h4',
        text: i18n.translate('title') + ' 4',
        param: 'h4'
      }, {
        name: 'h5',
        text: i18n.translate('title') + ' 5',
        param: 'h5'
      }
    ];
    return Button.prototype._init.call(this);
  };

  TitleButton.prototype.setActive = function(active, param) {
    Button.prototype.setActive.call(this, active);
    if (active) {
      param || (param = this.node[0].tagName.toLowerCase());
    }
    this.el.removeClass('active-p active-h1 active-h2 active-h3 active-h4 active-h5');
    if (active) {
      return this.el.addClass('active active-' + param);
    }
  };

  TitleButton.prototype.command = function(param) {
    return this.editor.editable.title(param,this.disableTag);
  };

  RichEditor.Toolbar.addButton(TitleButton);

  return TitleButton;

});
define('skylark-widgets-richeditor/buttons/UnderlineButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "../Button"
],function($,Toolbar,RichEditor,Button){
  var UnderlineButton = Button.inherit({

   });


  UnderlineButton.prototype.name = 'underline';

  UnderlineButton.prototype.icon = 'underline';

  UnderlineButton.prototype.htmlTag = 'u';

  UnderlineButton.prototype.disableTag = 'pre';

  UnderlineButton.prototype.shortcut = 'cmd+u';

  UnderlineButton.prototype.render = function() {
    if (this.editor.editable.util.os.mac) {
      this.title = this.title + ' ( Cmd + u )';
    } else {
      this.title = this.title + ' ( Ctrl + u )';
      this.shortcut = 'ctrl+u';
    }
    return Button.prototype.render.call(this);
  };

  UnderlineButton.prototype._activeStatus = function() {
    var active;
    active = this.editor.editable.isActive('underline');
    this.setActive(active);
    return this.active;
  };

  UnderlineButton.prototype.command = function() {
    return this.editor.editable.underline();
  };


  RichEditor.Toolbar.addButton(UnderlineButton);

  return UnderlineButton;

});
define('skylark-widgets-richeditor/buttons/UnorderListButton',[
  "skylark-utils-dom/query",
  "../Toolbar",
  "../RichEditor",
  "./ListButton"
],function($,Toolbar,RichEditor,ListButton){ 
   var UnorderListButton = ListButton.inherit({

   });

    UnorderListButton.prototype.type = 'ul';

    UnorderListButton.prototype.name = 'ul';

    UnorderListButton.prototype.icon = 'list-ul';

    UnorderListButton.prototype.htmlTag = 'ul';

    UnorderListButton.prototype.shortcut = 'cmd+.';

    UnorderListButton.prototype._init = function() {
      if (this.editor.editable.util.os.mac) {
        this.title = this.title + ' ( Cmd + . )';
      } else {
        this.title = this.title + ' ( Ctrl + . )';
        this.shortcut = 'ctrl+.';
      }
      return ListButton.prototype._init.call(this);
    };

    RichEditor.Toolbar.addButton(UnorderListButton);  

    return UnorderListButton;

});
define('skylark-widgets-richeditor/main',[
  "./RichEditor", 
  "./Button", 
  "./Popover", 

  "./buttons/AlignmentButton", 
  "./buttons/BlockquoteButton", 
  "./buttons/BoldButton", 
  "./buttons/CodeButton", 
  "./buttons/CodePopover", 
  "./buttons/ColorButton", 
  "./buttons/FontScaleButton", 
  "./buttons/HrButton", 
  "./buttons/ImageButton", 
  "./buttons/ImagePopover", 
  "./buttons/IndentButton", 
  "./buttons/ItalicButton", 
  "./buttons/LinkButton", 
  "./buttons/LinkPopover", 
  "./buttons/ListButton", 
  "./buttons/OrderListButton", 
  "./buttons/OutdentButton",
  "./buttons/StrikethroughButton", 
  "./buttons/TableButton", 
  "./buttons/TitleButton", 
  "./buttons/UnderlineButton", 
  "./buttons/UnorderListButton"
],function(RichEditor){
	
  return RichEditor;
});
define('skylark-widgets-richeditor', ['skylark-widgets-richeditor/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-widgets-richeditor.js.map
