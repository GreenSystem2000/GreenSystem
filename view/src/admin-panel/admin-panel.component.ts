import * as $ from 'jquery';
import './admin-panel.component.css';
import 'bootstrap';

class AdminPanel {
    private suppliersList = new Array();

    constructor() {
        this.addGlobalEvents();
        this.getSuppliers();
        this.getUsers();
        this.getProducts();
        this.getPurchase();
    }

    private addGlobalEvents(): void {
        if (localStorage.getItem('lastTable') === '1') {
            $( ".table-user-container" )[0].style.display = null;
            $( ".table-supplier-container" )[0].style.display = 'none';
            $( ".table-product-container" )[0].style.display = 'none';
            $( ".table-purchase-container" )[0].style.display = 'none';
        } else if (localStorage.getItem('lastTable') === '2') {
            $( ".table-user-container" )[0].style.display = 'none';
            $( ".table-supplier-container" )[0].style.display = null;
            $( ".table-product-container" )[0].style.display = 'none';
            $( ".table-purchase-container" )[0].style.display = 'none';
        } else if (localStorage.getItem('lastTable') === '3') {
            $( ".table-user-container" )[0].style.display = 'none';
            $( ".table-supplier-container" )[0].style.display = 'none';
            $( ".table-product-container" )[0].style.display = null;
            $( ".table-purchase-container" )[0].style.display = 'none';
        } else if (localStorage.getItem('lastTable') === '4') {
            $( ".table-user-container" )[0].style.display = 'none';
            $( ".table-supplier-container" )[0].style.display = 'none';
            $( ".table-product-container" )[0].style.display = 'none';
            $( ".table-purchase-container" )[0].style.display = null;
        }
        
        $( ".user-table" ).click(() => {
            $( ".table-user-container" )[0].style.display = null;
            $( ".table-supplier-container" )[0].style.display = 'none';
            $( ".table-product-container" )[0].style.display = 'none';
            $( ".table-purchase-container" )[0].style.display = 'none';
            localStorage.setItem('lastTable', '1');
        })
        $( ".supplier-table" ).click(() => {            
            $( ".table-user-container" )[0].style.display = 'none';
            $( ".table-supplier-container" )[0].style.display = null;
            $( ".table-product-container" )[0].style.display = 'none';
            $( ".table-purchase-container" )[0].style.display = 'none';
            localStorage.setItem('lastTable', '2');
        })
        $( ".product-table" ).click(() => {
            $( ".table-user-container" )[0].style.display = 'none';
            $( ".table-supplier-container" )[0].style.display = 'none';
            $( ".table-product-container" )[0].style.display = null;
            $( ".table-purchase-container" )[0].style.display = 'none';
            localStorage.setItem('lastTable', '3');
        })
        $( ".purchase-table" ).click(() => {
            $( ".table-user-container" )[0].style.display = 'none';
            $( ".table-supplier-container" )[0].style.display = 'none';
            $( ".table-product-container" )[0].style.display = 'none';
            $( ".table-purchase-container" )[0].style.display = null;
            localStorage.setItem('lastTable', '4');
        })

        $( ".logout" ).click(function() {
            localStorage.clear();
            location.reload();
        })
    }

    
    private getUsers(): void {
        $( ".container-fluid" )[0].innerHTML = `
            <div class="card mb-4">
                <div class="card-header">
                    <i class="fas fa-user mr-1"></i>
                    Usuários
                </div>
                <div class="row">
                    <div class="col-12">
                        <button id="add-user" class="btn btn-primary float-right mr-4 mt-3"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nome</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="users">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `

        $.get( "/user", user => {         
            for (let i = 0; i < user.length; i++) {
                let { name, username, email, userId } = user[i];

                $( "#users" )[0].innerHTML += `
                    <tr class="user-row">
                        <td class="userId">${userId}</td>
                        <td>${name}</td>
                        <td>${username}</td>
                        <td>${email}</td>
                        <td><button class="btn btn-danger delete-user" id="${i}"><i class="fas fa-times"></i></button></td>
                    </tr>
                `
            }
            this.addEventsUser();
        })
    }

    private getPurchase(): void {
        $( ".container-fluid" )[6].innerHTML = `
            <div class="card mb-4">
                <div class="card-header">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cart mb-2 mr-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                    </svg>
                    Pedidos de compra
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ID do produto</th>
                                    <th>Nome do produto</th>
                                    <th>Preço do produto</th>
                                    <th>Usuario</th>
                                </tr>
                            </thead>
                            <tbody id="purchases">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `

        $.get( "/purchaseinformations", purchase => {
            for (let i = 0; i < purchase.length; i++) {
                $( "#purchases" )[0].innerHTML += `
                    <tr class="purchase-row">
                        <td class="purchaseId">${purchase[i].purchaseInformationsId}</td>
                        <td class="purchaseId">${purchase[i].productId}</td>
                        <td class="purchaseId">${purchase[i].product.name}</td>
                        <td class="purchaseId">${purchase[i].product.price.toLocaleString('pt-BR',{style: 'currency', currency:'BRL'})}</td>
                        <td class="purchaseId">${purchase[i].username}</td>
                    </tr>
                `
            }

            console.log(purchase)
        })
    }

    private getSuppliers(): void {
        $( ".container-fluid" )[2].innerHTML = `
            <div class="card mb-4">
                <div class="card-header">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-archive mr-1 mb-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                    Fornecedores
                </div>
                <div class="row">
                    <div class="col-12">
                        <button id="add-supplier" class="btn btn-primary float-right mr-4 mt-3"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nome</th>
                                    <th>CNPJ</th>
                                    <th>Endreço</th>
                                    <th>Cidade</th>
                                    <th>Estado</th>
                                    <th>Telefone</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="suppliers">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `

        $.get( "/supplier", supplier => {
            this.suppliersList = [...supplier];

            for (let i = 0; i < supplier.length; i++) {
                let {supplierId, name, cnpj, address, city, state, phone} = supplier[i]

                $( "#suppliers" )[0].innerHTML += `
                    <tr class="supplier-row">
                        <td class="suplierId">${supplierId}</td>
                        <td>${name}</td>
                        <td>${cnpj}</td>
                        <td>${address}</td>
                        <td>${city}</td>
                        <td>${state}</td>
                        <td>${phone}</td>
                        <td><button class="btn btn-primary update-supplier" id="${i}"><i class="far fa-edit"></i></button></td>
                        <td><button class="btn btn-danger delete-supplier" id="${i}"><i class="fas fa-times"></i></button></td>
                        <td class="d-none"><button class="btn btn-success save-update-supplier" id="${i}"><i class="far fa-save" disabled></i></button></td>
                        <td class="d-none"><button class="btn btn-danger cancel-update-supplier" id="${i}"><i class="fas fa-times"></i></button></td>
                    </tr>
                `
            }

            this.addEventSupplier();
        })
    }

    private getProducts(): void {
        $( ".container-fluid" )[4].innerHTML = `
            <div class="card mb-4">
                <div class="card-header">
                    <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-box mb-1 mr-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
                    </svg>
                    Produtos
                </div>
                <div class="row">
                    <div class="col-12">
                        <button id="add-product" class="btn btn-primary float-right mr-4 mt-3"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ID Fornecedor</th>
                                    <th>Nome do fornecedor</th>
                                    <th>Nome do produto</th>
                                    <th>Imagem do produto</th>
                                    <th>Descrição</th>
                                    <th>Preço</th>
                                    <th>Quantidade disponível</th>
                                </tr>
                            </thead>
                            <tbody id="products">
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `

        $.get( "/product", product => {
            for (let i = 0; i < product.length; i++) {
                let { productId, name, image, description, price, amount, supplierId, supplier } = product[i]

                $( "#products" )[0].innerHTML += `
                    <tr class="product-row">
                        <td class="productId">${productId}</td>
                        <td>${supplierId}</td>
                        <td>${supplier.name}</td>
                        <td>${name}</td>
                        <td><img src="${image}" width='50'></td>
                        <td>${description}</td>
                        <td>${price.toLocaleString('pt-BR',{style: 'currency', currency:'BRL'})}</td>
                        <td>${amount}</td>
                        <td><button class="btn btn-primary update-product" id="${i}"><i class="far fa-edit"></i></button></td>
                        <td><button class="btn btn-danger delete-product" id="${productId}"><i class="fas fa-times"></i></button></td>
                        <td class="d-none"><button class="btn btn-success save-update-supplier" id="${i}"><i class="far fa-save" disabled></i></button></td>
                        <td class="d-none"><button class="btn btn-danger cancel-update-supplier" id="${i}"><i class="fas fa-times"></i></button></td>
                    </tr>
                `
            }
        })

        this.addEventProduct();
    }

    private addEventProduct(): void {
        $( "#add-product" ).click(_ => {
            $( "#products" )[0].insertAdjacentHTML('beforeend', `
                <tr id="new-product">
                    <td>-</td>
                    <td>-</td>
                    <td>
                        <select class="form-control" id="suppliers-list">
                        </select>
                    </td>
                    <td><input type="text" class="form-control register-product" id="product-name" placeholder="Nome do produto"></td>
                    <td><input type="file" class="form-control-file register-product" id="product-image"></td>
                    <td><input type="text" class="form-control register-product" id="product-description" placeholder="Descrição"></td>
                    <td><input type="text" class="form-control register-product" id="product-price" placeholder="Preço"></td>
                    <td><input type="text" class="form-control register-product" id="amount-available" placeholder="Quantidade disponível"></td>
                    <td><button id="register-product" class="btn btn-success m-2" disabled><i class="fas fa-check"></i></button></td>
                    <td><button id="cancel-register-product" class="btn btn-danger m-2"><i class="fas fa-times"></i></button></td>
                </tr>
            `)

            for (let { supplierId, name } of this.suppliersList) {
                $( "#suppliers-list" )[0].innerHTML += `<option id="${supplierId}">${name}</option>`;
            }

            (<any>$( "#suppliers-list" )[0]).onclick = function() {
                fetch("https://localhost:5001/supplier").then(e => e.json()).then(data => {
                    const getId = data.filter((d: any) => d.name == this.value)
                    localStorage.setItem('supplierId', getId[0].supplierId)
                })
            }

            $( "input" ).each((_, e) => {
                e.oninput = _ => {
                    const inputValues = [...document.getElementsByClassName('register-product')].map((e: HTMLInputElement) => e.value);
                    const emptyInput: boolean = inputValues.includes('') ? false : true;
                    
                    if (emptyInput) {
                        $( "#register-product" ).removeAttr( "disabled" )
                    } else {
                        $( "#register-product" ).attr( "disabled" , "disabled" );
                    }
                }
            })

            $( "#add-product" ).attr( "disabled" , "disabled" );

            $( "#cancel-register-product" ).click(_ => {
                $( "#new-product" ).remove();
                $( "#add-product" ).removeAttr( "disabled" );
            })
            
            let base64image: any[] = [];

            $( "#product-image" )[0].onchange = function() {
                    const file = (<HTMLInputElement>document.getElementById('product-image')).files[0];
                    const reader = new FileReader();
                    reader.onload = _ => {
                        base64image.push(reader.result);
                    };
                    reader.readAsDataURL(file);
            }

            $( "#register-product" ).click(function() {
                const nameProduct        = (<HTMLInputElement>$( "#product-name" )[0]).value;
                const imageProduct       = base64image[0];
                const productDescription = (<HTMLInputElement>$( "#product-description" )[0]).value;
                const productPrice       = (<HTMLInputElement>$( "#product-price" )[0]).value;
                const productAmount      = (<HTMLInputElement>$( "#amount-available" )[0]).value;
                
                const product = {
                    name       : nameProduct,
                    image      : imageProduct,
                    description: productDescription,
                    price      : Number(productPrice),
                    amount     : Number(productAmount),
                    supplierId : Number(localStorage.getItem('supplierId'))
                };
                
                const { name, image, description, price, amount } = product;

                Array.from($( "#suppliers-list" )[0].getElementsByTagName('option')).forEach(e => {
                    e.onclick = function() {
                        (<any>product).supplierId = Number((<any>this).id)
                        console.log(Number((<any>this).id));
                    }
                })

                if (name && image && description && price && amount) {
                    $.ajax({
                        type: "POST",
                        url: "/product",
                        contentType: 'application/json; charset=utf-8',
                        success: function() {
                            console.log('enviado com sucesso!');
                            localStorage.removeItem('supplierId');
                            location.reload();
                        },
                        data: JSON.stringify(product)
                    });
                }
            })
        })

        setTimeout(() => {
            $( ".delete-product" ).click(function() {
                $.ajax({
                    type: "DELETE",
                    url: `/product/${this.id}`,
                    success: function() {
                        console.log('enviado com sucesso!');
                        location.reload();
                    },
                });
            })

            const globalScope = this;

            const base64image: any[] = [];

            $( ".update-product" ).click(function() {
                $( "#add-product" ).attr( "disabled" , "disabled" );
                $( ".update-product" ).attr( "disabled", "disabled" )

                const element = document.getElementsByClassName('product-row')[Number(this.id)]
                
                const getElementFactory = (tagName: string) => element.querySelectorAll(tagName)
                
                const productId                 = (<HTMLElement>getElementFactory('td')[0]).innerText
                const supplierName              = (<HTMLElement>getElementFactory('td')[2]).innerText
                const productName               = (<HTMLElement>getElementFactory('td')[3]).innerText
                const productImage              = base64image[0];
                const productDescription        = (<HTMLElement>getElementFactory('td')[5]).innerText
                const productPrice              = (<HTMLElement>getElementFactory('td')[6]).innerText
                const productAmount             = (<HTMLElement>getElementFactory('td')[7]).innerText

                $( ".product-row" )[Number(this.id)].innerHTML = `
                    <td>-</td>
                    <td>-</td>
                    <td>
                        <select class="form-control" id="suppliers-list">
                        </select>
                    </td>
                    <td><input type="text" class="form-control update-product-input" id="product-name" value="${productName}" placeholder="Nome do produto"></td>
                    <td><input type="file" class="form-control-file update-product-input" id="product-image"></td>
                    <td><input type="text" class="form-control update-product-input" id="product-description" value="${productDescription}" placeholder="Descrição"></td>
                    <td><input type="text" class="form-control update-product-input" id="product-price" value="${productPrice.replace(/[^0-9.-]+/g, "")}" placeholder="Preço"></td>
                    <td><input type="text" class="form-control update-product-input" id="amount-available" value="${productAmount}" placeholder="Quantidade disponível"></td>
                    <td><button id="update-product" class="btn btn-success m-2" disabled><i class="fas fa-check"></i></button></td>
                    <td><button id="cancel-update-product" class="btn btn-danger m-2"><i class="fas fa-times"></i></button></td>
                `

                $( "#product-image" )[0].onchange = function() {
                    const file = (<HTMLInputElement>document.getElementById('product-image')).files[0];
                    const reader = new FileReader();
                    reader.onload = _ => {
                        base64image.push(reader.result);
                    };
                    reader.readAsDataURL(file);
                }

                for (let { supplierId, name } of globalScope.suppliersList) {
                    $( "#suppliers-list" )[0].innerHTML += `<option id="${supplierId}">${name}</option>`;
                }
    
                $( "input" ).each((_, e) => {
                    e.oninput = _ => {
                        const inputValues = [...document.getElementsByClassName('update-product-input')].map((e: HTMLInputElement) => e.value);
                        const emptyInput: boolean = inputValues.includes('') ? false : true;
                        
                        if (emptyInput) {
                            $( "#update-product" ).removeAttr( "disabled" )
                        } else {
                            $( "#update-product" ).attr( "disabled" , "disabled" );
                        }
                    }
                })

                const productUpdated = {
                    productId: Number(productId),
                    name: (<HTMLInputElement>$( ".update-product-input" )[0]).value,
                    description: (<HTMLInputElement>$( ".update-product-input" )[2]).value,
                    price: Number((<HTMLInputElement>$( ".update-product-input" )[3]).value),
                    amount: Number((<HTMLInputElement>$( ".update-product-input" )[4]).value),
                    supplierId: 1
                }
                
                Array.from($( "#suppliers-list" )[0].getElementsByTagName('option')).forEach(e => {
                    e.onclick = function() {
                        (<any>productUpdated).supplierId = Number((<any>this).id)
                        console.log(Number((<any>this).id));
                    }
                })
                
                $( "#update-product" ).click(() => {
                    (<any>productUpdated).image = base64image[0];
                    productUpdated.productId = Number(productId)
                    productUpdated.name = (<HTMLInputElement>$( ".update-product-input" )[0]).value
                    productUpdated.description = (<HTMLInputElement>$( ".update-product-input" )[2]).value
                    productUpdated.price = Number((<HTMLInputElement>$( ".update-product-input" )[3]).value)
                    productUpdated.amount = Number((<HTMLInputElement>$( ".update-product-input" )[4]).value)

                    $.ajax({
                        type: "PUT",
                        url: `/product/${productUpdated.productId}`,
                        contentType: 'application/json; charset=utf-8',
                        success: function() {
                            console.log('enviado com sucesso!');
                            location.reload();
                        },
                        data: JSON.stringify(productUpdated)
                    });
                })

                $( "#cancel-update-product" ).click(function() {
                    location.reload();
                })
            })
        }, 2000)
    }

    private addEventSupplier(): void {
        $( "#add-supplier" ).click(_ => {
            $( "#suppliers" )[0].insertAdjacentHTML('beforeend', `
                <tr id="new-supplier">
                    <td>-</td>
                    <td><input type="text" class="form-control register-supplier" id="nome-supplier" placeholder="nome"></td>
                    <td><input type="text" class="form-control register-supplier" maxlength="18" id="cnpj-supplier" placeholder="CNPJ"></td>
                    <td><input type="text" class="form-control register-supplier" id="address-supplier" placeholder="endereço"></td>
                    <td><input type="text" class="form-control register-supplier" id="city-supplier" placeholder="cidade"></td>
                    <td><input type="text" class="form-control register-supplier" maxlength="2" id="state-supplier" placeholder="estado"></td>
                    <td><input type="text" class="form-control register-supplier" maxlength="13" id="phone-supplier" placeholder="telefone"></td>
                    <td><button id="register-supplier" class="btn btn-success m-2" disabled><i class="fas fa-check"></i></button></td>
                    <td><button id="cancel-register" class="btn btn-danger m-2"><i class="fas fa-times"></i></button></td>
                </tr>
            `)

            $( "input" ).each((_, e) => {
                e.oninput = _ => {
                    const inputValues = [...document.getElementsByClassName('register-supplier')].map((e: HTMLInputElement) => e.value);
                    const emptyInput: boolean = inputValues.includes('') ? false : true;

                    (<any>$( "#cnpj-supplier" )[0]).value  = (<any>$( "#cnpj-supplier" )[0]).value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
                    (<any>$( "#phone-supplier" )[0]).value = (<any>$( "#phone-supplier" )[0]).value.replace(/(\d{2})(\d{5})(\d{4})/, "$1 $2-$3");
                    (<any>$( "#state-supplier" )[0]).value = (<any>$( "#state-supplier" )[0]).value.toUpperCase();

                    if (emptyInput) {
                        $( "#register-supplier" ).removeAttr( "disabled" );
                    } else {
                        $( "#register-supplier" ).attr( "disabled" , "disabled" );
                    }
                }
            })

            $( "#add-supplier" ).attr( "disabled" , "disabled" );

            $( "#cancel-register" ).click(_ => {
                $( "#new-supplier" ).remove();
                $( "#add-supplier" ).removeAttr( "disabled" );
            })

            this.registerSupplier();
        })

        $( ".update-supplier" ).click(function() {
            const element = document.getElementsByClassName('supplier-row')[Number(this.id)]
            
            const getElementFactory = (tagName: string) => element.getElementsByTagName(tagName)
            const inputFactory = (inputValue: string) => `<input type="text" value="${inputValue}" class="form-control update-supplier" placeholder="Nome">`;

            const supplierId                    = getElementFactory('td')[0];
            const name                          = getElementFactory('td')[1];
            const cnpj                          = getElementFactory('td')[2];
            const address                       = getElementFactory('td')[3];
            const city                          = getElementFactory('td')[4];
            const state                         = getElementFactory('td')[5];
            const phone                         = getElementFactory('td')[6];
            const updateSupplierButtonRow       = getElementFactory('td')[7];
            const deleteSupplierButtonRow       = getElementFactory('td')[8];
            const saveUpdateSupplierButtonRow   = getElementFactory('td')[9];
            const cancelUpdateSupplierButtonRow = getElementFactory('td')[10]; 
            const updateSupplierButton          = updateSupplierButtonRow.getElementsByTagName('button')[0];
            const deleteSupplierButton          = deleteSupplierButtonRow.getElementsByTagName('button')[0];
            const saveUpdateSupplierButton      = saveUpdateSupplierButtonRow.getElementsByTagName('button')[0];
            const cancelUpdateSupplierButton    = cancelUpdateSupplierButtonRow.getElementsByTagName('button')[0];

            name.innerHTML    = inputFactory((<HTMLElement>name).innerText);
            cnpj.innerHTML    = inputFactory((<HTMLElement>cnpj).innerText);
            address.innerHTML = inputFactory((<HTMLElement>address).innerText);
            city.innerHTML    = inputFactory((<HTMLElement>city).innerText);
            state.innerHTML   = inputFactory((<HTMLElement>state).innerText);
            phone.innerHTML   = inputFactory((<HTMLElement>phone).innerText);

            const nameInput    = getElementFactory('input')[0];
            const cnpjInput    = getElementFactory('input')[1];
            const addressInput = getElementFactory('input')[2];
            const cityInput    = getElementFactory('input')[3]; 
            const stateInput   = getElementFactory('input')[4];
            const phoneInput   = getElementFactory('input')[5];

            const supplierUpdated = {
                supplierId: (<HTMLElement>supplierId).innerText,
                name      : (<HTMLInputElement>nameInput).value,
                cnpj      : (<HTMLInputElement>cnpjInput).value,
                address   : (<HTMLInputElement>addressInput).value,
                city      : (<HTMLInputElement>cityInput).value,
                state     : (<HTMLInputElement>stateInput).value,
                phone     : (<HTMLInputElement>phoneInput).value
            }

            updateSupplierButtonRow.classList.add('d-none');
            deleteSupplierButtonRow.classList.add('d-none');
            saveUpdateSupplierButtonRow.classList.remove('d-none');
            cancelUpdateSupplierButtonRow.classList.remove('d-none');
            
            (<HTMLElement>cancelUpdateSupplierButton).onclick = _ => location.reload();
            (<HTMLElement>cnpjInput).addEventListener('input', function() {
                (<any>this).value = (<any>this).value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
                (<any>this).maxLength = '18';
            });
            (<HTMLElement>stateInput).addEventListener('input', function() {
                (<any>this).value = (<any>this).value.toUpperCase();
                (<any>this).maxLength = '2';
            });
            (<HTMLElement>phoneInput).addEventListener('input', function() {
                (<any>this).value = (<any>this).value.replace(/(\d{2})(\d{5})(\d{4})/, "$1 $2-$3");
                (<any>this).maxLength = '13';
            });

            [...element.getElementsByTagName('input')].forEach(e => {
                e.oninput = _ => {
                    const inputValues: string[] = [...document.getElementsByTagName('input')].map(e => e.value);
                    const validate   : boolean  = (/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/).test((<HTMLInputElement>cnpjInput).value) && (/^\d{2}\ \d{5}\-\d{4}$/).test((<HTMLInputElement>phoneInput).value)
                    const emptyInput : boolean  = inputValues.includes('') ? false : true;

                    if (emptyInput && validate) saveUpdateSupplierButton.removeAttribute('disabled');
                    else saveUpdateSupplierButton.setAttribute('disabled', 'disabled');
                }
            });

            $( ".delete-supplier" ).each((_, e) => e.setAttribute('disabled', 'disabled'));
            [...document.getElementsByClassName('btn-primary')].forEach(e => e.setAttribute('disabled', 'disabled'));

            saveUpdateSupplierButton.onclick = _ => {
                supplierUpdated.name    = (<HTMLInputElement>nameInput).value;
                supplierUpdated.cnpj    = (<HTMLInputElement>cnpjInput).value;
                supplierUpdated.address = (<HTMLInputElement>addressInput).value;
                supplierUpdated.city    = (<HTMLInputElement>cityInput).value;
                supplierUpdated.state   = (<HTMLInputElement>stateInput).value
                supplierUpdated.phone   = (<HTMLInputElement>phoneInput).value

                $.ajax({
                    type: "PUT",
                    url: `/supplier/${supplierUpdated.supplierId}`,
                    contentType: 'application/json; charset=utf-8',
                    success: function() {
                        console.log('enviado com sucesso!');
                        location.reload();
                    },
                    data: JSON.stringify(supplierUpdated)
                });
            }
        })

        $( ".delete-supplier" ).click(function() {
            const element = document.getElementsByClassName('supplier-row')[Number(this.id)]
            const idSupplier = Number((<any>element).getElementsByClassName('suplierId')[0]['innerText']);
            
            document.getElementsByClassName('supplier-row')[Number(this.id)].remove();

            $.ajax({
                type: "DELETE",
                url: `/supplier/${idSupplier}`,
                success: function() {
                    console.log('enviado com sucesso!');
                    location.reload();
                },
            });
        })
    }

    private registerSupplier(): void {
        $( "#register-supplier" ).click(function() {
            const nameSupplier    = (<HTMLInputElement>$( "#nome-supplier" )[0]).value;
            const cnpjSupplier    = (<HTMLInputElement>$( "#cnpj-supplier" )[0]).value;
            const addressSupplier = (<HTMLInputElement>$( "#address-supplier" )[0]).value;
            const citySupplier    = (<HTMLInputElement>$( "#city-supplier" )[0]).value;
            const stateSupplier   = (<HTMLInputElement>$( "#state-supplier" )[0]).value;
            const phoneSupplier   = (<HTMLInputElement>$( "#phone-supplier" )[0]).value;
    
            const supplier = {
                name   : nameSupplier,
                cnpj   : cnpjSupplier,
                address: addressSupplier,
                city   : citySupplier,
                state  : stateSupplier,
                phone  : phoneSupplier
            };
            
            const { name, cnpj, address, city, state, phone } = supplier;

            if (name  && cnpj  && address  && city  && state  && phone) {
                $.ajax({
                    type: "POST",
                    url: "/supplier",
                    contentType: 'application/json; charset=utf-8',
                    success: function() {
                        console.log('enviado com sucesso!');
                        location.reload();
                    },
                    data: JSON.stringify(supplier)
                });
            }
        })
    }

    private addEventsUser(): void {
        $( "#add-user" ).click(_ => {
            $( "#users" )[0].insertAdjacentHTML('beforeend', `
                <tr id="new-user">
                    <td>-</td>
                    <td>
                        <input type="text" class="form-control register" id="nome" placeholder="Nome">
                        <input type="text" class="form-control register mt-3" id="sobrenome" placeholder="Sobrenome">
                    </td>
                    <td><input type="text" class="form-control register" id="usuario" placeholder="Usuário"></td>
                    <td>
                        <input type="text" class="form-control register" id="email" placeholder="E-Mail">
                        <input type="password" class="form-control mt-3 register" id="senha" placeholder="Password">
                    </td>
                    <td><button id="register-user" class="btn btn-success m-2" disabled><i class="fas fa-check"></i></button></td>
                    <td><button id="cancel-register" style="margin-right: 70px;" class="btn btn-danger m-2"><i class="fas fa-times"></i></button></td>
                </tr>
            `)

            $( "input" ).each((_, e) => {
                e.oninput = _ => {
                    const inputValues: string[] = [...document.getElementsByClassName('register')].map((e: HTMLInputElement) => e.value);
                    const emptyInput : boolean  = inputValues.includes('') ? false : true;
                    const validate   : boolean  = (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test((<HTMLInputElement>$( "#email" )[0]).value);

                    console.log('validate: ',{ emptyInput, validate });

                    if (emptyInput && validate) {
                        $( "#register-user" ).removeAttr("disabled");
                    } else {
                        $( "#register-user" ).attr("disabled", "disabled");
                    }
                }
            })
            this.registerUser();
            
            $( "#add-user" ).attr("disabled", "disabled");
            $( "#register-user" ).click(_ => $( "#add-user" ).removeClass("disabled"));

            $( "#cancel-register" ).click(() => {
                $( "#new-user" ).remove();
                $( "#add-user" ).removeAttr("disabled");
            })
        })
        
        $( ".delete-user" ).click(function() {
            const element: Element = document.getElementsByClassName('user-row')[Number(this.id)];
            const idUser : any = document.getElementsByClassName('userId')[Number(this.id)].innerHTML;
            element.remove();
            
            $.ajax({
                type: "DELETE",
                url: `/user/${idUser}`,
                success: function() {
                    console.log('enviado com sucesso!');
                },
            });
        })
    }

    private registerUser(): void {
        $( "#register-user" ).click(function() {
            const nome    = (<HTMLInputElement>$( "#nome" )[0]).value + ' ' + (<HTMLInputElement>$( "#sobrenome" )[0]).value;
            const usuario = (<HTMLInputElement>$( "#usuario" )[0]).value;
            const email   = (<HTMLInputElement>$( "#email" )[0]).value;
            const senha   = (<HTMLInputElement>$( "#senha" )[0]).value ;

            if (nome  && usuario  && email  && senha ) {
                const user = {
                    name: nome,
                    username: usuario,
                    email: email,
                    password: senha
                }
                
                $.ajax({
                    type: "POST",
                    url: "/user",
                    contentType: 'application/json; charset=utf-8',
                    success: function() {
                        console.log('enviado com sucesso!');
                        location.reload();
                    },
                    data: JSON.stringify(user)
                });
            }
        })
    }
}

const adminPanel: AdminPanel = new AdminPanel();