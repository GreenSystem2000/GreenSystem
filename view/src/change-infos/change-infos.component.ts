import * as $ from 'jquery';
import './change-infos.component.css'

class ChangeInfos {
    userInfo = {};

    constructor() {
        this.holdUserFields();
    }
    
    private holdUserFields(): void {
        const userId: number = Number(localStorage.getItem('userId'));

        $.get( `/user/${userId}`, user => {
            this.userInfo = user;
            const name: any = user.name.split(' ');
            
            $( "#nome" ).val(name[0]);
            $( "#sobrenome" ).val(name[1]);
            $( "#usuario" ).val(user.username);
            $( "#email" ).val(user.email);
        });

        this.addEvents();
    }

    private addEvents(): void {
        $( "input" ).each((_, e) => {
            e.oninput = _ => {
                const inputValues: string[] = [...document.getElementsByClassName('user-input')].map(e => (<HTMLInputElement>e).value);
                const emptyInput : boolean  = inputValues.includes('') ? false : true;
                const validate   : boolean = (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test((<HTMLInputElement>document.getElementById('email')).value)
                
                if (emptyInput && validate) {  
                    $( ".btn-success" ).removeAttr('disabled') 
                } else { 
                    $( ".btn-success" )[0].setAttribute('disabled', 'disabled')
                }
            }
        })

        this.updateInfos();
    }
    
    private updateInfos() {
        $( ".btn-success" ).click(() => {
            const getElementByIdFactory = (id: string) => (<HTMLInputElement>document.getElementById(id)).value;

            const userUpdated = {
                userId: Number(localStorage.getItem('userId')),
                name: getElementByIdFactory('nome') + ' ' + getElementByIdFactory('sobrenome'),
                username: getElementByIdFactory('usuario'),
                email: getElementByIdFactory('email')
            }

            if (getElementByIdFactory('nova-senha') === '') {
                (<any>userUpdated).password = (<any>this.userInfo).password;
            } else {
                 (<any>userUpdated).password = getElementByIdFactory('nova-senha');
            }

            if (getElementByIdFactory('senha') === (<any>this.userInfo).password) {
                $( ".alert-danger" ).addClass('d-none');

                $.ajax({
                    type: "PUT",
                    url: `/user/${userUpdated.userId}`,
                    contentType: 'application/json; charset=utf-8',
                    success: function() {
                        console.log('enviado com sucesso!');
                        localStorage.setItem('username', getElementByIdFactory('usuario'))
                        location.href = '/';
                    },
                    data: JSON.stringify(userUpdated)
                });
            } else {
                $( ".alert-danger" ).removeClass('d-none');
            }
        })
    }
}

const changeInfos: ChangeInfos = new ChangeInfos();