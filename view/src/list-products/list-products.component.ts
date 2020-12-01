import * as $ from 'jquery';
import './list-products.component.css';
import 'bootstrap';
// @ts-ignore
import { verifyLogged } from './../decorators/verify.ts';
import { IProducts } from './../interfaces/products.interface';

class ListProducts {
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
        this.getProducts();
        (<any>$('.carousel')).carousel({ interval: 4000, pause: "false" });
    }
    
    private getProducts(): void {        
        $.get( "/product", datas => {
            this.dataPersistence(datas.length);

            let adicionarProduto: string, removerProduto: string;

            $.each(datas, (index, { name, image, description, price, amount, productId }) => {
                if (localStorage.getItem('carrinho')) {
                    this.jsonCarrinho = JSON.parse(localStorage.getItem('carrinho'));
                    adicionarProduto = this.jsonCarrinho.prodStatus[Number(index)] === 0 ? "inline" : "none";
                    removerProduto = this.jsonCarrinho.prodStatus[Number(index)] === 0 ? "none" : "inline";
                } else {
                    adicionarProduto = "inline";
                    removerProduto = "none";
                }

                $( "#products" ).append(`
                    <div class="col-sm">
                        <div class="card" style="width: 18rem; height: 44rem;">
                            <img class="card-img-top mt-4" src="${image}" height="200" alt="Card image cap">
                            <div class="card-body">
                                <h5 class="card-title" style="height: 6.25rem;">${name}</h5>
                                <p class="card-text" style="height: 6.25rem;">${description}</p>
                                <h3 class="produto-preco">${price.toLocaleString('pt-BR',{style: 'currency', currency:'BRL'})}</h3>
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text pl-5 pr-5" id="basic-addon3">Quantidade:</span>
                                    </div>
                                    <input type="number" name="${index.toString()}" value="${this.quantidade[Number(index)]}" class="form-control" id="basic-url" aria-describedby="basic-addon3">
                                </div>
                                <p class="amount-available">Quantidade disponível: ${amount}</p>
                                <p class="quantidade-disponivel" style="display: none">${amount}</p>
                                <p class="productIdDb" style="display: none">${productId}</p>
                                <button name="${index.toString()}" class="btn btn-success w-100" style="display: ${adicionarProduto}">Adicionar ao carrinho</button>
                                <button name="${index.toString()}" class="btn btn-danger w-100" style="display: ${removerProduto}">Remover do carrinho</button>
                                <a href="product-details/?${(Number(index) + 1).toString()}" class="btn btn-primary w-100 mt-1">Detalhes do produto</a>
                            </div>
                        </div>
                    </div>
                `);
            });

            $( "#loading" ).remove();
            $( ".page-footer" ).removeAttr( "style" );
            
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
        const classScope: ListProducts = this;

        $( ".btn-success" ).click(function() {
            if (localStorage.getItem('username')) {
                const idProduct = Number(this.getAttribute('name'));
                classScope.idProduct.push(idProduct + 1);
                classScope.prodStatus[idProduct] = 1;
                classScope.prodName.push($( ".card-title" )[idProduct].innerText);
                classScope.prodPreco.push(Number($( ".produto-preco" )[idProduct].innerText.replace(/[^0-9]+/g,"")) * Number((<HTMLInputElement>$( ".form-control" )[idProduct]).value));
                classScope.quantidade[idProduct] = Number((<HTMLInputElement>$( ".form-control" )[idProduct]).value);
                classScope.ultimaQuantidadeSelecionada.push(Number((<HTMLInputElement>$( ".form-control" )[idProduct]).value));
                classScope.productIdDb.push(Number((<HTMLInputElement>$( ".productIdDb" )[idProduct]).innerText));

                console.log(classScope.productIdDb)

                $( ".btn-success" )[idProduct].style.display = 'none';
                $( ".btn-danger" )[idProduct].style.display = 'inline';
                $( ".form-control" )[idProduct].setAttribute("disabled", "disabled");
                
                classScope.saveLocalStorage(classScope.idProduct, classScope.prodStatus, classScope.prodName, classScope.prodPreco, classScope.quantidade, classScope.ultimaQuantidadeSelecionada, classScope.productIdDb);
            } else {
                location.href = 'login'
            }
        })

        $( ".btn-danger" ).click(function() {
            const idProduct = Number(this.getAttribute('name'));
            classScope.idProduct.splice(classScope.idProduct.indexOf(idProduct + 1), 1);
            classScope.prodStatus[idProduct] = 0;
            classScope.prodName.splice(classScope.prodName.indexOf($( ".card-title" )[idProduct].innerText), 1);
            classScope.prodPreco.splice(classScope.prodPreco.indexOf(Number($( ".produto-preco" )[idProduct].innerText.replace(/[^0-9]+/g,"")) * Number((<HTMLInputElement>$( ".form-control" )[idProduct]).value)), 1);
            classScope.quantidade[idProduct] = 1;
            classScope.ultimaQuantidadeSelecionada.splice(classScope.ultimaQuantidadeSelecionada.indexOf(Number((<HTMLInputElement>$( ".form-control" )[idProduct]).value)), 1);
            classScope.productIdDb.splice(classScope.productIdDb.indexOf(Number((<HTMLInputElement>$( ".productIdDb" )[idProduct]).innerText)), 1)

            $( ".btn-success" )[idProduct].style.display = 'inline';
            $( ".btn-danger" )[idProduct].style.display = 'none';
            $( ".form-control" )[idProduct].removeAttribute("disabled");

            classScope.saveLocalStorage(classScope.idProduct, classScope.prodStatus, classScope.prodName, classScope.prodPreco, classScope.quantidade, classScope.ultimaQuantidadeSelecionada, classScope.productIdDb);
        })

        $( ".form-control" ).change(function() {
            const actualElement         = Number(this.getAttribute('name'));
            const quantidadeDisponivel  = Number($( ".quantidade-disponivel" )[actualElement].innerText);
            const quantidadeSelecionada = Number((<HTMLInputElement>this).value);
            
            if (quantidadeSelecionada > quantidadeDisponivel || quantidadeSelecionada < 1)
                $( ".btn-success" )[actualElement].setAttribute("disabled", "disabled");
            else
                $( ".btn-success" )[actualElement].removeAttribute("disabled");
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

const listProduct: ListProducts = new ListProducts();