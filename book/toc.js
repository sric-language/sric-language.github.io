// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><li class="part-title">介绍</li><li class="chapter-item expanded "><a href="why.html"><strong aria-hidden="true">1.</strong> 为什么使用Sric</a></li><li class="chapter-item expanded "><a href="Tour.html"><strong aria-hidden="true">2.</strong> 语法概览</a></li><li class="chapter-item expanded "><a href="DiffCpp.html"><strong aria-hidden="true">3.</strong> 和C++的区别</a></li><li class="chapter-item expanded affix "><li class="part-title">学习</li><li class="chapter-item expanded "><a href="Start.html"><strong aria-hidden="true">4.</strong> 快速开始</a></li><li class="chapter-item expanded "><a href="basic.html"><strong aria-hidden="true">5.</strong> 编程基础</a></li><li class="chapter-item expanded "><a href="types.html"><strong aria-hidden="true">6.</strong> 类型系统</a></li><li class="chapter-item expanded "><a href="struct.html"><strong aria-hidden="true">7.</strong> 程序结构</a></li><li class="chapter-item expanded "><a href="stmt.html"><strong aria-hidden="true">8.</strong> 语句和表达式</a></li><li class="chapter-item expanded "><a href="others.html"><strong aria-hidden="true">9.</strong> 其他特性</a></li><li class="chapter-item expanded "><a href="module.html"><strong aria-hidden="true">10.</strong> 模块化</a></li><li class="chapter-item expanded affix "><li class="part-title">高级</li><li class="chapter-item expanded "><a href="cpp.html"><strong aria-hidden="true">11.</strong> C++交互</a></li><li class="chapter-item expanded "><a href="serial.html"><strong aria-hidden="true">12.</strong> 序列化</a></li><li class="chapter-item expanded affix "><li class="part-title">其他</li><li class="chapter-item expanded "><a href="conventions.html"><strong aria-hidden="true">13.</strong> 编码约定</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
