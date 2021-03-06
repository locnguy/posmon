/*
 * Serve content over a socket
 */

module.exports = function (socket, fs) {
    var fs = require('fs');

    socket.emit('send:name', {
        name: 'Bob'
    });

    socket.emit('send:time', {
        time: (new Date()).toString()
    });
/*
    setInterval(function () {
        socket.emit('send:time', {
            time: (new Date()).toString()
        });
    }, 1000);
*/
    var p = './data/orders/2015-01-03';//'/Users/locnguy/2015-01-03';
	p = 'C:\\xampp\\htdocs\\posmon\\data\\2015-01-31';

    //require('chokidar').watch(, {ignored: /[\/\\]\./}).on('all', function(event, path) {
    require('chokidar').watch(p, {ignored: /[\/\\]\./}).on('all', function(event, path) {
        //console.log(event, path);
        if(event == "add") {
            console.log("ADD: " + path);
        } else if(event == "change") {
            console.log(event, path);
        }

        if(p != path && fs.lstatSync(path).isFile()) {
            var obj = JSON.parse(fs.readFileSync(path, 'utf8'));
            //inspect the order, if mon_all_done is set, then don't send
            //if(!obj['mon_all_done']) //send all orders, let client do the filtering
            socket.emit('send:order', obj);
        }
        //socket.emit('send:order', path);
    });

    socket.on('send:done', function (data) {
        //open file, edit item status, save it
        var fp = p + "/" + data.ordernumber;
        var obj = JSON.parse(fs.readFileSync(fp, 'utf8'));

        for(var i=0;i<obj.items.length;i++) {
            if(obj.items[i]['Number'] == data.item) {
                obj.items[i]['mon_done'] = 1;
                obj.items[i]['time_done'] = Date.now();
            }
        }
        fs.writeFileSync(fp, JSON.stringify(obj));
    });

    socket.on('send:undone', function (data) {
        //open file, edit item status, save it
        var fp = p + "/" + data.ordernumber;
        var obj = JSON.parse(fs.readFileSync(fp, 'utf8'));

        for(var i=0;i<obj.items.length;i++) {
            if(obj.items[i]['Number'] == data.item)
                obj.items[i]['mon_done'] = 0;
        }
        fs.writeFileSync(fp, JSON.stringify(obj));
    });

    socket.on('send:alldone', function (data) {
        var fp = p + "/" + data.ordernumber;
        var obj = JSON.parse(fs.readFileSync(fp, 'utf8'));
        obj['mon_all_done'] = 1;
        obj['time_done'] = Date.now();
        for(var i=0;i<obj.items.length;i++) {
            obj.items[i]['mon_done'] = 1;
            obj.items[i]['time_done'] = Date.now();
        }
        fs.writeFileSync(fp, JSON.stringify(obj));
    });
    
    socket.on('send:undoalldone', function(data) {
        var fp = p + "/" + data.ordernumber;
        var obj = JSON.parse(fs.readFileSync(fp, 'utf8'));
        obj['mon_all_done'] = 0;
        for(var i=0;i<obj.items.length;i++) {
            obj.items[i]['mon_done'] = 0;
        }
        fs.writeFileSync(fp, JSON.stringify(obj));
    });
};
