var rpc = require('../');
var methods = {
    say: function (msg) {
        var div = document.createElement('div');
        div.textContent = msg;
        document.body.appendChild(div);
    }
};

rpc.listen(methods, function (err, remote) {
    remote.multi(5, function (n) {
        console.log('n=', n);
    });
});
