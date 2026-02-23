function copyfile(source, destination) {
    try {
        const File = Java.use('java.io.File');
        const FileInputStream = Java.use('java.io.FileInputStream');
        const FileOutputStream = Java.use('java.io.FileOutputStream');

        const ProcessBuilder = Java.use("java.lang.ProcessBuilder");

        const Runtime = Java.use('java.lang.Runtime');
        Runtime.getRuntime().exec(`cp ${source} ${destination}`);

        /*
        var sourceFile = File.$new(source);

        if (sourceFile.exists()) {
            var inputStream = FileInputStream.$new(sourceFile);
            var outputStream = FileOutputStream.$new(destination);
            
            // Basic buffer for copying
            var buffer = Java.array('byte', new Array(1024).fill(0));
            var bytesRead;
            while ((bytesRead = inputStream.read(buffer)) !== -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            
            // Close streams
            inputStream.close();
            outputStream.close();
            console.log('File copied successfully.');
        } else {
            console.log('Source file not found.');
        }
            */
    } catch (e) {
        console.log("exception : " + e);
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
    //const inmemory_init = InMemoryDexClassLoader.$init;

    DexClassLoader.$init.implementation = function(dexPath, optimizedDirectory, librarySearchPath, parent) {
        console.log ("[call] DexClassLoader call");
        console.log ("[loading] Loading class path : " + dexPath);

        var out_path = "/sdcard/Download/" + basename_noext(dexPath);

        copyfile(dexPath, out_path);

        return this.$init(dexPath, optimizedDirectory, librarySearchPath, parent);
    }
    
    path_init.overloads.forEach(function (overload) {
        overload.implementation = function() {
            console.log ("[call] PathClassLoader call");
            console.log ("[loading] Loding class path : " + arguments[0]);

            var out_path = "/storage/emulated/0/Download/" + basename_noext(dexPath);

            copyfile(arguments[0], out_path);

            return overload.apply(this, arguments);
        }
    });

    InMemoryDexClassLoader.overload("java.nio.ByteBuffer", "java.lang.ClassLoader").implementation = function(dexBuffers, parent) {
        var castedBuffer = Java.cast(dexBuffers, Java.use("java.nio.ByteBuffer"));

        var len = castedBuffer.capacity();
        var bytes = Java.array('byte', new Array(len).fill(0));

        castedBuffer.position(0);
    }

    inmemory_init.overloads.forEach(function (overload) {
        overload.implementation = function() {
            console.log ("[call] InMemoryDexClassLoader");

        }
    });
});