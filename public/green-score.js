/**
 * AUROS Green Score embed widget — load via:
 * <script src="https://getauros.com/green-score.js" defer></script>
 * <div id="auros-green-score" data-id="toucan"></div>
 * <script>AurosGreenScore.mount("#auros-green-score");</script>
 */
(function (window, document) {
  "use strict";

  var DEFAULT_BASE = "https://getauros.com";

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render(el, data, base) {
    if (!data || !data.ok || !data.score) {
      el.innerHTML =
        '<div style="font-family:system-ui,sans-serif;font-size:12px;color:#f87171;padding:12px;border:1px solid rgba(248,113,113,.3);border-radius:12px;background:#0a0f0d">' +
        escapeHtml((data && data.error && data.error.message) || "Score unavailable") +
        "</div>";
      return;
    }
    var s = data.score;
    var metrics = "";
    metrics +=
      '<div><p style="margin:0;font-size:10px;text-transform:uppercase;color:rgba(255,255,255,.4)">Composite</p><p style="margin:4px 0 0;font-family:ui-monospace,monospace;font-size:24px;color:#34d399">' +
      s.composite_score +
      "</p></div>";
    if (s.carbon_quality) {
      metrics +=
        '<div><p style="margin:0;font-size:10px;text-transform:uppercase;color:rgba(255,255,255,.4)">CQS</p><p style="margin:4px 0 0;font-family:ui-monospace,monospace;font-size:24px;color:#34d399">' +
        s.carbon_quality.score +
        "</p></div>";
    }
    if (s.watt) {
      metrics +=
        '<div><p style="margin:0;font-size:10px;text-transform:uppercase;color:rgba(255,255,255,.4)">Watt</p><p style="margin:4px 0 0;font-family:ui-monospace,monospace;font-size:24px;color:#34d399">' +
        s.watt.rating +
        "</p></div>";
    }
    if (s.nature_score) {
      metrics +=
        '<div><p style="margin:0;font-size:10px;text-transform:uppercase;color:rgba(255,255,255,.4)">Nature</p><p style="margin:4px 0 0;font-family:ui-monospace,monospace;font-size:24px;color:#34d399">' +
        s.nature_score.score +
        "</p></div>";
    }
    var bench = s.benchmark
      ? '<p style="margin:8px 0 0;font-size:10px;color:rgba(255,255,255,.45)">' +
        escapeHtml(s.benchmark.label) +
        "</p>"
      : "";
    el.innerHTML =
      '<div style="font-family:system-ui,sans-serif;border:1px solid rgba(16,185,129,.3);border-radius:12px;padding:16px;background:#0a0f0d;color:#fff;box-shadow:0 4px 24px rgba(0,0,0,.4)">' +
      '<p style="margin:0;font-family:ui-monospace,monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(52,211,153,.8)">AUROS Green Score</p>' +
      '<p style="margin:8px 0 0;font-size:14px;font-weight:500;color:rgba(255,255,255,.9)">' +
      escapeHtml(s.name) +
      "</p>" +
      '<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:16px">' +
      metrics +
      "</div>" +
      bench +
      '<a href="' +
      base +
      "/green/api?utm_source=widget&id=" +
      encodeURIComponent(s.id) +
      '" target="_blank" rel="noopener" style="display:inline-block;margin-top:12px;font-size:10px;color:rgba(52,211,153,.7);text-decoration:none">Powered by AUROS →</a>' +
      "</div>";
  }

  function mount(elOrSelector, opts) {
    opts = opts || {};
    var el =
      typeof elOrSelector === "string"
        ? document.querySelector(elOrSelector)
        : elOrSelector;
    if (!el) return;
    var id = opts.id || el.getAttribute("data-id") || "toucan";
    var base = (opts.baseUrl || el.getAttribute("data-base") || DEFAULT_BASE).replace(
      /\/$/,
      ""
    );
    el.innerHTML =
      '<div style="font-family:system-ui,sans-serif;font-size:12px;color:rgba(52,211,153,.6);padding:12px">AUROS Green…</div>';
    fetch(base + "/api/green/score/" + encodeURIComponent(id))
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        render(el, data, base);
      })
      .catch(function () {
        el.innerHTML =
          '<div style="font-size:12px;color:#f87171">Network error</div>';
      });
  }

  function autoMount() {
    var nodes = document.querySelectorAll("[data-auros-green-score]");
    for (var i = 0; i < nodes.length; i++) {
      mount(nodes[i], { id: nodes[i].getAttribute("data-id") || undefined });
    }
  }

  window.AurosGreenScore = { mount: mount, autoMount: autoMount };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount);
  } else {
    autoMount();
  }
})(window, document);
