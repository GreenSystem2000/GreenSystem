import * as $ from 'jquery';
import './signup.component.css'

class Sigup {
    constructor() {
        this.addEvents();
        this.registerUser();
    }
    
    private addEvents(): void {
        $( "input" ).each((_, e) => {
            e.oninput = _ => {
                const inputValues: string[] = [...document.getElementsByTagName('input')].map(e => e.value);
                const emptyInput : boolean = inputValues.includes('') ? false : true;
                const validate   : boolean = (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test((<HTMLInputElement>$( "#email" )[0]).value);
                
                console.log('validate: ', emptyInput && validate);
                
                if (emptyInput && validate) $( ".btn-primary" ).removeClass("disabled");
                else $( ".btn-primary" ).addClass("disabled");
            }
        })
    }

    private registerUser(): void {
        $( ".btn-primary" ).click(function() {
            const nome    = (<HTMLInputElement>$( "#nome" )[0]).value + ' ' + (<HTMLInputElement>$( "#sobrenome" )[0]).value;
            const usuario = (<HTMLInputElement>$( "#usuario" )[0]).value;
            const email   = (<HTMLInputElement>$( "#email" )[0]).value;
            const senha   = (<HTMLInputElement>$( "#senha" )[0]).value ;

            if (nome !== '' && usuario !== '' && email !== '' && senha !== '') {
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
                        location.href = '../login';
                    },
                    data: JSON.stringify(user)
                });
            }
        })
    }
}

const sigup = new Sigup();