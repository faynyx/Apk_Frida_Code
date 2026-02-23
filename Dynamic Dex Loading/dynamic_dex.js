function copyFile(src, dst) {
    try {
        var input = Java.use("java.io.FileInputStream").$new(src);
        var output = Java.use("java.io.FileOutputStream").$new(dst);

        var buffer = Java.array('byte', new Array(4096));
        var len;

        while ((len = input.read(buffer)) != -1) {
            output.write(buffer, 0, len);
        }

        input.close();
        output.close();

        console.log("[copied] File copy " + src + " -> " + dst);
        return true;
    } catch (e) {
        console.log("[failed] Copy Failed : " + e);
        return false;
    }
}

function basename_noext(path) {
    var fname = path.split(/[\\/]/).pop();
    var dot = fname.lastIndexOf(".");
    return (dot > 0) ? fname.substring(0, dot) : fname;
}

Java.perform(function() {
    const Build = Java.use("android.os.Build$VERSION");
    const File = Java.use("java.io.File");
    const PM = Java.use("android.app.ApplicationPackageManager");
    const Socket = Java.use("java.net.Socket");

    const DexClassLoader = Java.use("dalvik.system.DexClassLoader");
    const PathClassLoader = Java.use("dalvik.system.PathClassLoader");
    const InMemoryDexClassLoader = Java.use("dalvik.system.InMemoryDexClassLoader");

    const ClassLoader = Java.use("java.lang.ClassLoader");

    //const dex_init = DexClassLoader.$init
    const path_init = PathClassLoader.$init;
    const inmemory_init = InMemoryDexClassLoader.$init;

    DexClassLoader.$init.implementation = function(dexPath, optimizedDirectory, librarySearchPath, parent) {
        console.log ("[call] DexClassLoader call");
        console.log ("[loading] Loading class path : " + dexPath);

        var out_path = "/sdcard/Download/" + basename_noext(dexPath);

        //copyFile(dexPath, out_path);

        return this.$init(dexPath, optimizedDirectory, librarySearchPath, parent);
    }
    
    path_init.overloads.forEach(function (overload) {
        overload.implementation = function() {
            console.log ("[call] PathClassLoader call");
            console.log ("[loading] Loding class path : " + arguments[0]);

            var out_path = "/sdcard/Download/" + basename_noext(dexPath);

            copyFile(arguments[0], out_path);

            return overload.apply(this, arguments);
        }
    });

    inmemory_init.overloads.forEach(function (overload) {
        overload.implementation = function() {
            console.log ("[call] InMemoryDexClassLoader");

        }
    });

    ClassLoader.loadClass.overload("java.lang.String").implementation = function (classNames) {
        if (classn)
    }
});