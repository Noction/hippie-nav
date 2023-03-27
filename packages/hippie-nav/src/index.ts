import PrivateHippieNav from './HippieNav.vue'

export {
    PrivateHippieNav
}

export function install(app)  {
    app.component('HippieNav', PrivateHippieNav)
}

export default {
    install
}