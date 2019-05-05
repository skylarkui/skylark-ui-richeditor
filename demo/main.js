require.config({
  baseUrl: "./"
  , shim: {
  }
  ,packages : [
     { name: "skylark-langx", location: "../node_modules/skylark-langx/dist/uncompressed/skylark-langx" },
     { name: "skylark-utils-dom", location: "../node_modules/skylark-utils-dom/dist/uncompressed/skylark-utils-dom"},
     { name: "skylark-ui-contents", location: "../node_modules/skylark-ui-contents/dist/uncompressed/skylark-ui-contents"},
     { name: "skylark-richeditor", location: "../src" }
  ],
});
 
require([
  "skylark-utils-dom/query",
  "skylark-richeditor"

],function($,RichEditor){
//  $(function() {
    var $preview, editor, mobileToolbar, toolbar;
    RichEditor.i18n.locale = 'en-US';
    toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough', 'fontScale', 'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|', 'link', 'image', 'hr', '|', 'indent', 'outdent', 'alignment'];
    mobileToolbar = ["bold", "underline", "strikethrough", "color", "ul", "ol"];
    if (mobilecheck()) {
      toolbar = mobileToolbar;
    }
    editor = new RichEditor({
      textarea: $('#txt-content'),
      placeholder: '这里输入文字...',
      toolbar: toolbar,
      pasteImage: true,
      defaultImage: './fork.png',
      upload: location.search === '?upload' ? {
        url: '/upload'
      } : false
    });
    $preview = $('#preview');
    if ($preview.length > 0) {
      return editor.on('valuechanged', function(e) {
        return $preview.html(editor.getValue());
      });
    }
//  });

});
