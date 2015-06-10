;(function(window, document){

    var App = (function(){

        var _private = {};
        var _public = {};

        _public.init = function(){
            console.info('init');
        };

        return _public;

    })();

    window.App = App;

})(window, document);

document.addEventListener("DOMContentLoaded", function(e){
    window.App.init();
});
