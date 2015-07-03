var RPC = require('frame-rpc');
var loadIframe = require('load-iframe');
var isarray = require('isarray');
var indexof = require('indexof');

exports.listen = function (origin, methods, cb) {
    if (typeof origin === 'object') {
        methods = origin;
        origin = '*';
    }
    if (origin === '*') {
        origin = function (o) { return true };
    }
    else if (typeof origin === 'string') {
        var str = origin;
        origin = function (o) { return str === o };
    }
    else if (isarray(origin)) {
        var arr = origin;
        origin = function (o) { return indexof(arr, o) >= 0 };
    }
    
    for (var p = window; p !== p.parent; p = p.parent) {
        helloRPC(p);
    }
    
    function helloRPC (p) {
        var rpc = RPC(p, p.parent, '*', {});
        var ownOrigin = location.protocol + '//' + location.host;
        rpc.call('hello', ownOrigin, function (xorigin) {
            if (origin(xorigin)) createRPC(p, xorigin);
        });
    }
    
    function createRPC (p, origin) {
        cb(null, RPC(p, p.parent, origin, methods));
    }
};

exports.connect = function (src, methods, cb) {
    var frame = loadIframe(src, function () {
        var hrpc = RPC(window, frame.contentWindow, src, {
            hello: function (origin, fn) {
                var rpc = RPC(window, frame.contentWindow, src, methods);
                cb(null, rpc);
                fn(location.protocol + '//' + location.host);
            }
        });
    });
};
