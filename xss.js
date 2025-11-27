(function(){
  const TARGET = "aaa";

  function replaceInUrl(u){
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

  function replaceInBody(body){
    if(!body) return body;

    if(typeof body === "string"){
      return body.replace(/\b(code=)[^&]*/ig, "$1" + TARGET);
    }

    if(body instanceof URLSearchParams){
      if(body.has("code")){
        body.set("code", TARGET);
      }
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

  const origFetch = window.fetch;
  window.fetch = function(input, init){
    try{
      if(typeof input === "string"){
        input = replaceInUrl(input);
      }else if(input instanceof Request){
        const newUrl = replaceInUrl(input.url);
        input = new Request(newUrl, input);
      }

      if(init && init.body){
        init.body = replaceInBody(init.body);
      }
    }catch(e){}
    return origFetch.call(this, input, init);
  };

  const XHR = XMLHttpRequest.prototype;
  const origOpen = XHR.open;
  const origSend = XHR.send;

  XHR.open = function(method, url){
    try{
      url = replaceInUrl(url);
    }catch(e){}
    return origOpen.call(this, method, url, ...Array.prototype.slice.call(arguments, 2));
  };

  XHR.send = function(body){
    try{
      body = replaceInBody(body);
    }catch(e){}
    return origSend.call(this, body);
  };

  console.log("code param rewrite active");
})();
