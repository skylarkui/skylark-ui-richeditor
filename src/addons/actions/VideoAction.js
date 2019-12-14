define([
  "skylark-langx/langx",
  "skylark-domx-query",
  "../../addons",
  "../../Action",
  "./VideoPopover"
],function(langx,$,addons,Action,VideoPopover){ 
  
   var VideoAction = Action.inherit({
      name : 'video',

      icon : 'video',

      htmlTag : 'embed, iframe',

      disableTag : 'pre, table, div',

      videoPlaceholder : 'video',

      videoContainerClass : 'video-container',

      videoPoster : 'http://pic.yupoo.com/ccking/ESzA3WGs/svIoz.png',

      needFocus : true,

      _init : function() {
        this.title = this._t(this.name);
        langx.merge(this.editor.editable.formatter._allowedTags, ['embed', 'iframe', 'video']);
        langx.extend(this.editor.editable.formatter._allowedAttributes, {
          embed: ['class', 'width', 'height', 'type', 'pluginspage', 'src', 'wmode', 'play', 'loop', 'menu', 'allowscriptaccess', 'allowfullscreen'],
          iframe: ['class', 'width', 'height', 'src', 'frameborder'],
          video: ['class', 'width', 'height', 'poster', 'controls', 'allowfullscreen', 'src', 'data-link', 'data-tag']
        });
        $(document).on('click', '.J_UploadVideoBtn', (function(_this) {
          return function(e) {
            var videoData;
            videoData = {
              link: $('.video-link').val(),
              width: $('#video-width').val() || 100,
              height: $('#video-height').val() || 100
            };
            $('.video-link').val('');
            $('#video-width').val('');
            $('#video-height').val('');
            return _this.loadVideo($('.J_UploadVideoBtn').data('videowrap'), videoData, function() {
              return _this.editor.trigger('valuechanged');
            });
          };
        })(this));
        this.editor.body.on('click', 'video', (function(_this) {
          return function(e) {
            var $video, range;
            $video = $(e.currentTarget);
            _this.popover.show($video);
            range = document.createRange();
            range.selectNode($video[0]);
            _this.editor.editable.selection.range(range);
            if (!_this.editor.editable.util.support.onselectionchange) {
              _this.editor.trigger('selectionchanged');
            }
            return false;
          };
        })(this));
        this.editor.body.on('mouseenter', '.wordpad-video .real-video', (function(_this) {
          return function(e) {
            var $video = $(e.currentTarget).siblings('video').show();
            return _this.popover.show($video);
          };
        })(this));
        this.editor.body.on('mousedown', (function(_this) {
          return function() {
            var $videoWrap;
            $videoWrap = $('.J_UploadVideoBtn').data('videowrap');
            if ($videoWrap && $videoWrap.html() === _this.videoPlaceholder) {
              $videoWrap.remove();
              $('.J_UploadVideoBtn').data('videowrap', null);
            }
            return _this.popover.hide();
          };
        })(this));
        this.editor.on('decorate', (function(_this) {
          return function(e, $el) {
            return $el.find('video').each(function(i, video) {
              return _this.decorate($(video));
            });
          };
        })(this));
        this.editor.on('undecorate', (function(_this) {
          return function(e, $el) {
            return $el.find('video').each(function(i, video) {
              return _this.undecorate($(video));
            });
          };
        })(this));

        this.popover = new VideoPopover({
          action: this
        });
        return Action.prototype._init.call(this);
      },


      decorate : function($video) {
        var videoData, videoSrc;
        videoData = {
          tag: $video.attr('data-tag'),
          link: $video.attr('data-link'),
          width: $video.attr('width'),
          height: $video.attr('height')
        };
        videoSrc = this.parseVideo(videoData);
        if ($video.parent('.wordpad-video').length > 0) {
          this.undecorate($video);
        }
        $video.wrap('<p class="wordpad-video"></p>');
        $video.parent().prepend(videoSrc);
        $video.hide();
        return $video.parent();
      },

      undecorate : function($video) {
        if (!($video.parent('.wordpad-video').length > 0)) {
          return;
        }
        $video.siblings('.real-video').remove();
        return $video.parent().replaceWith($video);
      },

      _execute : function() {
        var $video, _self;
        _self = this;
        $video = this.createVideo();
        return this.popover.show($video);
      },

      _status : function() {
        return this._disableStatus();
      },

      loadVideo : function($video, videoData, callback) {
        var e, originNode, realVideo, videoLink, videoTag;
        if (!videoData.link && !$video.attr('data-link')) {
          $video.remove();
        } else {
          if (!videoData.link) {
            videoData.link = $video.attr('data-link');
          }
          try {
            originNode = $(videoData.link);
            videoTag = originNode.get(0).tagName.toLowerCase();
            videoLink = originNode.attr('src');
          } catch (_error) {
            e = _error;
            videoLink = videoData.link;
            videoTag = '';
          }
          videoData.tag = videoTag;
          $video.attr({
            'data-link': videoLink,
            'data-tag': videoTag,
            'width': videoData.width || 100,
            'height': videoData.height || 100
          });
          realVideo = $video.siblings('.real-video');
          if (realVideo.length) {
            videoData.link = videoLink;
            realVideo.replaceWith(this.parseVideo(videoData));
          } else {
            this.decorate($video);
          }
        }
        this.popover.hide();
        return callback($video);
      },

      createVideo : function() {
        var $videoWrap, range;
        if (!this.editor.editable.inputManager.focused) {
          this.editor.focus();
        }
        range = this.editor.editable.selection.range();
        if (range) {
          range.deleteContents();
          this.editor.editable.selection.range(range);
        }
        $videoWrap = $('<video/>').attr({
          'poster': this.videoPoster,
          'width': 100,
          'height': 100
        });
        range.insertNode($videoWrap[0]);
        this.editor.editable.selection.setRangeAfter($videoWrap, range);
        this.editor.trigger('valuechanged');
        return $videoWrap;
      },

      parseVideo : function(videoData) {
        var src;
        switch (videoData.tag) {
          case 'embed':
            src = '<embed class="real-video" width=' + videoData.width + ' height= ' + videoData.height + ' src="' + videoData.link + ' "type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" wmode="transparent" loop="false" menu="false" allowscriptaccess="never" allowfullscreen="true">';
            break;
          case 'iframe':
            src = '<iframe class="real-video" width=' + videoData.width + ' height= ' + videoData.height + ' src=" ' + videoData.link + '" frameborder=0 allowfullscreen></iframe>';
            break;
          default:
            src = videoData.link;
        }
        return src;

      }

   });


   addons.actions.video = VideoAction; 

   return VideoAction;

});