/**
 * AUROS Resolve embed — Intel Inside for RWA assets.
 * Usage: <script src="https://getauros.com/auros-resolve.js" data-auros-dna="auros:dna:v1:…" data-theme="dark"></script>
 */
(function () {
  var script = document.currentScript;
  if (!script) return;
  var dna = script.getAttribute("data-auros-dna") || script.getAttribute("data-id") || "";
  var theme = script.getAttribute("data-theme") === "light" ? "light" : "dark";
  if (!dna) return;

  var iframe = document.createElement("iframe");
  iframe.title = "AUROS Resolve";
  iframe.src =
    "https://getauros.com/embed/asset-dna?id=" +
    encodeURIComponent(dna) +
    "&theme=" +
    encodeURIComponent(theme);
  iframe.loading = "lazy";
  iframe.style.cssText =
    "border:0;width:100%;max-width:360px;height:180px;border-radius:8px;overflow:hidden;";
  iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");

  if (script.parentNode) {
    script.parentNode.insertBefore(iframe, script.nextSibling);
  }
})();
