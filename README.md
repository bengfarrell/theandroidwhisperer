theandroidwhisperer
===================

Talk with your Android Devices like a champ

Hey! If you wanna check out your console.log messages from Javascript, you might want to stringify your objects so they don't come through as "Object Object".
Here's a snippet to put in your app to override console.log to do this:

if(window.console && console.log){
    var logging = console.log;
    console.log = function(){
        Array.prototype.unshift.call(arguments);
        for (var c in arguments) {
            if (typeof arguments[c] != "string") {
                arguments[c] = JSON.stringify(arguments[c]);
            }
        }
        logging.apply(this, arguments)
    }
}