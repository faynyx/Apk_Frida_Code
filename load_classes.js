Java.perform(function() {
	var classes = Java.enumerateLoadedClassesSync();
	classes.forEach(function(aClass) {
		try{
			var className = aClass.match(/[L](.*);/)[1].replace(/\//g, ".");
			send('[AUXILIARY] ' + className);
		}
		catch(err){}
	});
});
