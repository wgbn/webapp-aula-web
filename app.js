;(function(window, document){

    'use strict';

    var App = (function(){

        var _private = {};
        var _public = {};

        var itens = [
            {
                item: 'Biscoito de chocolate',
                valor: 1.5,
                qtde: 2
            }
        ];

        _public.init = function(){
            console.info('init');

            console.info(itens);

            var _altura = document.querySelector('body').offsetHeight - (document.querySelector('header').offsetHeight + document.querySelector('.barra').offsetHeight);
            document.querySelector('.app').style.maxHeight = (_altura-60)+'px';
        };

        _private.printListaItens = function(){

        };

        return _public;

    })();

    window.App = App;

})(window, document);

document.addEventListener("DOMContentLoaded", function(e){
    window.App.init();
});
