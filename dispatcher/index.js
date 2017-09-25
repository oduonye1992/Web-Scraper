const express = require('express')
const app = express()


var FastText=function(params) {
    this._options={ debug: false };
    for (var attrname in params) { this._options[attrname] = params[attrname]; }
    this.exec = function(name,command,params,options,callback) {
        var self=this;
        var _options = { detached: false };
        for (var attrname in options) { _options[attrname] = options[attrname]; }

        var created_time= ( new Date() ).toISOString();
        console.log('command '+command);
        console.log(params);
        var task = require('child_process').spawn(command, params, _options);
        task.stdout.on('data', function(_data) {
            return callback(new Buffer(_data,'utf-8').toString());
        });
        task.on('error', function(error) {
            if(self._options.debug) console.error("exec:%s pid:%d error:\n%@",name,task.pid,error);
        });
        task.on('uncaughtException', function (error) {
            if(self._options.debug) console.error("exec:%s pid:%s uncaughtException:\n%@",name,task.pid,error);
        });
        task.stdout.on('end', function(data) {
            if(self._options.debug) console.log("exec:%s end.",name);
        });
        task.stderr.on('data', function(data) {
            if(self._options.debug) console.log("exec:%s stderr:%s",name,data);
            task.kill('SIGINT');
        });
        task.on('close', function (code, signal){
            if(self._options.debug) console.warn('task:%s pid:%s terminated due to receipt of signal:%s',name,task.pid,signal);
        });
        task.on('exit', function(code) {
            if(self._options.debug) console.log("exec:%s exit.",name);
            if (code != 0) {
                var error=new Error();
                error.description= command + ' ' + params.join(' ');
                error.code=code;
                if(self._options.debug) console.error("exec:%s pid:%d error:\n%@",name,task.pid,error);
            }
            // at exit explicitly kill exited task
            task.kill('SIGINT');
        });
        return task;
    }//exec
    this.load = function(callback) {
        var path = './fasttext';
        this.child = this.exec('fasttext', path, ['predict', this._options.model, '-'], {}, callback);
        //m.stdout.pipe(process.stdout);
    };//load
    this.send = function(data) {
        this.child.stdin.setEncoding('utf-8');
        this.child.stdin.write( data + '\r\n' );
    };//send
    this.predict = function(data) {
        return this.send(FastText.normalize(data));
    };//predict
}//FastText
FastText.normalize= function(text) {
    text=text.toLowerCase();
    text=text.replace(/(?:\\[rn]|[\r\n]+)+/g, " ");
    text=text.replace(/'/g, " ' ");
    text=text.replace(/"/g, '');
    text=text.replace(/\./g, ' \. ');
    text=text.replace(/,/g, ' \, ');
    text=text.replace(/\(/g, ' ( ');
    text=text.replace(/\)/g, ' ) ');
    text=text.replace(/!/g, ' ! ');
    text=text.replace(/\?/g, ' ! ');
    text=text.replace(/;/g, ' ');
    text=text.replace(/:/g, ' ');
    text=text.replace(/\t+/g,'\t').replace(/\t\s/g,' ').replace(/\t/g,' ');
    return text;
};//normalize



app.get('/', function (req, res) {
    var fast = new FastText({debug : true, model : './model_text.bin'});
    fast.load(function(a){
        console.log('asas '+a);
        res.send(req.query.q + ' is '+a);
    });
    fast.send(req.query.q);
});

app.listen(3930, function () {
    console.log('Example app listening on port 3930!')
});

