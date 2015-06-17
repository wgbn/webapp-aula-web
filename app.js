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
            document.querySelector('.add').addEventListener('click', _private.addClick, false);
            document.querySelector('.formulario form').addEventListener('submit', _private.addItemLista, false);

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
        
        _private.addItemLista = function(e) {
            e.preventDefault();
            
            var item = {
                item: document.querySelector("#nome-item").value,
                valor: document.querySelector("#valor-item").value,
                qtde: document.querySelector("#qtd-item").value
            };
            
            if (item.item && item.valor && item.qtde){
                
                itens.push(item);
                
                document.querySelector('.app').style.display = 'block';
                document.querySelector('.formulario').style.display = 'none';
                
                _private.printListaItens();
                _private.limpaFormulario();
                
            } else {
                
                _private.toast("Preencha todos os campos");
                
            }
        };
        
        _private.limpaFormulario = function() {
            var inputs = document.querySelectorAll('.formulario form input');
            for (var i = 0; i < inputs.length - 1; i++)
                inputs[i].value = '';
        };
        
        _private.addClick = function(e){
            document.querySelector('.app').style.display = 'none';
            document.querySelector('.formulario').style.display = 'block';
            document.querySelector('.add').innerHTML = '&#10004;';
        };
        
        _private.toast = function(_texto){
            var _htmlToast = document.querySelector('.toast');
            _htmlToast.querySelector('span').innerHTML = _texto;
            _htmlToast.style.opacity = 1;
            
            window.setTimeout(function(e){
                _htmlToast.style.opacity = 0;
            }, 3000);
        };
        
        return _public;

    })();


    window.App = App;

})(window, document);

document.addEventListener("DOMContentLoaded", function(e){
    window.App.init();
});
