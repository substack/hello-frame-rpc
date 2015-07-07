var rpc = require('../');
var methods = {
    multi: function (n, cb) { cb(n * 111) }
};
rpc.listen('*', methods, function (err, remote) {
    remote.call('say', 'hello from the server!!!');
});
