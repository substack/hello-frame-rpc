var rpc = require('../');
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
