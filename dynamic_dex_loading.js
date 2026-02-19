
var Build = Java.use('android.os.Build');
    
// CPU_ABI 
Build.CPU_ABI.value = 'arm64-v8a';

// SUPPORTED_ABIS
//var StringClass_1 = Java.use('java.lang.String');
//var abis_1 = Java.array('java.lang.String', ['arm64-v8a']);
//Build.SUPPORTED_ABIS.value = abis_1;

// SUPPORTED_ABIS 
//var StringClass_2 = Java.use('java.lang.String');
var abis_2 = Java.array('java.lang.String', ['arm64-v8a']);
Build.SUPPORTED_ABIS.value = abis_2;

console.log('[*] CPU_ABI set to: ' + Build.CPU_ABI.value);
console.log("[*] SUPPORTED_ABIS set to: " + Build.SUPPORTED_ABIS.value)

const dlopen = Module.findExportByName("libdl.so", "dlopen") ||
               Module.findExportByName("libc.so", "dlopen") ||
               Module.findExportByName(null, "dlopen");
console.log("dlopen =", dlopen);

const open_ = Module.findExportByName("libc.so", "open");
console.log("open =", open_);

Java.perform(function () {
  const System = Java.use("java.lang.System");
  const Runtime = Java.use("java.lang.Runtime");
  const BaseDexClassLoader = Java.use("dalvik.system.BaseDexClassLoader");

  System.loadLibrary.overload("java.lang.String").implementation = function (name) {
    console.log("[+] System.loadLibrary:", name);
    return this.loadLibrary(name);
  };

  Runtime.loadLibrary0.overload("java.lang.String").implementation = function (loader, name) {
    console.log("[+] Runtime.loadLibrary0:", name, " loader=", loader);
    try {
      // where would it search?
      const path = BaseDexClassLoader.cast(loader).findLibrary(name);
      console.log("    findLibrary ->", path);
    } catch (e) {
      console.log("    findLibrary error:", e);
    }
    return this.loadLibrary0(loader, name);
  };
});

Interceptor.attach(open_, { 
    onEnter:function(args) { 
        this.oldPath = Memory.readUtf8String(args[0]);
        console.log(this.oldPath); 
        if (this.oldPath === "/data/app/~~zCk-au-jh8bjgFiRC90nNw==/com.chvi.pool-BzNK3vEoylIRQemlqSPy2w==/lib/x86_64/lib2a084d99.so") {
            console.log("if success");
            const new_path = "/data/app/~~zCk-au-jh8bjgFiRC90nNw==/com.chvi.pool-BzNK3vEoylIRQemlqSPy2w==/lib/arm64-v8a/lib2a084d99.so";

            console.log(`    [*] rewrite path: ${this.oldPath} => ${new_path}`);
            // args[0] = new_path;
        }

        
    }, 
    onLeave:function(retval) { 
        if(this.oldPath === "/data/app/~~zCk-au-jh8bjgFiRC90nNw==/com.chvi.pool-BzNK3vEoylIRQemlqSPy2w==/lib/x86_64/lib2a084d99.so") {
            console.log(`return value: ${retval}`);            
        }        

        return retval;
    } 
});

Java.perform(function() {
    console.log("aaaa");
    

	var classes = Java.enumerateLoadedClassesSync();
	classes.forEach(function(aClass) {
		try{
			var className = aClass.match(/[L](.*);/)[1].replace(/\//g, ".");
			console.log('[AUXILIARY] ' + className);
		}
		catch(err){}
	});
});
