import * as $ from 'jquery';
import './product-details.component.css'
import 'bootstrap';
// @ts-ignore
import { verifyLogged } from './../decorators/verify.ts';
import { IProducts } from './../interfaces/products.interface';

class ProductDetails {
    private carrinho: IProducts;

    private idProduct                  : Array<number> = [];
    private prodStatus                 : Array<number> = [];
    private prodName                   : Array<string> = [];
    private prodPreco                  : Array<number> = [];
    private quantidade                 : Array<number> = [];
    private ultimaQuantidadeSelecionada: Array<number> = [];
    private productIdDb                : Array<number> = [];
    
    private jsonCarrinho: IProducts;

    @verifyLogged
    private username: string;

    constructor() {
        this.getProduct();
    }

    private getProduct(): void {
        $.get( "/product", datas => {
            const productIndex = Number(location.search.replace(/[^0-9]/g,"")) - 1
            const { name, image, description, price, amount, productId } = datas[productIndex]
            
            this.dataPersistence(datas.length);

            let adicionarProduto: string, removerProduto: string;

            if (localStorage.getItem('carrinho')) {
                this.jsonCarrinho = JSON.parse(localStorage.getItem('carrinho'));
                adicionarProduto = this.jsonCarrinho.prodStatus[productIndex] === 0 ? "inline" : "none";
                removerProduto = this.jsonCarrinho.prodStatus[productIndex] === 0 ? "none" : "inline";
            } else {
                adicionarProduto = "inline";
                removerProduto = "none";
            }

            $( ".container" ).append(`
                <div class="row pt-5 pb-5 mb-5 details-card">
                    <div class="col-sm">
                        <img src="${image}" width="500" height="500">
                    </div>
                    <div class="col-sm" style="margin-left: 100px">
                        <div class="card mt-5" style="width: 20rem; border: none">
                            <div class="card-body">
                                <h5 id="card-title" style="height: 5.25rem;">${name}</h5>
                                <p class="card-text">${description}</p>
                                <h3 id="produto-preco">${price.toLocaleString('pt-BR',{style: 'currency', currency:'BRL'})}</h3>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" style="padding-left: 60px; padding-right: 60px;" id="basic-addon3">Quantidade:</span>
                                    </div>
                                    <input type="number" value="${this.quantidade[Number(productIndex)]}" class="form-control" id="basic-url" aria-describedby="basic-addon3">
                                </div>
                                <p class="quantidade-disponivel">Quantidade disponível: ${amount}</p>
                                <p class="productIdDb" style="display: none">${productId}</p>
                                <div class="d-flex">
                                    <button class="btn btn-success" style="display: ${adicionarProduto}">Adicionar ao carrinho</button>
                                    <button class="btn btn-danger" style="display: ${removerProduto}">Remover do carrinho</button>
                                    <a class="btn btn-primary ml-2" href="/carrinho/">Comprar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `)

            this.addEvents();
        })
    }

    private dataPersistence(productsAmount: number): void {
        if (localStorage.getItem('carrinho') === null) {
            this.prodStatus = Array(productsAmount).fill(0);
            this.quantidade = Array(productsAmount).fill(1);
        } else {
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
        const classScope: ProductDetails = this;

        $( ".btn-success" ).click(function() {
            if (localStorage.getItem('username')) {
                const idProduct = Number(Number(location.search.replace(/[^0-9]/g,"")) - 1);
                classScope.idProduct.push(idProduct + 1);
                classScope.prodStatus[idProduct] = 1
                classScope.prodName.push((<any>$( "#card-title" )[0]).innerText);
                classScope.prodPreco.push((<any>$( "#produto-preco" )[0]).innerText.replace(/[^0-9]+/g,"") * Number((<HTMLInputElement>$( ".form-control" )[0]).value));
                classScope.quantidade[idProduct] = Number((<HTMLInputElement>$( ".form-control" )[0]).value);
                classScope.ultimaQuantidadeSelecionada.push(Number((<HTMLInputElement>$( ".form-control" )[0]).value));
                classScope.productIdDb.push(Number((<HTMLInputElement>$( ".productIdDb" )[0]).innerText));

                (<any>$( ".btn-success" )[0]).style.display = 'none';
                (<any>$( ".btn-danger" )[0]).style.display = 'inline';
                $( ".form-control" ).attr("disabled", "disabled");

                classScope.saveLocalStorage(classScope.idProduct, classScope.prodStatus, classScope.prodName, classScope.prodPreco, classScope.quantidade, classScope.ultimaQuantidadeSelecionada, classScope.productIdDb);
            } else {
                location.href = '/login'
            }
        })

        $( ".btn-danger" ).click(function() {
            const idProduct = Number(Number(location.search.replace(/[^0-9]/g,"")) - 1);
            classScope.idProduct.splice(classScope.idProduct.indexOf(idProduct + 1), 1);
            classScope.prodStatus[idProduct] = 0;
            classScope.prodName.splice(classScope.prodName.indexOf((<any>$( "#card-title" )[0]).innerText), 1);
            classScope.prodPreco.splice(classScope.prodPreco.indexOf((<any>$( "#produto-preco" )[0]).innerText.replace(/[^0-9]+/g,"") * Number((<HTMLInputElement>$( ".form-control" )[0]).value)), 1)
            classScope.quantidade[idProduct] = 1;
            classScope.ultimaQuantidadeSelecionada.splice(classScope.ultimaQuantidadeSelecionada.indexOf(Number((<HTMLInputElement>$( ".form-control" )[0]).value)), 1);
            classScope.productIdDb.splice(classScope.productIdDb.indexOf(Number((<HTMLInputElement>$( ".productIdDb" )[0]).innerText)), 1);

            (<any>$( ".btn-success" )[0]).style.display = 'inline';
            (<any>$( ".btn-danger" )[0]).style.display = 'none';
            $( ".form-control" ).removeAttr("disabled");

            classScope.saveLocalStorage(classScope.idProduct, classScope.prodStatus, classScope.prodName, classScope.prodPreco, classScope.quantidade, classScope.ultimaQuantidadeSelecionada, classScope.productIdDb);
        })

        $( ".form-control" ).change(function() {
            const quantidadeDisponivel  = Number($( ".quantidade-disponivel" )[0].innerText.replace(/\D/g, ''));
            const quantidadeSelecionada = Number((<HTMLInputElement>this).value);

            if (quantidadeSelecionada > quantidadeDisponivel || quantidadeSelecionada < 1) {
                $( ".btn-success" )[0].setAttribute("disabled", "disabled");
                $( ".btn-primary" ).addClass('disabled');
            } else {
                $( ".btn-success" )[0].removeAttribute("disabled");
                $( ".btn-primary" )[0].removeAttribute("disabled");
                $( ".btn-primary" ).removeClass('disabled');
            }
        })
        
        $( ".logout" ).click(function() {
            localStorage.clear();
            location.reload();
        })
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

const productDetails: ProductDetails = new ProductDetails();