//test

Java.perform(function() {
	const opendir = Module.findExportByName(null, "opendir"); 
	const connect = Module.findExportByName(null, "connect");
    const fopen = Module.findExportByName(null, "fopen");
	const readlinkat = Module.findExportByName(null, "readlinkat");

    Interceptor.attach(opendir, {
		onEnter: function (args) {
			var path = Memory.readUtf8String(args[0]);
			if (path.indexOf("/data/local/tmp") !== -1) { 
				console.log ("[Frida] /data/local/tmp");
				var fake = Memory.allocUtf8String("/data/local/bypass");
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
			var pid = Process.id.toString();
			var path = Memory.readUtf8String(args[0]);
			if (path.indexOf("/proc/" + pid + "/maps") !== -1) { // check /proc/<pid>/maps
				var fake_maps = Memory.allocUtf8String("/proc/0/maps");
				args[0] = fake_maps;
			}
			
			if (path.indexOf("/proc/" + pid + "/task") !== -1) { // check /proc/<pid>/tasks/<tid>
				var fake_task = Memory.allocUtf8String("/proc/0/task");
				args[0] = fake_task;
			}

			if (path.indexOf("/proc" + pid + "/fd") !== -1) { // check /proc/<pid>/fd
				var fake_fd = Memory.allocUtf8String("/proc/0/fd");
				args[0] = fake_fd;
			}
		},
		onLeave: function (retVal) {

		}
	})

	// readlinkat -> 	
	Interceptor.attach(readlinkat, {
		onEnter: function (args) {
			this.buf = args[2];
			this.buf_size = args[3].toInt32();
		},
		onLeave: function(retVal) {
			const n = retVal.toInt32();
			if (n <= 0) return;

			let out = "";
			try {
				out = Memory.readUtf8String(this.buf, n);
			} catch (e) {
				return;
			}

			if (out.indexOf("frida") !== -1) {
				const fake = "/system/bin/linker" // not frida
				const fakelen = Math.min(fake.length, this.buf_size);
				
				Memory.writeUtf8String(this.buf, fake);
				retVal.replace(fakelen);
			}
		}
	})
})



