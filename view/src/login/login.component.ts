import * as $ from 'jquery';
import './login.component.css'

class Login {
    constructor() {
        this.addEvents();
        this.checkLogin();
    }

    private addEvents() {
        $( "input" ).each((_, e) => {
            e.oninput = _ => {
                const inputValues = [...document.getElementsByTagName('input')].map(e => e.value);

                if (inputValues.includes('')) $( ".btn-primary" ).addClass("disabled");
                else $( ".btn-primary" ).removeClass("disabled");
            }
        })
    }

    private checkLogin(): void {
        $( '.alert-danger' ).hide()

        $( ".btn-primary" ).click(function() {
            const username = (<HTMLInputElement>$( "#username" )[0]).value;
            const password = (<HTMLInputElement>$( "#password" )[0]).value;
            
            $.get( "/user", users => {
                const validate = users.find((user: { username: string, password: string, userId: number }) => {
                    if (user.username == username && user.password == password) {
                        localStorage.setItem('userId', user.userId.toString())
                        return user.username == username && user.password == password
                    }
                })

                if (validate) {
                    localStorage.setItem('username', username)
                    if (localStorage.getItem('username') === 'admin') location.href = '../admin-panel';
                    else location.href = '../';
                } else {
                    $( '.alert-danger' ).show();
                }
            })
        })
    }
}

const login: Login = new Login();