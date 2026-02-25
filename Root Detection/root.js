Java.perform(function() {
    const Build = Java.use("android.os.Build$VERSION");
    const File = Java.use("java.io.File");
    const PM = Java.use("android.app.ApplicationPackageManager");
    const Exception = Java.use("android.content.pm.PackageManager$NameNotFoundException");
    const Runtime = Java.use("java.lang.Runtime");
    const JString = Java.use("java.lang.String");

    const root_package = ["com.topjohnwu.magisk", "eu.chainfire.supersu", "com.genymotion.superuser", "com.noshufou.android.su", "com.koushikdutta.superuser", "com.yellowes.su"]; 
    
    const root_path = ["/system/","/system/app/","/system/xbin/","/system/etc/","/system/bin/","/system/bin/.ext/","/system/sd/xbin/","/system/usr/we-need-root/","/data/","/data/app/","/data/local/","/data/local/bin/","/data/local/xbin/","/data/app-private/","/sbin/","/su/bin/","/dev/","/cache/"];
    const root_file = ["su", "busybox", "magisk", "supersu", "Superuser.apk", "KingoUser.apk", "SuperSu.apk", "daemonsu"];

    const guess_root_command = ["getprop", "mount", "build.prop", "id", "sh", "su"];

    console.log(Build.SDK_INT.value);

    PM.getPackageInfo.overloads.forEach(function (ov) {
        ov.implementation = function () {
            var packageName = arguments[0];

            console.log("[call] getPackageInfo call and guess checking root packages : ", packageName);

            if (root_package.includes(packageName)) {
                console.log("[bypass] bypass checking root packages : " + packageName);

                throw Exception.$new(packageName); // exception
            }

            return ov.apply(this, arguments);
        }
    });

    const exists_ov = File.exists.overload();

    exists_ov.implementation = function() {
        //const file = File.getName.call(this);
        //var file_path = this.getAbsolutePath();
        for (let i=0; i < root_path.length; i++) {
            for (let j=0; j < root_file.length; j++) {
                var full_path = root_path[i] + root_file[j];

                console.log("[call] exists call and guess checking root file : ", full_path);

                if (full_path.includes(file_path)) {
                    console.log ("[bypass] bypass checking root file : " + file_path);
                    return false;
                }
            }
        }

        return exists_ov.call(this);
    }

    Runtime.exec.overloads.forEach(function (ov) {
        ov.implementation = function() { 
            var argsType = ov.argumentTypes.map(function (t) {
                return t.className;
            });
            
            console.log(argsType);
            console.log(argsType.length);
            console.log(argsType[0]);

            if (argsType[0] === "java.lang.String") {
                var cmd = arguments[0]
                console.log(cmd);
                if (guess_root_command.some(x => cmd.includes(x))) {
                    console.log("[call] runtime exec call");
                    arguments[0] = "fake";
                }
            }

            if (argsType[0] === "[Ljava.lang.String;") { 
                var tmp = [];

                for (let i=0; i < arguments[0].length; i++) {
                    var cmd = arguments[0][i].toString();
                    
                    console.log(cmd);
                    if (guess_root_command.some(x => cmd.includes(x))) {
                        tmp.push(JString.$new("fake"));

                        //arguments[0] = Java.array("java.lang.String", tmp);

                        console.log("[call] runtime exec call");
                    }
                    else {
                        tmp.push(JString.$new(cmd));
                    }
                }
                arguments[0] = Java.array("java.lang.String", tmp);
            }

            return ov.apply(this, arguments);
        }
    });

    /*

    if (Build.SDK_INT.value >= 33) {
        PM.getPackageInfo.overload("java.lang.String", "android.content.pm.PackageManager$PackageInfoFlags").implementation = function(packageName, flags) {
            console.log("1");
        }
    }

    else {
        PM.getPackageInfo.overload("java.lang.String", "int").implementation = function(packageName, flags) {
        if (packageName == "com.topjohnwu.magisk") {
            console.log("check root packages", packageName);

            throw Exception.$new(packageName);
        }

        return packageName.apply(this, packageName);
    }
        */

    
    //PackageManager.getPackageInfo.overload("java.lang.String", "int").implementation = function(packageName, flags) {
    //    console.log("Package : ", packageName + " Flags : "+ flags);
    //    return this.getPackageInfo(packageName, flags);
    //};
});