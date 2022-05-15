import Router from './Router.js'
import Crypt from './js/Crypt.js'

// root component
export default {
    template: `
        <router :currentRoute="currentRoute" :currentUrlParams="currentUrlParams"/>
    `,
    components: {
        Router
    },
    data() {
        return {
            crypt: new Crypt(),
            connection: null,
            host: window.location.hostname,
            port: '8081',
            store: {},
            authenticate: false,
            currentRoute: window.location.hash.substring(1),
            currentUrlParams: {}
        }
    },
    mounted() {
        this.connection = new WebSocket("ws://" + this.host + ":" + this.port)
        this.connection.onopen = this.wsOpened
        this.connection.onerror = this.wsError
        this.connection.onmessage = this.onMessage
        window.onhashchange = () => {
            console.log("hashchange")
            if (window.location.hash === "#") {
                window.location.hash = this.currentRoute
                return
            }
            if ("#" + this.currentRoute !== window.location.hash) {
                this.changeRoute(window.location.hash)
            }
        }
    },
    methods: {
        wsOpened: function() {
            this.send(JSON.stringify({
                command: "public_key",
                payload: {
                    "public_key": this.crypt.publicKey
                }
            }))
        },
        wsError: function(error) {
            console.log('WebSocket Error ' + error)
        },
        onMessage: function(e) {
            let message = e.data
            if (this.crypt.foreignPublicKey) {
                // decrypt
                message = this.crypt.decrypt(message)
            }
            console.log("received:\n", message)
            message = JSON.parse(message)

            let payload = message.payload
            switch(message.command) {
                case "authenticate":
                    if (payload.status) {
                        this.authenticate = true
                        this.changeRoute("/login")
                    } else {
                        this.authenticate = false
                        this.changeRoute("/")
                    }
                    break
                case "public_key":
                    this.crypt.foreignPublicKey = payload.public_key
                    this.send(JSON.stringify({
                        command: "login",
                        payload: {
                            username: this.getCookie("username"),
                            password: this.getCookie("password")
                        }
                    }))
                    break
            }

        },
        send: function(message) {
            console.log("sent:\n", message)
            if (this.crypt.foreignPublicKey) {
                // encrypt
                message = this.crypt.encrypt(message)
            }
            this.connection.send(message)
        },
        setCookie: function(name, value, days) {
            const d = new Date()
            d.setTime(d.getTime() + (days*24*60*60*1000))
            let expires = "expires="+ d.toUTCString()
            document.cookie = name + "=" + value + ";" + expires + ";path=/"
        },
        getCookie: function(cname) {
            let name = cname + "="
            let decodedCookie = decodeURIComponent(document.cookie)
            let ca = decodedCookie.split(';')
            for(let i = 0; i <ca.length; i++) {
                let c = ca[i]
                while (c.charAt(0) == ' ') {
                    c = c.substring(1)
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length)
                }
            }
            return ""
        },
        clearCookie: function(name) {
            document.cookie = name + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
        },
        changeRoute: function(route) {
            if (this.authenticate) {
                route = "/login"
            }
            let splitRoute = String(route).split("?")
            route = splitRoute[0].replace("#", "")
            if (!route) {
                route = "/"
            }
            window.location.hash = route
            this.currentRoute = route

            const urlParams = new URLSearchParams(splitRoute[1])
            this.currentUrlParams = Object.fromEntries(urlParams)
            console.log("route:", this.currentRoute, "params:", this.currentUrlParams)
        },

    },
    // exposed fields & methods
    provide() {
        return {
            // methods
            send: this.send,
            setCookie: this.setCookie,
            getCookie: this.getCookie,
            clearCookie: this.clearCookie,
            changeRoute: this.changeRoute,

            // variables
            currentUrlParams: this.currentUrlParams,
            store: this.store
        }
    }
}