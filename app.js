window.onload = function () {
    (function (d) {
        var
            ce = function (e, n) {
                var a = document.createEvent("CustomEvent");
                a.initCustomEvent(n, true, true, e.target);
                e.target.dispatchEvent(a);
                a = null;
                return false
            },
            nm = true,
            sp = {
                x: 0,
                y: 0
            },
            ep = {
                x: 0,
                y: 0
            },
            touch = {
                touchstart: function (e) {
                    sp = {
                        x: e.touches[0].pageX,
                        y: e.touches[0].pageY
                    }
                },
                touchmove: function (e) {
                    nm = false;
                    ep = {
                        x: e.touches[0].pageX,
                        y: e.touches[0].pageY
                    }
                },
                touchend: function (e) {
                    if (nm) {
                        ce(e, 'fc')
                    } else {
                        var x = ep.x - sp.x,
                            xr = Math.abs(x),
                            y = ep.y - sp.y,
                            yr = Math.abs(y);
                        if (Math.max(xr, yr) > 20) {
                            ce(e, (xr > yr ? (x < 0 ? 'swl' : 'swr') : (y < 0 ? 'swu' : 'swd')))
                        }
                    };
                    nm = true
                },
                touchcancel: function (e) {
                    nm = false
                }
            };
        for (var a in touch) {
            d.addEventListener(a, touch[a], false);
        }
    })(document);
    //EXAMPLE OF USE
    var h = function (e) {
        //console.log(e.type, e);
        alert(e.type);
    };
    document.body.addEventListener('fc', h, false); // 0-50ms vs 500ms with normal click
    document.body.addEventListener('swl', h, false);
    document.body.addEventListener('swr', h, false);
    document.body.addEventListener('swu', h, false);
    document.body.addEventListener('swd', h, false);
}

Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

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

            var medidas = {
                pxBody:     document.querySelector('body').offsetHeight,
                pxHeader:   document.querySelector('header').offsetHeight,
                pxBarra:    document.querySelector('.barra').offsetHeight
            };
            var altura = medidas.pxBody - (medidas.pxBarra + medidas.pxHeader);

            document.querySelector('.app').style.height = altura+'px';
            document.querySelector('.formulario').style.height = altura+'px';

            document.querySelector('.add').addEventListener('click', _private.addClick, false);
            document.querySelector('.formulario form').addEventListener('submit', _private.addItemLista, false);
            document.querySelector('.formulario .cancelar').addEventListener('click', _private.cancelarClick, false);

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
                            _html += '<span class="unitario">'+Number(_val.valor).formatMoney(2,',','.')+'</span>';
                        _html += '</div>';

                        _html += '<div>';
                            _html += '<em>Qtde</em>';
                            _html += '<span class="qtde">'+_val.qtde+'</span>';
                        _html += '</div>';

                        _html += '<div>';
                            _html += '<em>Subtotal</em>';
                            _html += '<span class="subtotal">'+Number(_val.qtde * _val.valor).formatMoney(2,',','.')+'</span>';
                        _html += '</div>';
                    _html += '</div>';
                _html += '</li>';

                _total += (_val.qtde * _val.valor);
            });

            document.querySelector('.lista').innerHTML = _html;
            document.querySelector('#total').innerHTML = Number(_total).formatMoney(2,',','.');
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
                
                _private.cancelarClick(e);
                _private.printListaItens();
                
            } else {
                
                _private.toast("Preencha todos os campos");
                
            }
        };
        
        _private.cancelarClick = function(e){
            document.querySelector('.formulario').style.display = 'none';
            document.querySelector('.formulario').style.opacity = 0;
            document.querySelector('.app').style.display = 'block';
            document.querySelector('.app').style.opacity = 1;
            document.querySelector('.add').innerHTML = '+';

            _private.limpaFormulario();
        }

        _private.limpaFormulario = function() {
            var inputs = document.querySelectorAll('.formulario form input');
            for (var i = 0; i < inputs.length - 1; i++)
                inputs[i].value = '';
        };
        
        _private.addClick = function(e){
            if (e.target.innerHTML == '+'){
                document.querySelector('.app').style.display = 'none';
                document.querySelector('.app').style.opacity = 0;
                document.querySelector('.formulario').style.display = 'block';
                document.querySelector('.formulario').style.opacity = 1;
                document.querySelector('.add').innerHTML = '&#10004;';
            } else {
                document.querySelector('.formulario form input[type=submit]').click();
            }
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
