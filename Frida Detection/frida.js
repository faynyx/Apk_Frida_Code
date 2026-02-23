Java.perform(function() {
    const Build = Java.use("android.os.Build$VERSION");
    const File = Java.use("java.io.File");
    const PM = Java.use("android.app.ApplicationPackageManager");
    const Socket = Java.use("java.net.Socket");
    const Exception = Java.use("android.content.pm.PackageManager$NameNotFoundException");

    const local_tmp = File.$init.overload("java.lang.String")
    local_tmp.implementation = function(path) {
        const p = path.toString();

        let newPath = p;

        if (p == "/data/local/tmp") {
            newPath = "/data"
        }

        return local_tmp.call(this, newPath)
    }

    const port_init = Socket.$init.overload("java.lang.String", "int");
    port_init.implementation = function (host, port) {
        if (port > 25000 && port <= 30000) {
            port = 25000;
        }
        return port_init.call(this, host, port);
    }
    
    /*
    Socket.$init.overloads.forEach(function (overload) { // Socket(InetAddress address, int port), Socket(String host, int port) etc..
        overload.implementation = function() {
            var newArgs = Array.prototype.slice.call(arguments);

            if (newArgs.length > 1 && typeof newArgs[1] === "number") { // int check
                var port = newArgs[1];

                console.log("[+] before port " + port);

                if (port > 25000 && port <= 30000) { // defalut 27042
                    newArgs[1] = 25000;
                    console.log("[+] after port " + newArgs[1]);
                }
            } 

            return overload.apply(this, newArgs)
        }
    });
    */
});