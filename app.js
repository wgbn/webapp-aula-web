;(function (window, document) {

    'use strict';

    var App = (function () {

        var _private = {};
        var _public = {};

        var itens = Array();
        var itemId= null;

        _public.init = function () {
            console.info('init');

            var medidas = {
                pxBody: document.querySelector('body').offsetHeight,
                pxHeader: document.querySelector('header').offsetHeight,
                pxBarra: document.querySelector('.barra').offsetHeight
            };
            var altura = medidas.pxBody - (medidas.pxBarra + medidas.pxHeader);

            document.querySelector('.app').style.height = altura + 'px';
            document.querySelector('.formulario').style.height = altura + 'px';

            if (localStorage.getItem('listaDeCompras') != null){
                _private.getListaLocal();
            }

            _private.bloquearBackButton();
            _private.setDomEventos();
            _private.printListaItens();
        };

        _private.bloquearBackButton = function(){
            window.location.hash="no-back-button";
            window.location.hash="Again-No-back-button";
            window.onhashchange=function(){window.location.hash="no-back-button";}
        };

        _private.setDomEventos = function(){
            document.querySelector('.add').addEventListener('click', _private.addClick, false);
            document.querySelector('.formulario form').addEventListener('submit', _private.addItemLista, false);
            document.querySelector('.formulario .cancelar').addEventListener('click', _private.cancelarClick, false);
            document.querySelector('.formulario .ok').addEventListener('click', function(e){ document.querySelector('.formulario input[type=submit]').click(); }, false);
            document.querySelector('.formulario #nome-item').addEventListener('keyup', function(e){
                if (e.keyCode == 13){
                    document.querySelector('.formulario #valor-item').focus();
                    return false;
                }
            });
        };

        _private.marcar = function (e) {
            if (!itens[this.dataset.id].marcado){
                _private.somarAoTotal(itens[this.dataset.id].valor * itens[this.dataset.id].qtde);
                itens[this.dataset.id].marcado = 1;
                this.classList.add('item-marcado');
            } else {
                _private.subtrairDoTotal(itens[this.dataset.id].valor * itens[this.dataset.id].qtde);
                itens[this.dataset.id].marcado = 0;
                this.classList.remove('item-marcado');
            }
            _private.setListaLocal();
        };

        _private.apagar = function(e){
            itemId = this.dataset.id;
            var _snack = document.querySelector('.snackbar');
            _snack.querySelector('span').innerHTML = 'Deseja excluir o item?';
            _snack.classList.add('snaclbar-ativa');

            _snack.querySelector('.sim').addEventListener('click', function(e){
                _snack.classList.remove('snaclbar-ativa');
                _private.excluirItem();
            });
            _snack.querySelector('.nao').addEventListener('click', function(e){
                _snack.classList.remove('snaclbar-ativa');
            });

        };

        _private.excluirItem = function(){
            var _item = document.querySelector('.snackbar');
            if (itemId){
                if (itens[itemId].marcado)
                    _private.subtrairDoTotal(itens[itemId].valor * itens[itemId].qtde);

                itens.splice(parseInt(itemId), 1);

                itemId = null;
                _private.setListaLocal();
                _private.printListaItens();
            }
        };

        _private.somarAoTotal = function(_valor){
            var _total = parseFloat(document.querySelector('#total').innerHTML.replace('.','').replace(',','.'));
            _total += _valor;
            document.querySelector('#total').innerHTML = Number(_total).formatMoney(2,',','.');
        };

        _private.subtrairDoTotal = function(_valor){
            var _total = parseFloat(document.querySelector('#total').innerHTML.replace('.','').replace(',','.'));
            _total -= _valor;
            document.querySelector('#total').innerHTML = Number(_total).formatMoney(2,',','.');
        };

        _private.printListaItens = function () {
            var _html = '';
            var _total = 0;

            if (itens && itens.length > 0){

                itens.forEach(function (_val, _key) {
                    _html += '<li class="item'+(_val.marcado ? ' item-marcado':'')+'" data-id="' + _key + '">';
                        _html += '<strong class="nome">' + _val.item + '</strong>';
                        _html += '<div class="dados">';
                            _html += '<div>';
                                _html += '<em>Val. Unit.</em>';
                                _html += '<span class="unitario">' + Number(_val.valor).formatMoney(2, ',', '.') + '</span>';
                            _html += '</div>';

                            _html += '<div>';
                                _html += '<em>Qtde</em>';
                                _html += '<span class="qtde">' + _val.qtde + '</span>';
                            _html += '</div>';

                            _html += '<div>';
                                _html += '<em>Subtotal</em>';
                                _html += '<span class="subtotal">' + Number(_val.qtde * _val.valor).formatMoney(2, ',', '.') + '</span>';
                            _html += '</div>';
                        _html += '</div>';
                    _html += '</li>';

                    if (_val.marcado)
                        _total += (_val.qtde * _val.valor);
                });

                document.querySelector('.lista').innerHTML = _html;

                var _itens = document.querySelectorAll('.item');
                var _pressTimer;

                itens.forEach(function (_v, _k) {
                    _itens[_k].addEventListener('swr', _private.marcar, false);
                    _itens[_k].addEventListener('swl', _private.apagar, false);
                    _itens[_k].addEventListener('dblclick', _private.marcar, false);
                    _itens[_k].addEventListener('click', function(e){ e.preventDefault(); }, false);
                    _itens[_k].addEventListener('mousedown', function(e){
                        e.preventDefault();
                        _pressTimer = window.setTimeout(_private.editarItem(this), 1000);
                    }, false);
                    _itens[_k].addEventListener('mouseup', function(e){
                        clearTimeout(_pressTimer);
                    }, false);
                });
            } else {
                document.querySelector('.lista').innerHTML = '';
            }

            document.querySelector('#total').innerHTML = Number(_total).formatMoney(2, ',', '.');

        };
        
        _private.editarItem = function(e){
            document.querySelector('.app').style.display = 'none';
            document.querySelector('.formulario').style.display = 'block';
            document.querySelector('.add').classList.add('add-oculto');
            
            document.querySelector('#nome-item').value = itens[e.dataset.id].item;
            document.querySelector('#valor-item').value = itens[e.dataset.id].valor;
            document.querySelector('#qtde-item').value = itens[e.dataset.id].qtde;
            document.querySelector('.formulario h4').innerHTML = 'editar item da lista';
            document.querySelector('.formulario .ok').dataset.edita = 1;
            document.querySelector('.formulario .ok').dataset.itemId = e.dataset.id;
        };

        _private.addItemLista = function (e) {
            e.preventDefault();

            var item = {
                item: document.querySelector("#nome-item").value,
                valor: document.querySelector("#valor-item").value.replace(',','.'),
                qtde: document.querySelector("#qtde-item").value.replace(',','.'),
                marcado: 0
            };
            
            var edita = parseInt(document.querySelector('.formulario .ok').dataset.edita);
            var itemId = parseInt(document.querySelector('.formulario .ok').dataset.itemId);

            if (item.item && item.valor && item.qtde) {

                if (edita){
                    item.marcado = itens[parseInt(document.querySelector('.formulario .ok').dataset.itemId)].marcado;
                    itens[parseInt(document.querySelector('.formulario .ok').dataset.itemId)] = item;
                } else {
                    itens.push(item);
                }

                _private.cancelarClick(e);
                _private.setListaLocal();
                _private.printListaItens();

            } else {

                _private.toast("Preencha todos os campos");

            }
        };

        _private.cancelarClick = function (e) {
            document.querySelector('.formulario').style.display = 'none';
            document.querySelector('.app').style.display = 'block';
            document.querySelector('.add').classList.remove('add-oculto');

            _private.limpaFormulario();
        }

        _private.limpaFormulario = function () {
            var inputs = document.querySelectorAll('.formulario form input');
            for (var i = 0; i < inputs.length - 1; i++)
                inputs[i].value = '';
        };

        _private.addClick = function (e) {
            document.querySelector('.app').style.display = 'none';
            document.querySelector('.formulario').style.display = 'block';
            document.querySelector('.add').classList.add('add-oculto');
            document.querySelector('.formulario h4').innerHTML = 'adicionar item à lista';
            document.querySelector('.formulario .ok').dataset.edita = 0;
        };

        _private.toast = function (_texto) {
            var _htmlToast = document.querySelector('.toast');
            _htmlToast.querySelector('span').innerHTML = _texto;
            _htmlToast.style.opacity = 1;

            window.setTimeout(function (e) {
                _htmlToast.style.opacity = 0;
            }, 3000);
        };
        
        _private.setListaLocal = function(){
            localStorage.setItem('listaDeCompras', JSON.stringify(itens));
        };

        _private.getListaLocal = function(){
            itens = JSON.parse(localStorage.getItem('listaDeCompras'));
        };

        return _public;

    })();


    window.App = App;

})(window, document);

document.addEventListener("DOMContentLoaded", function (e) {
    window.App.init();
});
