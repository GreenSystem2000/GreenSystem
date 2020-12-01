import * as $ from 'jquery';

class PurchaseUser {
    constructor() {
        this.getPurchase();
    }

    private getPurchase(): void {
        $.get( "/purchaseInformations", data => {
            const purchases = data.filter((purchase: any) => purchase.username == localStorage.getItem('username'));
            
            $.each((purchases), (_, purchase) => {
                $( "#purchases" )[0].innerHTML += `
                    <tr>
                        <td>${purchase.purchaseInformationsId}</td>
                        <td>${purchase.product.name}</td>
                        <td>${purchase.product.price.toLocaleString('pt-BR',{style: 'currency', currency:'BRL'})}</td>
                    </td>
                `
            })

            if (purchases.length === 0) {
                $( "body" )[0].innerHTML = `
                <center>
                    <svg style="margin-top: 20%" width="5em" height="5em" viewBox="0 0 16 16" class="bi bi-exclamation-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                    </svg>
                    <h3 class="mt-4">Nenhum pedido foi efetuado!</h3>
                </center>
                `
            }
        } )
    }
}

const purchaseUser: PurchaseUser = new PurchaseUser();