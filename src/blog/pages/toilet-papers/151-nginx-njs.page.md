---
tags: ["NGINX", "JavaScript", "Docker", "Web Development", "Toilet Paper"]
title: "Extending NGINX with JavaScript (NJS)"
description: >
  The much-loved NGINX has a limited feature-set.
  In this Toilet Paper you'll learn how to extend it with custom JavaScript code (NJS).
created: "2021-11-12"
modified: "2022-08-21"
originalSource: "https://jambit.com/aktuelles/toilet-papers/nginx-mit-javascript-njs-erweitern/"
---

## Problem

You are using NGINX as application server, load balancer, etc. but the normal configuration is too limited? For example, you want to redirect to a language-specific URL through the accept-language header?

## Solution

NGINX has a module that allows to use a subset of JavaScript (NJS) to process requests. This uses its own engine, since V8 & Co are not fast enough. The NJS code is converted to bytecode, which makes the execution very fast (I measured the example of redirecting with "accept-language" in the network tab with 0ms).

## Example

Since the official documentation is unfortunately incomplete or outdated, here are the most important points as Docker setup:

### nginxLib.js

First, it needs a JavaScript file. SinceNJS is a subset of JS, you must partly work with older JS constructs (old for loop, no const/let, etc.). Fat Arrow functions do work however. Just try what works!

```js
function hello(r) {
  r.return(200, "Hello world!");
}

export default { hello };
```

### default.conf

Next, the nginx.conf must load this file and execute it at a location:

```conf
js_import /etc/nginx/conf.d/nginxLib.js;

server {
    # ...
    location = / {
        js_content nginxLib.hello;
    }
    # ...
}
```

### Dockerfile

Copy these files in the Docker file and also add a load_module statement to the root nginx.conf.

```dockerfile
FROM nginx:1.21.1-alpine

# ...
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./nginxLib.js /etc/nginx/conf.d/nginxLib.js

# Load njs module for nginx by inserting a line at the top of the root nginx.conf
RUN echo -e "load_module modules/ngx_http_js_module.so;\n$(cat /etc/nginx/nginx.conf)" > /etc/nginx/nginx.conf
# ...
```

The load_module statement unfortunately has to be part of the root nginx.conf because the configuration is hierarchical (e.g. global - http - server). Since the root nginx.conf imports our default.conf in the **http** section, all our statements are also in the **http** section. However, the load_module statement must be defined in the **global** section.

## Further Aspects

- Documentation: https://nginx.org/en/docs/njs/index.html,
- Video: https://www.youtube.com/watch?v=Jc_L6UffFOs
- Example accept-language https://gist.github.com/SantoJambit/2fdcf696645dc7ef72ca0e70ebbd7b4a
