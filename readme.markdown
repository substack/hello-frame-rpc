# hello-frame-rpc

client/server-style RPC for iframe postMessage communication

This package provides some setup on top of
[frame-rpc](https://npmjs.com/package/frame-rpc) to configure the postMessage
origins and `window.parent` traversal with a `hello` message before dropping
down into the primary RPC mechanism.

# example

we can have a "server" app running on `http://localhost:9000`:

``` js
var rpc = require('hello-frame-rpc');
var methods = {
    multi: function (n, cb) { cb(n * 111) }
};
rpc.listen('*', methods, function (err, remote) {
    remote.call('say', 'hello from the server!!!');
});
```

```
$ browserify server.js -o server/bundle.js
$ ecstatic -p 9000 server/
```

and a "client" app running on `http://localhost:9001`:

``` js
var rpc = require('hello-frame-rpc');
var methods = {
    say: function (msg) {
        var div = document.createElement('div');
        div.textContent = msg;
        document.body.appendChild(div);
    }
};

rpc.connect('http://localhost:9000', methods, function (err, remote) {
    remote.call('multi', 5, function (n) {
        console.log('n=', n);
    });
});
```

```
$ browserify client.js -o client/bundle.js
$ ecstatic -p 9001 client/
```

Now visit `http://localhost:9001` in a browser. You will see a greeting,
"hello from the server!!!" rendered to the page and a message in the console:
`n=555`.

# api

``` js
var rpc = require('hello-frame-rpc')
```

## rpc.listen(origin, methods, cb)

Listen for incoming requests on `origin` and serve up `methods`.

`methods` can be an object mapping names to methods the remote endpoint can call
or a function `methods(remote)` that will get a handle to the `remote` frame-rpc
instance and should return an object mapping names to methods.

`cb(err, remote)` fires when a parent iframe successfully connects with
`remote`, a [frame-rpc](https://npmjs.com/package/frame-rpc) handle.

`origin` can be the string `'*'` (anything), an allowed string url, an array of
allowed string urls, or a `function (x) {}` that will take the incoming origin
as its argument and should return a boolean about whether the origin argument is
allowed.

The `remote` handle has `.call()` and `.apply()` methods to call functions on
the remote endpoint with an optional callback as the last argument.

## rpc.connect(src, methods, cb)

Connect to `src`, a url string to open in an iframe.
`methods` will be exposed to the iframe.

`methods` can be an object mapping names to methods the remote endpoint can call
or a function `methods(remote)` that will get a handle to the `remote` frame-rpc
instance and should return an object mapping names to methods.

`cb(err, remote)` fires when the "server" iframe is fully connected with
`remote`, a [frame-rpc](https://npmjs.com/package/frame-rpc) handle.

The `remote` handle has `.call()` and `.apply()` methods to call functions on
the remote endpoint with an optional callback as the last argument.

# install

With [npm](https://npmjs.com), do:

```
npm install hello-frame-rpc
```

# sponsors

Thanks to [blockai](https://www.blockai.com) for sponsoring development of this
project.

# license

MIT
