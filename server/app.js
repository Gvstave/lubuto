const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const config = require("./config.json");
const lessonRoutes = require("./routes/lessons");

const app = express();

app.use(cors());
app.use(express.json());

const lessonsDirectory = process.env.LESSONS_DIR
  ? process.env.LESSONS_DIR
  : path.isAbsolute(config.lessonDirectory)
    ? config.lessonDirectory
    : path.resolve(
        __dirname,
        "..",
        config.lessonDirectory
      );

console.log("Lessons directory:", lessonsDirectory);

app.get("/lessons/lesson-theme.css", (req, res) => {
  res.type("css").send('@import url("/lessons/lesson-layout.css");');
});

app.get("/lesson-theme.css", (req, res) => {
  res.type("css").send('@import url("/lessons/lesson-layout.css");');
});

app.get("/buttons.css", (req, res) => {
  res.sendFile(path.join(lessonsDirectory, "buttons.css"));
});

app.use("/lessons", (req, res, next) => {
  const parts = req.path.split("/").filter(Boolean);
  if (parts.length < 3 || !parts.at(-1).endsWith(".html")) return next();

  const decodedParts = parts.map((part) => decodeURIComponent(part));
  const lessonPath = path.resolve(lessonsDirectory, ...decodedParts);
  const lessonsRoot = path.resolve(lessonsDirectory);

  if (!lessonPath.startsWith(`${lessonsRoot}${path.sep}`) || !fs.existsSync(lessonPath)) {
    return next();
  }

  const html = fs.readFileSync(lessonPath, "utf8");
  const layoutOverrides = `<style>
    html, body {
      height: auto !important;
      min-height: 100% !important;
      overflow-y: auto !important;
    }

    #content,
    #main-wrapper,
    #main {
      width: 100% !important;
      box-sizing: border-box !important;
    }

    #content {
      max-width: 1230px !important;
      min-width: 0 !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    #main-wrapper {
      max-width: none !important;
    }

    @media screen and (min-width: 769px) {
      #siteNav {
        width: 279px !important;
        float: left !important;
        margin: 0 0 30px !important;
        padding-right: 20px !important;
        border: 0 !important;
        line-height: normal !important;
        background: transparent !important;
      }

      #siteNav ul,
      #siteNav li {
        float: none !important;
        width: auto !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        background: transparent !important;
      }

      #siteNav li ul {
        position: static !important;
        left: auto !important;
        width: auto !important;
        border: 0 !important;
      }

      #main-wrapper {
        width: auto !important;
        float: none !important;
        padding: 0 25px 24px 305px !important;
      }

      #header-options {
        position: absolute !important;
        top: 82px !important;
        right: 25px !important;
      }

      #header-options #toggle-nav,
      #header-options #lubuto-toggle-nav {
        display: inline-flex !important;
        align-items: center;
        justify-content: center;
        width: 56px;
        height: 56px;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box;
        border: 4px solid #3d2b1f;
        border-radius: 12px;
        background: #ffd54f !important;
        box-shadow: inset 0 -6px 0 #f9a825 !important;
        color: transparent !important;
        font-size: 0;
      }

      #header-options #toggle-nav svg,
      #header-options #lubuto-toggle-nav svg {
        width: 24px;
        height: 24px;
        fill: #fff;
        stroke: #3d2b1f;
        stroke-width: 2;
        stroke-linejoin: round;
      }
    }

    #topPagination .pagination {
      display: flex !important;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
    }

    #topPagination .pagination a.prev,
    #topPagination .pagination a.next {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      min-width: 56px;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box;
      overflow: hidden;
      border: 4px solid #3d2b1f;
      border-radius: 28px;
      background: #ffd54f !important;
      box-shadow: inset 0 -8px 0 #f9a825;
      color: transparent !important;
      font-size: 0;
      text-decoration: none;
    }

    #topPagination .pagination a.prev::before,
    #topPagination .pagination a.next::before {
      color: #fff;
      font-size: 30px;
      font-weight: 900;
      line-height: 1;
      text-shadow:
        -2px -2px 0 #3d2b1f,
        2px -2px 0 #3d2b1f,
        -2px 2px 0 #3d2b1f,
        2px 2px 0 #3d2b1f;
    }

    #topPagination .pagination a.prev::before { content: "←"; }
    #topPagination .pagination a.next::before { content: "→"; }
    #topPagination .pagination a.prev span,
    #topPagination .pagination a.next span { display: none; }

    @media all and (max-width: 768px) {
      #topPagination .pagination a.prev,
      #topPagination .pagination a.next {
        width: 52px;
        height: 52px;
        min-width: 52px;
      }
    }
  </style>`;
  const menuMessageHandler = `<script>
    function syncLessonMenuState() {
      var siteNav = document.getElementById("siteNav");
      if (!siteNav || !document.body) return;
      document.body.classList.toggle("no-nav", getComputedStyle(siteNav).display === "none");
    }

    function removeLegacyHideToggle() {
      document.querySelectorAll("a#toggle-nav.hide-nav").forEach(function (toggle) {
        toggle.remove();
      });
      syncLessonMenuState();
    }

    window.addEventListener("DOMContentLoaded", function () {
      removeLegacyHideToggle();
      var siteNav = document.getElementById("siteNav");
      if (siteNav) {
        new MutationObserver(syncLessonMenuState).observe(siteNav, {
          attributes: true,
          attributeFilter: ["style", "class"]
        });
      }
      document.addEventListener("click", function (event) {
        if (event.target.closest("#toggle-nav, #lubuto-toggle-nav")) {
          window.setTimeout(syncLessonMenuState, 0);
        }
      });
    });

    window.addEventListener("message", function (event) {
      if (event.data && event.data.type === "lubuto:close-menu") {
        var siteNav = document.getElementById("siteNav");
        if (siteNav) siteNav.style.display = "none";
        syncLessonMenuState();
      }
    });
  </script>`;
  const menuButton = /id=["'](?:header-options|toggle-nav)["']/i.test(html) ||
    /(?:^|["'])[^"']*_intef_js\.js(?:["']|$)/i.test(html)
    ? ""
    : `<div id="header-options">
    <a href="#" id="lubuto-toggle-nav" class="kid-btn" aria-label="Menu" onclick="var n=document.getElementById('siteNav'); var hidden=n.style.display==='none'; n.style.display=hidden?'block':'none'; document.body.classList.toggle('no-nav',!hidden); return false;">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
    </a>
  </div>`;
  const activityBootstrap = `<script>
    window.addEventListener("DOMContentLoaded", function () {
      if (!window.jQuery || !window.EXEDragNDrop) return;

      document.querySelectorAll("[id^='exednd_master_container_']").forEach(function (container) {
        var match = container.id.match(/^exednd_master_container_(.+)$/);
        if (!match) return;

        var id = match[1];
        var instance = new EXEDragNDrop(id);
        EXEDragNDropInstance[id] = instance;
        instance.initInteraction();
      });

      window.addEventListener("resize", function () {
        Object.keys(EXEDragNDropInstance).forEach(function (id) {
          EXEDragNDropInstance[id].autoResize();
        });
      });
    });
  </script>`;
  const normalizeNavigationButtons = (documentHtml) => documentHtml.replace(
    /(<div id=['"]topPagination['"][\s\S]*?<\/div>\s*<\/div>)/i,
    (pagination) => pagination
      .replace(
        /<a\b([^>]*\bhref=["']([^"']+)["'][^>]*)\bclass=["'][^"']*\bprev\b[^"']*["'][^>]*>[\s\S]*?<\/a>/i,
        '<a href="$2" class="kid-btn btn-back" aria-label="Previous page"><svg viewBox="0 0 24 24"><path d="M12 4 l-8 8 l8 8 v-5 h8 v-6 h-8 Z" /></svg></a>',
      )
      .replace(
        /<a\b([^>]*\bhref=["']([^"']+)["'][^>]*)\bclass=["'][^"']*\bnext\b[^"']*["'][^>]*>[\s\S]*?<\/a>/i,
        '<a href="$2" class="kid-btn btn-next" aria-label="Next page"><svg viewBox="0 0 24 24"><path d="M12 4 l8 8 l-8 8 v-5 H4 v-6 h8 Z" /></svg></a>',
      ),
  );
  const lessonHtml = normalizeNavigationButtons(html)
    .replace(/(<div id=["']emptyHeader["'][^>]*><\/div>)/i, `$1${menuButton}`)
    .replace("</head>", `${layoutOverrides}${menuMessageHandler}${activityBootstrap}</head>`)
    .replace(/<div id=["']siteNav["']>/i, '<div id="siteNav" style="display: none;">');
  res.type("html").send(lessonHtml);
});

app.use(
  "/lessons",
  express.static(lessonsDirectory)
);

app.use("/api", lessonRoutes);

app.use(
  express.static(
    path.resolve(__dirname, "dist")
  )
);

app.use((req, res, next) => {
  if (
    req.path.startsWith("/api") ||
    req.path.startsWith("/lessons")
  ) {
    return next();
  }

  res.sendFile(
    path.resolve(
      __dirname,
      "dist",
      "index.html"
    )
  );
});

module.exports = app;