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

            var _altura = document.querySelector('body').offsetHeight - (document.querySelector('header').offsetHeight + document.querySelector('.barra').offsetHeight);
            document.querySelector('.app').style.maxHeight = (_altura-60)+'px';

            _private.printListaItens();
        };

        _private.printListaItens = function(){
            var _html = '';
            var _total = 0;

            itens.forEach(function(_val){
                _html += '<li class="item">';
                    _html += '<strong class="nome">'+_val.item+'</strong>';
                    _html += '<div class="dados">';
                        _html += '<div>';
                            _html += '<em>Val. Unit.</em>';
                            _html += '<span class="unitario">'+_val.valor+'</span>';
                        _html += '</div>';

                        _html += '<div>';
                            _html += '<em>Qtde</em>';
                            _html += '<span class="qtde">'+_val.qtde+'</span>';
                        _html += '</div>';

                        _html += '<div>';
                            _html += '<em>Subtotal</em>';
                            _html += '<span class="subtotal">'+(_val.qtde * _val.valor)+'</span>';
                        _html += '</div>';
                    _html += '</div>';
                _html += '</li>';

                _total += (_val.qtde * _val.valor);
            });

            document.querySelector('.lista').innerHTML = _html;
            document.querySelector('#total').innerHTML = _total;
        };

        return _public;

    })();

    window.App = App;

})(window, document);

document.addEventListener("DOMContentLoaded", function(e){
    window.App.init();
});
