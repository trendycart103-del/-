// Makes the page's "download backup" (Blob + <a download>) work inside Android's WebView.
// It hands the file to the native side, which opens the system "Save as" screen.
(function () {
  if (window.__appBridgeInstalled) return;
  window.__appBridgeInstalled = true;

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[download]') : null;
    if (!a || !a.href || a.href.indexOf('blob:') !== 0) return;
    e.preventDefault();

    var name = a.getAttribute('download') || 'file';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', a.href, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        var s = String(reader.result);
        AppBridge.saveBase64(name, s.substring(s.indexOf(',') + 1));
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.send();
  }, true);
})();
