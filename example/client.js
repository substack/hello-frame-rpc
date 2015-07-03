var rpc = require('../');
var methods = {
    multi: function (n, cb) { cb(n * 111) }
};

rpc.connect('http://localhost:9000', methods, function (err, remote) {
    remote.say('hello!!!');
});
