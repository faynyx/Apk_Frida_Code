//test

Java.perform(function() {
    const fopen = Module.findExportByName(null, "fopen");

    Interceptor.attach(fopen, {

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



