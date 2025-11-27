// 1. create iframe and load page
const f = document.createElement("iframe");
f.src = "https://sso.shengwang.cn/profile";
f.style.width = "100%";
f.style.height = "800px";
document.body.appendChild(f);

// 2. hook current page requests and replace code=xxx with code=aaa
(function(){
  const TARGET = "aaa";

  function fixUrl(u){
    try{
      let url = new URL(u, location.href);
      if(url.searchParams.has("code")){
        url.searchParams.set("code", TARGET);
        return url.toString();
      }
      return u;
    }catch(e){
      return u.replace(/([?&]code=)[^&]*/i, "$1" + TARGET);
    }
  }

  function fixBody(body){
    if(!body) return body;

    if(typeof body === "string"){
      return body.replace(/\b(code=)[^&]*/ig, "$1" + TARGET);
    }
    if(body instanceof URLSearchParams){
      if(body.has("code")) body.set("code", TARGET);
      return body;
    }
    if(body instanceof FormData){
      if(body.has("code")){
        body.delete("code");
        body.append("code", TARGET);
      }
      return body;
    }
    return body;
  }

  // hook fetch
  const origFetch = window.fetch;
  window.fetch = function(input, init){
    if(typeof input === "string"){
      input = fixUrl(input);
    }else if(input instanceof Request){
      input = new Request(fixUrl(input.url), input);
    }
    if(init && init.body) init.body = fixBody(init.body);
    return origFetch.call(this, input, init);
  };

  // hook XHR
  const XHR = XMLHttpRequest.prototype;
  const origOpen = XHR.open;
  const origSend = XHR.send;

  XHR.open = function(method, url){
    return origOpen.call(this, method, fixUrl(url), ...Array.prototype.slice.call(arguments, 2));
  };
  XHR.send = function(body){
    return origSend.call(this, fixBody(body));
  };

  console.log("request rewrite active");
})();
