Java.perform(function() {
    const Build = Java.use("android.os.Build$VERSION");
    const File = Java.use("java.io.File");
    const FileReader = Java.use("java.io.FileReader");
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
        if (port == 27042) {
            port = 20000;
        }
        console.log(port + " : port");
        return port_init.call(this, host, port);
    }
    
    const maps_init_string = FileReader.$init.overload("java.lang.String");
    maps_init_string.implementation = function (path) {
        var target_path = "/proc/self/maps";

        if (path === target_path || path.endsWith("/maps")) {
            console.log ("[maps] FileReader Opening maps : ", path);
            path = "/proc/self/stacks";
        }
        return maps_init_string.call(this, path);
    }

    const maps_init_file = FileReader.$init.overload("java.io.File");
    maps_init_file.implementation = function (fileobj) {
        var target_path = "/proc/self/maps";

        var absPath = fileobj.getAbsolutePath();

        var path = absPath.toString();

        if (path === target_path || path.endsWith("/maps")) {
            console.log ("[maps] FileReader Opening maps : ", path);
            var fakeobj = File.$new("/proc/self/stacks");
            console.log ("[maps] change file object and bypass");
            return maps_init_file.call(this, fakeobj);
        }
        return maps_init_file.call(this, fileobj);
    }
    
    /*
    Socket.$init.overloads.forEach(function (overload) {
        overload.implementation = function() {
            for (let i=0; i < arguments.length; i++) {
                if (typeof arguments[i] === "number") {
                    let p = arguments[i];
                    if (p = 27042) {
                        arguments[i] = 20000;
                        console.log("[*] port rewrite : " , p);
                    }
                    else {
                        console.log("[*] port", p);
                    }
                }
            }

            return overload.apply(this, arguments);
        }
    });
    
    
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