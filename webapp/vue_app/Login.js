export default {
    template: `
        <section class="vh-100" :style="bgStyle">
            <div class="container py-5 h-100">
                <div class="row d-flex justify-content-center align-items-center h-100">
                    <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div class="card bg-dark text-white" style="border-radius: 1rem;">
                            <div class="card-body p-5">
                                <div class="mb-md-5 mt-md-4 pb-5">
                                    <div class="text-center">
                                    <h2 class="fw-bold mb-2 text-uppercase">OBF-4 Login</h2>
                                    <p class="text-white-50 mb-5">Please enter your username and password!</p>
                                    </div>
                                    <form @submit.prevent="login">
                                        <div class="form-outline form-white mb-4">
                                            <label class="form-label" for="usernameInput">Username</label>
                                            <input v-model="username" type="text" id="usernameInput" class="form-control form-control-lg" />
                                        </div>
                                        <div class="form-outline form-white">
                                            <label class="form-label" for="passwordInput">Password</label>
                                            <input v-model="password" type="password" id="passwordInput" class="form-control form-control-lg" />
                                            <small class="text-danger fst-italic float-end mt-2" v-if="passwordError">
                                                <i class="fas fa-exclamation-triangle" />
                                                incorrect username or password!
                                            </small>
                                        </div>
                                        <div class="form-check mt-2">
                                            <input v-model="rememberMe" class="form-check-input" type="checkbox" id="rememberMeInput">
                                            remember me
                                        </div>
                                        <div class="text-center">
                                            <button class="btn btn-outline-light btn-lg px-5 mt-4" type="submit">Login</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,
    inject: ['send', 'setCookie'],
    data() {
        return {
            username: "",
            password: "",
            rememberMe: false,
            passwordError: false,
            bgStyle: {
                "background-image": "url('assets/login_background.jpg')",
                "background-position": "center",
                "background-repeat": "no-repeat",
                "background-size": "cover",
            }
        }
    },
    methods: {
        login: function() {
            if (this.rememberMe) {
                this.setCookie("username", this.username, 30)
                this.setCookie("password", this.password, 30)
            }

            let payload = {
                username: this.username,
                password: this.password
            }
            this.send(JSON.stringify({command: "login", payload: payload}))
            this.username = ""
            this.password = ""
            this.passwordError = true
        }
    },
}