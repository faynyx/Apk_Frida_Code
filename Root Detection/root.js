Java.perform(function() {
    const Build = Java.use("android.os.Build$VERSION");
    const File = Java.use("java.io.File");
    const PM = Java.use("android.app.ApplicationPackageManager");
    const Exception = Java.use("android.content.pm.PackageManager$NameNotFoundException");

    const package_array = ["com.topjohnwu.magisk", "eu.chainfire.supersu", "com.genymotion.superuser"]; 
    const root_file_path = ["/system/xbin/su", "/system/bin/su", "/system/xbin/busybox", "/system/app/Superuser.apk"];

    console.log(Build.SDK_INT.value);

    //test.isCheckRootingInstalled.implementation = function() {
    //    console.log("calling ? ");
    //};

    PM.getPackageInfo.overloads.forEach(function (args) {
        args.implementation = function () {
            var packageName = arguments[0];

            console.log("[call] getPackageInfo call and guess checking root packages : ", packageName);

            if (package_array.includes(packageName)) {
                console.log("[bypass] bypass checking root packages : " + packageName);

                throw Exception.$new(packageName); // exception
            }

            return args.apply(this, arguments);
        }
    });

    File.exists.implementation = function() {
        //const file = File.getName.call(this);
        const file_path = this.getAbsolutePath();

        console.log("[call] exists call and guess checking root file : ", file_path);

        

        if (root_file_path.includes(file_path)) {
            console.log("[bypass] bypass checking root file : " + file_path)
            return false;
        }

        return this.exists.call(this);
    }

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

