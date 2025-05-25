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
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><li class="part-title">Introduction</li><li class="chapter-item expanded "><a href="intro/intro.html"><strong aria-hidden="true">1.</strong> Intro</a></li><li class="chapter-item expanded "><a href="intro/why.html"><strong aria-hidden="true">2.</strong> Why Sric</a></li><li class="chapter-item expanded "><a href="intro/Tour.html"><strong aria-hidden="true">3.</strong> Tutorial</a></li><li class="chapter-item expanded "><a href="intro/DiffCpp.html"><strong aria-hidden="true">4.</strong> From C++ to Sric</a></li><li class="chapter-item expanded "><a href="intro/memory.html"><strong aria-hidden="true">5.</strong> Memory Safety</a></li><li class="chapter-item expanded affix "><li class="part-title">Get Start</li><li class="chapter-item expanded "><a href="start/build.html"><strong aria-hidden="true">6.</strong> Install</a></li><li class="chapter-item expanded "><a href="start/Start.html"><strong aria-hidden="true">7.</strong> Quick Start</a></li><li class="chapter-item expanded "><a href="start/example.html"><strong aria-hidden="true">8.</strong> Example</a></li><li class="chapter-item expanded affix "><li class="part-title">Learn</li><li class="chapter-item expanded "><a href="learn/basic.html"><strong aria-hidden="true">9.</strong> Basic</a></li><li class="chapter-item expanded "><a href="learn/types.html"><strong aria-hidden="true">10.</strong> Types</a></li><li class="chapter-item expanded "><a href="learn/stmt.html"><strong aria-hidden="true">11.</strong> Expression</a></li><li class="chapter-item expanded "><a href="learn/oo.html"><strong aria-hidden="true">12.</strong> Object-Oriented</a></li><li class="chapter-item expanded "><a href="learn/other_struct.html"><strong aria-hidden="true">13.</strong> Other Structures</a></li><li class="chapter-item expanded "><a href="learn/generic.html"><strong aria-hidden="true">14.</strong> Template Generics</a></li><li class="chapter-item expanded "><a href="learn/closure.html"><strong aria-hidden="true">15.</strong> Closure</a></li><li class="chapter-item expanded "><a href="learn/operator.html"><strong aria-hidden="true">16.</strong> Operator Overloading</a></li><li class="chapter-item expanded "><a href="learn/module.html"><strong aria-hidden="true">17.</strong> Modularization</a></li><li class="chapter-item expanded affix "><li class="part-title">Library</li><li class="chapter-item expanded "><a href="stdlib/stdlib.html"><strong aria-hidden="true">18.</strong> Std Lib</a></li><li class="chapter-item expanded "><a href="stdlib/autoptr.html"><strong aria-hidden="true">19.</strong> Auto Pointer</a></li><li class="chapter-item expanded affix "><li class="part-title">Advance</li><li class="chapter-item expanded "><a href="advance/reflect.html"><strong aria-hidden="true">20.</strong> Reflect</a></li><li class="chapter-item expanded "><a href="advance/coroutine.html"><strong aria-hidden="true">21.</strong> Coroutine</a></li><li class="chapter-item expanded "><a href="advance/cpp.html"><strong aria-hidden="true">22.</strong> C++ Interaction</a></li><li class="chapter-item expanded "><a href="advance/serial.html"><strong aria-hidden="true">23.</strong> Serialization</a></li><li class="chapter-item expanded affix "><li class="part-title">Others</li><li class="chapter-item expanded "><a href="others/conventions.html"><strong aria-hidden="true">24.</strong> Conventions</a></li><li class="chapter-item expanded "><a href="others/faq.html"><strong aria-hidden="true">25.</strong> FAQ</a></li><li class="chapter-item expanded "><a href="others/cmd.html"><strong aria-hidden="true">26.</strong> Command Line</a></li></ol>';
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
