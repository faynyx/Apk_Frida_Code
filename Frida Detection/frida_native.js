//test

Java.perform(function() {
	const opendir = Module.findExportByName(null, "opendir"); 
	const connect = Module.findExportByName(null, "connect");
    const fopen = Module.findExportByName(null, "fopen");

    Interceptor.attach(opendir, {
		onEnter: function (args) {
			this.path = Memory.readUtf8String(args[0]);
			if (this.path.includes("/data/local/tmp")) {
				console.log ("[Frida] /data/local/tmp");
				const fake = Memory.writeUtf8String("bypass");
				args[0] = fake;
			}
		},
		onLeave: function(retVal) {
			return retVal;
		}
    })

	Interceptor.attach(connect, {
		onEnter: function (args) {
			
		},
		onLeave: function(retVal) {
			return retVal;
		}
	})

	Interceptor.attach(fopen, {
		onEnter: function (args) {
			this.path = Memory.readUtf8String(args[0]);
			if (this.path.includes(""))
		}
	})
})

Java.perform(function() {

	Interceptor.attach(Module.findExportByName(null, "fopen"), {
		onEnter: function(args) {
			// console.warn("[*] fopen() called !")
			var path = Memory.readUtf8String(args[0])
			if((path.indexOf("/proc/") !== -1) && (path.indexOf("/status") !== -1)) {
				console.warn("[!] Debug Detection Pattern Found !")
				Memory.writeUtf8String(args[0], "aaa")
				// console.log("\t\t[+] new fopen : " + Memory.readUtf8String(args[0]))
			}
		},
		onLeave: function(retval) {
		}
	})
})

Java.perform(function() {
	
	Interceptor.attach(Module.findExportByName(null, 'sprintf'), {
		onEnter: function(args) {
			// console.warn("[*] sprintf() called !")
			var str = args[1].readUtf8String();
			// console.log("\t[+] sprintf : " + str)			
			if(str.indexOf('/proc/') !== -1 && str.indexOf('/status') !== -1) {
				console.log("\t[+] sprintf str : " + str)
				console.log('[+] sprintf format : ' + args[2]);
				args[2] = ptr('0x0');
				console.log('[!] New sprintf format : ' + args[2]);
			}
		},
		onLeave: function(retval) {
		}
	})
})



