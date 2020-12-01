import * as $ from 'jquery';
import './carrinho.component.css';
import 'bootstrap';

import { IProducts } from './../interfaces/products.interface';

class Carrinho {
    private carrinho: IProducts;

    private idProduct                  : Array<number> = [];
    private prodStatus                 : Array<number> = [];
    private prodName                   : Array<string> = [];
    private prodPreco                  : Array<number> = [];
    private quantidade                 : Array<number> = [];
    private ultimaQuantidadeSelecionada: Array<number> = [];
    private productIdDb                : Array<number> = [];

    private jsonCarrinho: IProducts;
    
    private messageEmptyItens: string = `
    <center>
        <svg style="margin-top: 20%" width="5em" height="5em" viewBox="0 0 16 16" class="bi bi-exclamation-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
        </svg>
        <h3 class="mt-4">Não há itens adicionados ao carrinho!</h3>
    </center>
    `

    constructor() {
        if (localStorage.getItem('carrinho')) {
            this.getselectedProducts();
        } else {
            $( ".container" ).html(this.messageEmptyItens);
        }
    }

    private getselectedProducts(): void {
        const selectedProducts = JSON.parse(localStorage.getItem('carrinho'));
        const { idProduct, prodName, ultimaQuantidadeSelecionada, prodPreco, productIdDb } = selectedProducts
        
        for (let i = 0; i < prodPreco.length; i++) {
            $( "tbody" ).append(`
                <tr class="table-row">
                    <th scope="row" class="idProduct">${idProduct[i]}</th>
                    <td class="prodName">${prodName[i]}</td>
                    <td class="prodQuantidade">${ultimaQuantidadeSelecionada[i]}</td>
                    <td class="precoDouble d-none">${prodPreco[i]}</td>
                    <td class="productIdDb d-none">${productIdDb[i]}</td>
                    <td class="prodPreco">${(prodPreco[i] * 0.01 / ultimaQuantidadeSelecionada[i]).toLocaleString('pt-BR',{style: 'currency', currency:'BRL'})}</td>
                    <td>
                        <button type="button" class="btn btn-danger rounded-circle ml-3">X
                            <span class="d-none">${i}</span>
                        </button>
                    </td>
                </tr>
            `)
        }

        this.dataPersistence(prodPreco.length);
        this.addEvents();
        this.calcuclateTotal();
    }

    private dataPersistence(productsAmount: number): void {
        if (localStorage.getItem('carrinho')) {
            this.jsonCarrinho = JSON.parse(localStorage.getItem('carrinho'));

            for (let idProduct of this.jsonCarrinho.idProduct) this.idProduct.push(idProduct);
            for (let produtoStatus of this.jsonCarrinho.prodStatus) this.prodStatus.push(produtoStatus);
            for (let produtoName of this.jsonCarrinho.prodName) this.prodName.push(produtoName);
            for (let produtoPreco of this.jsonCarrinho.prodPreco) this.prodPreco.push(produtoPreco);
            for (let quantidade of this.jsonCarrinho.quantidade) this.quantidade.push(quantidade);
            for (let ultimaQuantidadeSelecionada of this.jsonCarrinho.ultimaQuantidadeSelecionada) this.ultimaQuantidadeSelecionada.push(ultimaQuantidadeSelecionada);
            for (let productIdDb of this.jsonCarrinho.productIdDb) this.productIdDb.push(productIdDb);
        }
    }

    private addEvents(): void {
        const classScope: Carrinho = this;

        $( ".btn-danger" ).click(function() {
            const prodIndex = Number(this.getElementsByTagName('span')[0].innerText);

            classScope.idProduct.splice(classScope.idProduct.indexOf(Number($( ".idProduct" )[prodIndex].innerText)), 1);
            classScope.prodName.splice(classScope.prodName.indexOf($( ".prodName" )[prodIndex].innerText), 1);
            classScope.prodStatus[Number($( ".idProduct" )[prodIndex].innerText) - 1] = 0;
            classScope.prodPreco.splice(classScope.prodPreco.indexOf(Number($( ".precoDouble" )[prodIndex].innerText)), 1);
            classScope.productIdDb.splice(classScope.productIdDb.indexOf(Number($( ".productIdDb" )[prodIndex].innerText)), 1);
            classScope.quantidade[Number($( ".idProduct" )[prodIndex].innerText) - 1] = 1;
            classScope.ultimaQuantidadeSelecionada.splice(classScope.ultimaQuantidadeSelecionada.indexOf(Number($( ".prodQuantidade" )[prodIndex].innerText)), 1);

            classScope.saveLocalStorage(classScope.idProduct, classScope.prodStatus, classScope.prodName, classScope.prodPreco, classScope.quantidade, classScope.ultimaQuantidadeSelecionada, classScope.productIdDb);
            location.reload();
        })
    }

    private calcuclateTotal(): void {
        try {
            const totalPreco: number = JSON.parse(localStorage.getItem('carrinho')).prodPreco.reduce((acumulator: number, preco: number) => acumulator + preco);
            $( "#precoTotal" ).text((totalPreco * 0.01).toLocaleString('pt-BR',{style: 'currency', currency:'BRL'}));
        } catch(_) {
            $( ".container" ).html(this.messageEmptyItens);
        }
    }

    private saveLocalStorage(idProduct: number[], prodStatus: number[], prodName: string[], prodPreco: number[], quantidade: number[], ultimaQuantidadeSelecionada: number[], productIdDb: number[]): void {
        this.carrinho = {
            idProduct: idProduct,
            prodName: prodName,
            prodStatus: prodStatus,
            prodPreco: prodPreco,
            quantidade: quantidade,
            ultimaQuantidadeSelecionada: ultimaQuantidadeSelecionada,
            productIdDb: productIdDb
        };

        localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
    }
}

const carrinho: Carrinho = new Carrinho();