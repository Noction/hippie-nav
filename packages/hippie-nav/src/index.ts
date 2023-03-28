import PrivateHippieNav from './HippieNav.vue'

export {
    PrivateHippieNav
}

export function install(app, options)  {
    app.component('HippieNav', PrivateHippieNav)
    console.log(options)
}

export default {
    install
}
