(function () {
    var postsPerPage = 6;
    var blogList = document.getElementById("blog-list");
    var paginationRoot = document.getElementById("blog-pagination");
    var blogItems = blogList ? Array.prototype.slice.call(blogList.querySelectorAll(".js-blog-item")) : [];

    if (!blogList || !paginationRoot || !blogItems.length) {
        return;
    }

    var totalPages = Math.ceil(blogItems.length / postsPerPage);

    function getPageFromUrl() {
        var requestedPage = parseInt(new URLSearchParams(window.location.search).get("page") || "1", 10);
        if (Number.isNaN(requestedPage) || requestedPage < 1) {
            return 1;
        }
        if (requestedPage > totalPages) {
            return totalPages;
        }
        return requestedPage;
    }

    function getPageUrl(page) {
        var safePage = page < 1 ? 1 : page;
        var url = new URL(window.location.href);

        if (safePage === 1) {
            url.searchParams.delete("page");
        } else {
            url.searchParams.set("page", String(safePage));
        }

        return url.pathname + url.search + url.hash;
    }

    function createPageLink(page, className, text, ariaLabel, isHtml) {
        var link = document.createElement("a");
        link.className = className;
        link.href = getPageUrl(page);
        link.setAttribute("data-page", String(page));
        if (ariaLabel) {
            link.setAttribute("aria-label", ariaLabel);
        }
        if (isHtml) {
            link.innerHTML = text;
        } else {
            link.textContent = text;
        }
        return link;
    }

    function renderPosts(currentPage) {
        var startIndex = (currentPage - 1) * postsPerPage;
        var endIndex = startIndex + postsPerPage;

        blogItems.forEach(function (item, index) {
            var isVisible = index >= startIndex && index < endIndex;
            item.style.display = isVisible ? "" : "none";
            item.toggleAttribute("hidden", !isVisible);
        });
    }

    function renderPagination(currentPage) {
        paginationRoot.innerHTML = "";

        if (totalPages <= 1) {
            return;
        }

        var list = document.createElement("ul");

        if (currentPage > 1) {
            var prevItem = document.createElement("li");
            prevItem.appendChild(
                createPageLink(
                    currentPage - 1,
                    "prev page-numbers",
                    '<i class="tji-arrow-left"></i>',
                    "Previous page",
                    true
                )
            );
            list.appendChild(prevItem);
        }

        for (var page = 1; page <= totalPages; page++) {
            var pageItem = document.createElement("li");

            if (page === currentPage) {
                var currentPageLabel = document.createElement("span");
                currentPageLabel.className = "page-numbers current";
                currentPageLabel.setAttribute("aria-current", "page");
                currentPageLabel.textContent = String(page).padStart(2, "0");
                pageItem.appendChild(currentPageLabel);
            } else {
                pageItem.appendChild(
                    createPageLink(page, "page-numbers", String(page).padStart(2, "0"), "Page " + page, false)
                );
            }

            list.appendChild(pageItem);
        }

        if (currentPage < totalPages) {
            var nextItem = document.createElement("li");
            nextItem.appendChild(
                createPageLink(
                    currentPage + 1,
                    "next page-numbers",
                    '<i class="tji-arrow-right"></i>',
                    "Next page",
                    true
                )
            );
            list.appendChild(nextItem);
        }

        paginationRoot.appendChild(list);
    }

    function renderPage(page, updateHistory) {
        var safePage = page < 1 ? 1 : page > totalPages ? totalPages : page;
        renderPosts(safePage);
        renderPagination(safePage);

        if (updateHistory) {
            window.history.pushState({ page: safePage }, "", getPageUrl(safePage));
            window.scrollTo({ top: blogList.offsetTop - 120, behavior: "smooth" });
        } else if (window.location.search !== new URL(getPageUrl(safePage), window.location.origin).search) {
            window.history.replaceState({ page: safePage }, "", getPageUrl(safePage));
        }
    }

    paginationRoot.addEventListener("click", function (event) {
        var target = event.target.closest("a[data-page]");

        if (!target) {
            return;
        }

        event.preventDefault();
        var page = parseInt(target.getAttribute("data-page"), 10);

        if (Number.isNaN(page)) {
            return;
        }

        renderPage(page, true);
    });

    window.addEventListener("popstate", function () {
        renderPage(getPageFromUrl(), false);
    });

    renderPage(getPageFromUrl(), false);
})();
