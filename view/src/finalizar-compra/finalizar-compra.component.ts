import * as $ from 'jquery';
// @ts-ignore
import * as html2pdf from '../../node_modules/html2pdf.js/dist/html2pdf';
import './finalizar-compra.component.css';
import 'bootstrap';

class FinalizarCompra {
    pedido: Object = {};

    constructor() {
        if (localStorage.getItem('pedidoFinalizado')) {
            $( ".container" ).html(`
            <center>
                <svg style="margin-top: 20%" width="5em" height="5em" viewBox="0 0 16 16" class="bi bi-check2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                <h3 class="mt-4">Seu pedido foi efetuado com sucesso!</h3>
                <a type="button" onclick="localStorage.removeItem('pedidoFinalizado')" class="btn btn-primary mt-3" href="/">Continuar comprando</a>
            </center>
            `);
        } else {
            this.addEvents();
        }
    }

    private addEvents(): void {
        $( "input" ).each((_, e) => {
            const classScope = this;
            e.addEventListener('input', _ => classScope.verificarCampos());
            
            if (e.id === 'cpf') {
                e.addEventListener('input', function() {
                    (<HTMLInputElement>this).value = (<HTMLInputElement>this).value.replace(/[^0-9]/, "");
                    (<HTMLInputElement>this).value = (<HTMLInputElement>this).value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
                    classScope.verificarCampos();
                })
            } else if (e.id === 'cep') {
                e.addEventListener('input', function() {
                    (<HTMLInputElement>this).value = (<HTMLInputElement>this).value.replace(/[^0-9]/, "");
                    (<HTMLInputElement>this).value = (<HTMLInputElement>this).value.replace(/(\d{5})(\d{3})/, "$1-$2");
                    
                    try {
                        $.get( `https://viacep.com.br/ws/${(<HTMLInputElement>this).value}/json/`, datas => {
                            if (!datas.erro) {
                                (<HTMLInputElement>$( "#bairro" )[0]).value = datas.bairro;
                                (<HTMLInputElement>$( "#cidade" )[0]).value = datas.localidade;
                                (<HTMLInputElement>$( "#rua" )[0]).value = datas.logradouro;
                                (<HTMLInputElement>$( "#estado" )[0]).value = datas.uf;
                            }
                        })
                    } catch(e) {
                        console.log('hello')
                    }
                    classScope.verificarCampos();
                })
            } else if (e.id === 'numero') {
                e.addEventListener('input', function() {
                    (<HTMLInputElement>this).value = (<HTMLInputElement>this).value.replace(/[^0-9]/, "");
                    classScope.verificarCampos();
                })
            } else if (e.id === 'fone') {
                e.addEventListener('input', function() {
                    (<HTMLInputElement>this).value = (<HTMLInputElement>this).value.replace(/[^0-9]/, "");
                    (<HTMLInputElement>this).value = (<HTMLInputElement>this).value.replace(/(\d{2})(\d{5})(\d{4})/, "$1 $2-$3")
                    classScope.verificarCampos();
                })
            }
        })

        $( "#finalizar-compra" ).click(() => this.sendRequest(this.pedido));
        $( "#baixar-boleto" ).click(() => this.downloadPDF());
    }

    private verificarCampos() {
        this.pedido = {
            nome       : (<HTMLInputElement>$( "#nome" )[0]).value,
            usuario    : localStorage.getItem('username'),
            cep        : (<HTMLInputElement>$( "#cep" )[0]).value,
            cpf        : (<HTMLInputElement>$( "#cpf" )[0]).value,
            estado     : (<HTMLInputElement>$( "#estado" )[0]).value,
            cidade     : (<HTMLInputElement>$( "#cidade" )[0]).value,
            bairro     : (<HTMLInputElement>$( "#bairro" )[0]).value,
            rua        : (<HTMLInputElement>$( "#rua" )[0]).value,
            numero     : (<HTMLInputElement>$( "#numero" )[0]).value,
            fone       : (<HTMLInputElement>$( "#fone" )[0]).value
        }
        
        const validate  : boolean = (/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/).test((<HTMLInputElement>$( "#cpf" )[0]).value) && (/^\d{5}-\d{3}/).test((<HTMLInputElement>$( "#cep" )[0]).value) && (/^\d{2} \d{5}-\d{4}/).test((<HTMLInputElement>$( "#fone" )[0]).value)
        const emptyInput: boolean = (Object)['values'](this.pedido).includes('') ? false : true; 

        if (validate && emptyInput) $( "#baixar-boleto" ).removeAttr("disabled");
        else $( "#baixar-boleto" ).attr("disabled", "disabled");

        $( "#baixar-boleto" ).click(() => $( "#finalizar-compra" ).removeAttr("disabled"))
    }

    private sendRequest(objectToRequest: Object): void {
        JSON.parse(localStorage.getItem('carrinho')).idProduct.forEach((e: any, i: number) => {
            const pedido = {
                productId: Number(JSON.parse(localStorage.getItem('carrinho')).idProduct[i]),
                name     : (<HTMLInputElement>$( "#nome" )[0]).value,
                username : localStorage.getItem('username'),
                cep      : (<HTMLInputElement>$( "#cep" )[0]).value,
                cpf      : (<HTMLInputElement>$( "#cpf" )[0]).value,
                state    : (<HTMLInputElement>$( "#estado" )[0]).value,
                city     : (<HTMLInputElement>$( "#cidade" )[0]).value,
                district : (<HTMLInputElement>$( "#bairro" )[0]).value,
                street   : (<HTMLInputElement>$( "#rua" )[0]).value,
                number   : Number((<HTMLInputElement>$( "#numero" )[0]).value),
                phone    : (<HTMLInputElement>$( "#fone" )[0]).value
            }

            $.ajax({
                type: "POST",
                url: "/purchaseInformations",
                contentType: 'application/json; charset=utf-8',
                success: function() {
                    console.log('enviado com sucesso!');
                },
                data: JSON.stringify(pedido)
            });
        })

        JSON.parse(localStorage.getItem('carrinho')).idProduct.forEach((e: any, i: number) => {
            fetch(`/product/${e}`).then(e => e.json()).then(product => {
                const estoqueUpdated = {
                    productId: product.productId,
                    name: product.name,
                    image: product.image,
                    description: product.description,
                    price: product.price,
                    amount: product.amount - Number(JSON.parse(localStorage.getItem('carrinho')).ultimaQuantidadeSelecionada[i]),
                    supplierId: product.supplierId
                }

                console.log(estoqueUpdated)

                $.ajax({
                    type: "PUT",
                    url: `/product/${e}`,
                    contentType: 'application/json; charset=utf-8',
                    success: function() {
                        console.log('enviado com sucesso!');
                        localStorage.setItem('pedidoFinalizado', '1');
                        localStorage.removeItem('carrinho');
                        location.reload();
                    },
                    data: JSON.stringify(estoqueUpdated)
                });
            })
        })
    }

    private downloadPDF(): void {
        const dateCurrent: any = new Date().toJSON().slice(0,10).replace(/-/g,'/').split('/');
        const totalPreco: number = JSON.parse(localStorage.getItem('carrinho')).prodPreco.reduce((acumulator: number, preco: number) => acumulator + preco);

        $( "#container" ).html(`
        <table cellspacing="0" cellpadding="0" border="0" id="boletoTable">
            <tr>
                <td colspan="11" class="BoletoPontilhado">&nbsp;</td>
            </tr>
            <tr>
                <td colspan="4" class="BoletoLogo">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="160px" height="48px" viewBox="0 0 143 38" enable-background="new 0 0 143 38" xml:space="preserve">  <image id="image0" width="140" height="40" x="0" y="0" xlink:href="data:image/png;base64,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"/></svg>
                </td>
                <td colspan="2" class="BoletoCodigoBanco">104-0</td>
                <td colspan="6" class="BoletoLinhaDigitavel">10491.12343.56990.00004 00000.000422 3</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoTituloEsquerdo">Local de Pagamento</td>
                <td class="BoletoTituloDireito">Vencimento</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoValorEsquerdo" style="text-align: left; padding-left: 0.1cm;">Pagável em qualquer banco até o vencimento</td>
                <td class="BoletoValorDireito">Vencimento</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoTituloEsquerdo">Cedente</td>
                <td class="BoletoTituloDireito">Agência/Código do Cedente</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoValorEsquerdo" style="text-align: left; padding-left: 0.1cm;">GreenSystem</td>
                <td class="BoletoValorDireito">123-1234</td>
            </tr>
            <tr>
                <td colspan="3" class="BoletoTituloEsquerdo">Data do Documento</td>
                <td colspan="4" class="BoletoTituloEsquerdo">Número do Documento</td>
                <td class="BoletoTituloEsquerdo">Espécie</td>
                <td class="BoletoTituloEsquerdo">Aceite</td>
                <td class="BoletoTituloEsquerdo">Data do Processamento</td>
                <td class="BoletoTituloDireito">Nosso Numero</td>
            </tr>
            <tr>
                <td colspan="3" class="BoletoValorEsquerdo">${Number(dateCurrent[2] - 1)}/${dateCurrent[1]}/${dateCurrent[0]}</td>
                <td colspan="4" class="BoletoValorEsquerdo">0042</td>
                <td class="BoletoValorEsquerdo">RC</td>
                <td class="BoletoValorEsquerdo">N</td>
                <td class="BoletoValorEsquerdo">DataDoProces</td>
                <td class="BoletoValorDireito">99000000000042-5</td>
            </tr>
            <tr>
                <td colspan="3" class="BoletoTituloEsquerdo">Uso do Banco</td>
                <td colspan="2" class="BoletoTituloEsquerdo">Carteira</td>
                <td colspan="2" class="BoletoTituloEsquerdo">Moeda</td>
                <td colspan="2" class="BoletoTituloEsquerdo">Quantidade</td>
                <td class="BoletoTituloEsquerdo">(x) Valor</td>
                <td class="BoletoTituloDireito">(=) Valor do Documento</td>
            </tr>
            <tr>
                <td colspan="3" class="BoletoValorEsquerdo">&nbsp;</td>
                <td colspan="2" class="BoletoValorEsquerdo">SR</td>
                <td colspan="2" class="BoletoValorEsquerdo">R$</td>
                <td colspan="2" class="BoletoValorEsquerdo">&nbsp;</td>
                <td class="BoletoValorEsquerdo">${(totalPreco * 0.01).toLocaleString('pt-BR',{style: 'currency', currency:'BRL'})}</td>
                <td class="BoletoValorDireito">ValorDocumento</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoTituloEsquerdo">Instruções</td>
                <td class="BoletoTituloDireito">(-) Desconto</td>
            </tr>
            <tr>
                <td colspan="10" rowspan="9" class="BoletoValorEsquerdo" style="text-align: left; vertical-align: top; padding-left: 0.1cm;">Receber até 10 dias após o vencimento</td>
                <td class="BoletoValorDireito">&nbsp;</td>
            </tr>
            <tr>
                <td class="BoletoTituloDireito">(-) Outras Deduções/Abatimento</td>
            </tr>
            <tr>
                <td class="BoletoValorDireito">&nbsp;</td>
            </tr>
            <tr>
                <td class="BoletoTituloDireito">(+) Mora/Multa/Juros</td>
            </tr>
            <tr>
                <td class="BoletoValorDireito">&nbsp;</td>
            </tr>
            <tr>
                <td class="BoletoTituloDireito">(+) Outros Acréscimos</td>
            </tr>
            <tr>
                <td class="BoletoValorDireito">&nbsp;</td>
            </tr>
            <tr>
                <td class="BoletoTituloDireito">(=) Valor Cobrado</td>
            </tr>
            <tr>
                <td class="BoletoValorDireito">&nbsp;</td>
            </tr>
            <tr>
                <td rowspan="3" class="BoletoTituloSacado">Sacado:</td>
                <!-- <td colspan="8" class="BoletoValorSacado">NomedoSacado</td> -->
                <td colspan="2" class="BoletoValorSacado">446.322.318-00</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoValorSacado">Rua Professora Nicoleta Stella Germano. 398</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoValorSacado">São Carlos&nbsp;&nbsp;&nbsp;13312-472</td>
            </tr>
            <tr>
                <td colspan="2" class="BoletoTituloSacador">Sacador / Avalista:</td>
                <td colspan="9" class="BoletoValorSacador">&nbsp;GreenSystem</td>
            </tr>
            <tr>
                <td colspan="11" class="BoletoTituloDireito" style="text-align: right; padding-right: 0.1cm;">Recibo do Sacado - Autenticação Mecânica</td>
            </tr>
            <tr>
                <td colspan="11" height="60" valign="top">&nbsp;</td>
            </tr>
            <tr>
                <td colspan="11" class="BoletoPontilhado">&nbsp;</td>
            </tr>
            <tr>
                <td colspan="4" class="BoletoLogo">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="143px" height="38px" viewBox="0 0 143 38" enable-background="new 0 0 143 38" xml:space="preserve">  <image id="image0" width="143" height="38" x="0" y="0" xlink:href="data:image/png;base64,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"/></svg>
                </td>
                <td colspan="2" class="BoletoCodigoBanco">104-0</td>
                <td colspan="6" class="BoletoLinhaDigitavel">10491.12343.56990.00004 00000.000422 3</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoTituloEsquerdo">Local de Pagamento</td>
                <td class="BoletoTituloDireito">Vencimento</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoValorEsquerdo" style="text-align: left; padding-left: 0.1cm;">Pagável em qualquer banco até o vencimento</td>
                <td class="BoletoValorDireito">Vencimento</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoTituloEsquerdo">Cedente</td>
                <td class="BoletoTituloDireito">Agência/Código do Cedente</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoValorEsquerdo" style="text-align: left; padding-left: 0.1cm;">GreenSystem</td>
                <td class="BoletoValorDireito">123-1234</td>
            </tr>
            <tr>
                <td colspan="3" class="BoletoTituloEsquerdo">Data do Documento</td>
                <td colspan="4" class="BoletoTituloEsquerdo">Número do Documento</td>
                <td class="BoletoTituloEsquerdo">Espécie</td>
                <td class="BoletoTituloEsquerdo">Aceite</td>
                <td class="BoletoTituloEsquerdo">Data do Processamento</td>
                <td class="BoletoTituloDireito">Nosso Numero</td>
            </tr>
            <tr>
                <td colspan="3" class="BoletoValorEsquerdo">${Number(dateCurrent[2] - 1)}/${dateCurrent[1]}/${dateCurrent[0]}</td>
                <td colspan="4" class="BoletoValorEsquerdo">0042</td>
                <td class="BoletoValorEsquerdo">RC</td>
                <td class="BoletoValorEsquerdo">N</td>
                <td class="BoletoValorEsquerdo">DataDoProces</td>
                <td class="BoletoValorDireito">99000000000042-5</td>
            </tr>
            <tr>
                <td colspan="3" class="BoletoTituloEsquerdo">Uso do Banco</td>
                <td colspan="2" class="BoletoTituloEsquerdo">Carteira</td>
                <td colspan="2" class="BoletoTituloEsquerdo">Moeda</td>
                <td colspan="2" class="BoletoTituloEsquerdo">Quantidade</td>
                <td class="BoletoTituloEsquerdo">(x) Valor</td>
                <td class="BoletoTituloDireito">(=) Valor do Documento</td>
            </tr>
            <tr>
                <td colspan="3" class="BoletoValorEsquerdo">&nbsp;</td>
                <td colspan="2" class="BoletoValorEsquerdo">SR</td>
                <td colspan="2" class="BoletoValorEsquerdo">R$</td>
                <td colspan="2" class="BoletoValorEsquerdo">&nbsp;</td>
                <td class="BoletoValorEsquerdo">${(totalPreco * 0.01).toLocaleString('pt-BR',{style: 'currency', currency:'BRL'})}</td>
                <td class="BoletoValorDireito">ValorDocumento</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoTituloEsquerdo">Instruções</td>
                <td class="BoletoTituloDireito">(-) Desconto</td>
            </tr>
            <tr>
                <td colspan="10" rowspan="9" class="BoletoValorEsquerdo" style="text-align: left; vertical-align: top; padding-left: 0.1cm;">Receber até 10 dias após o vencimento</td>
                <td class="BoletoValorDireito">&nbsp;</td>
            </tr>
            <tr>
                <td class="BoletoTituloDireito">(-) Outras Deduções/Abatimento</td>
            </tr>
            <tr>
                <td class="BoletoValorDireito">&nbsp;</td>
            </tr>
            <tr>
                <td class="BoletoTituloDireito">(+) Mora/Multa/Juros</td>
            </tr>
            <tr>
                <td class="BoletoValorDireito">&nbsp;</td>
            </tr>
            <tr>
                <td class="BoletoTituloDireito">(+) Outros Acréscimos</td>
            </tr>
            <tr>
                <td class="BoletoValorDireito">&nbsp;</td>
            </tr>
            <tr>
                <td class="BoletoTituloDireito">(=) Valor Cobrado</td>
            </tr>
            <tr>
                <td class="BoletoValorDireito">&nbsp;</td>
            </tr>
            <tr>
                <td rowspan="3" class="BoletoTituloSacado">Sacado:</td>
                <!-- <td colspan="8" class="BoletoValorSacado">NomedoSacado</td> -->
                <td colspan="2" class="BoletoValorSacado">446.322.318-00</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoValorSacado">Rua Professora Nicoleta Stella Germano. 398</td>
            </tr>
            <tr>
                <td colspan="10" class="BoletoValorSacado">São Carlos&nbsp;&nbsp;&nbsp;13312-472</td>
            </tr>
            <tr>
                <td colspan="2" class="BoletoTituloSacador">Sacador / Avalista:</td>
                <td colspan="9" class="BoletoValorSacador">&nbsp;GreenSystem</td>
            </tr>
            <tr>
                <td colspan="11" class="BoletoTituloDireito" style="text-align: right; padding-right: 0.1cm;">Recibo do Sacado - Autenticação Mecânica</td>
            </tr>
            <tr>
                <td colspan="11" height="60" valign="top">
                    <svg width="410" height="50">
                        <path style="fill:#000000; stroke:none;" d="M0 0L0 50L1 50C1 35.9506 5.40871 12.8896 0 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M1 0L1 50L2 50C2 35.9506 6.40871 12.8896 1 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M2 0L2 50L3 50C3 35.9506 7.40871 12.8896 2 0z"/>
                        <path style="fill:#fdfdfd; stroke:none;" d="M3 0L3 50L4 50C4 35.9506 8.40871 12.8896 3 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M4 0L4 50L7 50L7 0L4 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M7 0L7 50L8 50C8 35.9506 12.4087 12.8896 7 0z"/>
                        <path style="fill:#010101; stroke:none;" d="M8 0L8 50L9 50C9 35.9506 13.4087 12.8896 8 0z"/>
                        <path style="fill:#fcfcfc; stroke:none;" d="M9 0L9 50L10 50C10 35.9506 14.4087 12.8896 9 0z"/>
                        <path style="fill:#040404; stroke:none;" d="M10 0L10 50L11 50C11 35.9506 15.4087 12.8896 10 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M11 0L11 50L14 50L14 0L11 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M14 0L14 50L15 50C15 35.9506 19.4087 12.8896 14 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M15 0L15 50L18 50L18 0L15 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M18 0L18 50L21 50L21 0L18 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M21 0L21 50L22 50C22 35.9506 26.4087 12.8896 21 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M22 0L22 50L23 50C23 35.9506 27.4087 12.8896 22 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M23 0L23 50L24 50C24 35.9506 28.4087 12.8896 23 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M24 0L24 50L25 50C25 35.9506 29.4087 12.8896 24 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M25 0L25 50L28 50L28 0L25 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M28 0L28 50L31 50L31 0L28 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M31 0L31 50L32 50C32 35.9506 36.4087 12.8896 31 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M32 0L32 50L33 50C33 35.9506 37.4087 12.8896 32 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M33 0L33 50L36 50L36 0L33 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M36 0L36 50L39 50L39 0L36 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M39 0L39 50L40 50C40 35.9506 44.4087 12.8896 39 0z"/>
                        <path style="fill:#050505; stroke:none;" d="M40 0L40 50L43 50L43 0L40 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M43 0L43 50L46 50L46 0L43 0z"/>
                        <path style="fill:#010101; stroke:none;" d="M46 0L46 50L49 50L49 0L46 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M49 0L49 50L52 50L52 0L49 0z"/>
                        <path style="fill:#020202; stroke:none;" d="M52 0L52 50L53 50C53 35.9506 57.4087 12.8896 52 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M53 0L53 50L54 50C54 35.9506 58.4087 12.8896 53 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M54 0L54 50L55 50C55 35.9506 59.4087 12.8896 54 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M55 0L55 50L56 50C56 35.9506 60.4087 12.8896 55 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M56 0L56 50L57 50C57 35.9506 61.4087 12.8896 56 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M57 0L57 50L58 50C58 35.9506 62.4087 12.8896 57 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M58 0L58 50L61 50L61 0L58 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M61 0L61 50L62 50C62 35.9506 66.4087 12.8896 61 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M62 0L62 50L65 50L65 0L62 0z"/>
                        <path style="fill:#fcfcfc; stroke:none;" d="M65 0L65 50L66 50C66 35.9506 70.4087 12.8896 65 0z"/>
                        <path style="fill:#040404; stroke:none;" d="M66 0L66 50L67 50C67 35.9506 71.4087 12.8896 66 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M67 0L67 50L70 50L70 0L67 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M70 0L70 50L71 50C71 35.9506 75.4087 12.8896 70 0z"/>
                        <path style="fill:#fdfdfd; stroke:none;" d="M71 0L71 50L72 50C72 35.9506 76.4087 12.8896 71 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M72 0L72 50L73 50C73 35.9506 77.4087 12.8896 72 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M73 0L73 50L76 50L76 0L73 0z"/>
                        <path style="fill:#020202; stroke:none;" d="M76 0L76 50L77 50C77 35.9506 81.4087 12.8896 76 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M77 0L77 50L78 50C78 35.9506 82.4087 12.8896 77 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M78 0L78 50L79 50C79 35.9506 83.4087 12.8896 78 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M79 0L79 50L80 50C80 35.9506 84.4087 12.8896 79 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M80 0L80 50L83 50L83 0L80 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M83 0L83 50L86 50L86 0L83 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M86 0L86 50L87 50C87 35.9506 91.4087 12.8896 86 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M87 0L87 50L90 50L90 0L87 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M90 0L90 50L93 50L93 0L90 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M93 0L93 50L94 50C94 35.9506 98.4087 12.8896 93 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M94 0L94 50L95 50C95 35.9506 99.4087 12.8896 94 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M95 0L95 50L96 50C96 35.9506 100.409 12.8896 95 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M96 0L96 50L97 50C97 35.9506 101.409 12.8896 96 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M97 0L97 50L98 50C98 35.9506 102.409 12.8896 97 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M98 0L98 50L101 50L101 0L98 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M101 0L101 50L104 50L104 0L101 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M104 0L104 50L107 50L107 0L104 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M107 0L107 50L110 50L110 0L107 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M110 0L110 50L111 50C111 35.9506 115.409 12.8896 110 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M111 0L111 50L112 50C112 35.9506 116.409 12.8896 111 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M112 0L112 50L113 50C113 35.9506 117.409 12.8896 112 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M113 0L113 50L114 50C114 35.9506 118.409 12.8896 113 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M114 0L114 50L115 50C115 35.9506 119.409 12.8896 114 0z"/>
                        <path style="fill:#fdfdfd; stroke:none;" d="M115 0L115 50L116 50C116 35.9506 120.409 12.8896 115 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M116 0L116 50L119 50L119 0L116 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M119 0L119 50L122 50L122 0L119 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M122 0L122 50L125 50L125 0L122 0z"/>
                        <path style="fill:#fafafa; stroke:none;" d="M125 0L125 50L128 50L128 0L125 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M128 0L128 50L129 50C129 35.9506 133.409 12.8897 128 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M129 0L129 50L130 50C130 35.9506 134.409 12.8897 129 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M130 0L130 50L131 50C131 35.9506 135.409 12.8897 130 0z"/>
                        <path style="fill:#fbfbfb; stroke:none;" d="M131 0L131 50L132 50C132 35.9506 136.409 12.8897 131 0z"/>
                        <path style="fill:#040404; stroke:none;" d="M132 0L132 50L133 50C133 35.9506 137.409 12.8897 132 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M133 0L133 50L136 50L136 0L133 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M136 0L136 50L139 50L139 0L136 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M139 0L139 50L140 50C140 35.9506 144.409 12.8897 139 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M140 0L140 50L141 50C141 35.9506 145.409 12.8897 140 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M141 0L141 50L144 50L144 0L141 0z"/>
                        <path style="fill:#010101; stroke:none;" d="M144 0L144 50L147 50L147 0L144 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M147 0L147 50L148 50C148 35.9506 152.409 12.8897 147 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M148 0L148 50L151 50L151 0L148 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M151 0L151 50L152 50C152 35.9506 156.409 12.8897 151 0z"/>
                        <path style="fill:#010101; stroke:none;" d="M152 0L152 50L153 50C153 35.9506 157.409 12.8897 152 0z"/>
                        <path style="fill:#fcfcfc; stroke:none;" d="M153 0L153 50L154 50C154 35.9506 158.409 12.8897 153 0z"/>
                        <path style="fill:#040404; stroke:none;" d="M154 0L154 50L155 50C155 35.9506 159.409 12.8897 154 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M155 0L155 50L158 50L158 0L155 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M158 0L158 50L159 50C159 35.9506 163.409 12.8897 158 0z"/>
                        <path style="fill:#fdfdfd; stroke:none;" d="M159 0L159 50L160 50C160 35.9506 164.409 12.8897 159 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M160 0L160 50L163 50L163 0L160 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M163 0L163 50L166 50L166 0L163 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M166 0L166 50L167 50C167 35.9506 171.409 12.8897 166 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M167 0L167 50L170 50L170 0L167 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M170 0L170 50L173 50L173 0L170 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M173 0L173 50L174 50C174 35.9506 178.409 12.8897 173 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M174 0L174 50L175 50C175 35.9506 179.409 12.8897 174 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M175 0L175 50L176 50C176 35.9506 180.409 12.8897 175 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M176 0L176 50L179 50L179 0L176 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M179 0L179 50L182 50L182 0L179 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M182 0L182 50L183 50C183 35.9506 187.409 12.8897 182 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M183 0L183 50L184 50C184 35.9506 188.409 12.8897 183 0z"/>
                        <path style="fill:#020202; stroke:none;" d="M184 0L184 50L185 50C185 35.9506 189.409 12.8897 184 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M185 0L185 50L186 50C186 35.9506 190.409 12.8897 185 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M186 0L186 50L189 50L189 0L186 0z"/>
                        <path style="fill:#fbfbfb; stroke:none;" d="M189 0L189 50L190 50C190 35.9506 194.409 12.8897 189 0z"/>
                        <path style="fill:#030303; stroke:none;" d="M190 0L190 50L191 50C191 35.9506 195.409 12.8897 190 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M191 0L191 50L194 50L194 0L191 0z"/>
                        <path style="fill:#010101; stroke:none;" d="M194 0L194 50L195 50C195 35.9506 199.409 12.8897 194 0z"/>
                        <path style="fill:#fdfdfd; stroke:none;" d="M195 0L195 50L198 50L198 0L195 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M198 0L198 50L201 50L201 0L198 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M201 0L201 50L202 50C202 35.9506 206.409 12.8897 201 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M202 0L202 50L203 50C203 35.9506 207.409 12.8897 202 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M203 0L203 50L204 50C204 35.9506 208.409 12.8897 203 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M204 0L204 50L205 50C205 35.9506 209.409 12.8897 204 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M205 0L205 50L206 50C206 35.9506 210.409 12.8897 205 0z"/>
                        <path style="fill:#020202; stroke:none;" d="M206 0L206 50L209 50L209 0L206 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M209 0L209 50L212 50L212 0L209 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M212 0L212 50L215 50L215 0L212 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M215 0L215 50L218 50L218 0L215 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M218 0L218 50L219 50C219 35.9506 223.409 12.8897 218 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M219 0L219 50L220 50C220 35.9506 224.409 12.8897 219 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M220 0L220 50L223 50L223 0L220 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M223 0L223 50L224 50C224 35.9506 228.409 12.8897 223 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M224 0L224 50L227 50L227 0L224 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M227 0L227 50L230 50L230 0L227 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M230 0L230 50L231 50C231 35.9506 235.409 12.8897 230 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M231 0L231 50L232 50C232 35.9506 236.409 12.8897 231 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M232 0L232 50L233 50C233 35.9506 237.409 12.8897 232 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M233 0L233 50L236 50L236 0L233 0z"/>
                        <path style="fill:#020202; stroke:none;" d="M236 0L236 50L237 50C237 35.9506 241.409 12.8897 236 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M237 0L237 50L238 50C238 35.9506 242.409 12.8897 237 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M238 0L238 50L239 50C239 35.9506 243.409 12.8897 238 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M239 0L239 50L242 50L242 0L239 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M242 0L242 50L245 50L245 0L242 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M245 0L245 50L246 50C246 35.9506 250.409 12.8897 245 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M246 0L246 50L247 50C247 35.9506 251.409 12.8897 246 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M247 0L247 50L250 50L250 0L247 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M250 0L250 50L253 50L253 0L250 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M253 0L253 50L254 50C254 35.9506 258.409 12.8897 253 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M254 0L254 50L255 50C255 35.9506 259.409 12.8897 254 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M255 0L255 50L256 50C256 35.9506 260.409 12.8897 255 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M256 0L256 50L257 50C257 35.9506 261.409 12.8897 256 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M257 0L257 50L258 50C258 35.9506 262.409 12.8897 257 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M258 0L258 50L261 50L261 0L258 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M261 0L261 50L262 50C262 35.9506 266.409 12.8897 261 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M262 0L262 50L265 50L265 0L262 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M265 0L265 50L268 50L268 0L265 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M268 0L268 50L269 50C269 35.9506 273.409 12.8897 268 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M269 0L269 50L272 50L272 0L269 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M272 0L272 50L273 50C273 35.9506 277.409 12.8897 272 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M273 0L273 50L274 50C274 35.9506 278.409 12.8897 273 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M274 0L274 50L277 50L277 0L274 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M277 0L277 50L280 50L280 0L277 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M280 0L280 50L281 50C281 35.9506 285.409 12.8897 280 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M281 0L281 50L282 50C282 35.9506 286.409 12.8897 281 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M282 0L282 50L283 50C283 35.9506 287.409 12.8897 282 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M283 0L283 50L284 50C284 35.9506 288.409 12.8897 283 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M284 0L284 50L285 50C285 35.9506 289.409 12.8897 284 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M285 0L285 50L286 50C286 35.9506 290.409 12.8897 285 0z"/>
                        <path style="fill:#020202; stroke:none;" d="M286 0L286 50L289 50L289 0L286 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M289 0L289 50L292 50L292 0L289 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M292 0L292 50L295 50L295 0L292 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M295 0L295 50L298 50L298 0L295 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M298 0L298 50L301 50L301 0L298 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M301 0L301 50L302 50C302 35.9506 306.409 12.8897 301 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M302 0L302 50L303 50C303 35.9506 307.409 12.8897 302 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M303 0L303 50L304 50C304 35.9506 308.409 12.8897 303 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M304 0L304 50L305 50C305 35.9506 309.409 12.8897 304 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M305 0L305 50L308 50L308 0L305 0z"/>
                        <path style="fill:#020202; stroke:none;" d="M308 0L308 50L309 50C309 35.9506 313.409 12.8897 308 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M309 0L309 50L310 50C310 35.9506 314.409 12.8897 309 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M310 0L310 50L311 50C311 35.9506 315.409 12.8897 310 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M311 0L311 50L312 50C312 35.9506 316.409 12.8897 311 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M312 0L312 50L313 50C313 35.9506 317.409 12.8897 312 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M313 0L313 50L314 50C314 35.9506 318.409 12.8897 313 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M314 0L314 50L315 50C315 35.9506 319.409 12.8897 314 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M315 0L315 50L318 50L318 0L315 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M318 0L318 50L321 50L321 0L318 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M321 0L321 50L324 50L324 0L321 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M324 0L324 50L327 50L327 0L324 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M327 0L327 50L328 50C328 35.9506 332.409 12.8897 327 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M328 0L328 50L329 50C329 35.9506 333.409 12.8897 328 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M329 0L329 50L330 50C330 35.9506 334.409 12.8897 329 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M330 0L330 50L331 50C331 35.9506 335.409 12.8897 330 0z"/>
                        <path style="fill:#fdfdfd; stroke:none;" d="M331 0L331 50L332 50C332 35.9506 336.409 12.8897 331 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M332 0L332 50L335 50L335 0L332 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M335 0L335 50L338 50L338 0L335 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M338 0L338 50L341 50L341 0L338 0z"/>
                        <path style="fill:#fafafa; stroke:none;" d="M341 0L341 50L344 50L344 0L341 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M344 0L344 50L345 50C345 35.9506 349.409 12.8897 344 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M345 0L345 50L346 50C346 35.9506 350.409 12.8897 345 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M346 0L346 50L347 50C347 35.9506 351.409 12.8897 346 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M347 0L347 50L348 50C348 35.9506 352.409 12.8897 347 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M348 0L348 50L349 50C349 35.9506 353.409 12.8897 348 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M349 0L349 50L350 50C350 35.9506 354.409 12.8897 349 0z"/>
                        <path style="fill:#020202; stroke:none;" d="M350 0L350 50L353 50L353 0L350 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M353 0L353 50L356 50L356 0L353 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M356 0L356 50L359 50L359 0L356 0z"/>
                        <path style="fill:#fcfcfc; stroke:none;" d="M359 0L359 50L362 50L362 0L359 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M362 0L362 50L363 50C363 35.9506 367.409 12.8897 362 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M363 0L363 50L364 50C364 35.9506 368.409 12.8897 363 0z"/>
                        <path style="fill:#030303; stroke:none;" d="M364 0L364 50L365 50C365 35.9506 369.409 12.8897 364 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M365 0L365 50L368 50L368 0L365 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M368 0L368 50L369 50C369 35.9506 373.409 12.8897 368 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M369 0L369 50L370 50C370 35.9506 374.409 12.8897 369 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M370 0L370 50L373 50L373 0L370 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M373 0L373 50L374 50C374 35.9506 378.409 12.8897 373 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M374 0L374 50L377 50L377 0L374 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M377 0L377 50L380 50L380 0L377 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M380 0L380 50L381 50C381 35.9506 385.409 12.8897 380 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M381 0L381 50L382 50C382 35.9506 386.409 12.8897 381 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M382 0L382 50L385 50L385 0L382 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M385 0L385 50L386 50C386 35.9506 390.409 12.8897 385 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M386 0L386 50L389 50L389 0L386 0z"/>
                        <path style="fill:#fbfbfb; stroke:none;" d="M389 0L389 50L390 50C390 35.9506 394.409 12.8897 389 0z"/>
                        <path style="fill:#030303; stroke:none;" d="M390 0L390 50L391 50C391 35.9506 395.409 12.8897 390 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M391 0L391 50L392 50C392 35.9506 396.409 12.8897 391 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M392 0L392 50L393 50C393 35.9506 397.409 12.8897 392 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M393 0L393 50L396 50L396 0L393 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M396 0L396 50L397 50C397 35.9506 401.409 12.8897 396 0z"/>
                        <path style="fill:#fefefe; stroke:none;" d="M397 0L397 50L400 50L400 0L397 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M400 0L400 50L403 50L403 0L400 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M403 0L403 50L404 50C404 35.9506 408.409 12.8897 403 0z"/>
                        <path style="fill:#000000; stroke:none;" d="M404 0L404 50L405 50C405 35.9506 409.409 12.8897 404 0z"/>
                        <path style="fill:#ffffff; stroke:none;" d="M405 0L405 50L410 50L410 0L405 0z"/>
                    </svg>
                </td>
            </tr>
            <tr>
                <td colspan="11" class="BoletoPontilhado">&nbsp;</td>
            </tr>
        </table>
        `)

        const options = {
            filename: `boleto-${Number(dateCurrent[2] - 1)}-${dateCurrent[1]}-${dateCurrent[0]}.pdf`,
            image: { type: 'jpeg' },
            html2canvas: {},
            jsPDF: {orientation: 'portrait'}
        }

        const element = $( "#boletoTable" )[0]

        html2pdf()
            .from(element)
            .set(options)
            .save();
    }
}

const finalizarCompra: FinalizarCompra = new FinalizarCompra();