import * as $ from 'jquery';

export const verifyLogged = (target: any, key: string) => {
    target[key] = localStorage.getItem('username')
    if (target[key]) {
        $( "#signup" ).hide()
        $( "#login" ).hide()
        $( ".user-settings" ).show()
    } else {
        $( ".user-settings" ).hide()
    }
}