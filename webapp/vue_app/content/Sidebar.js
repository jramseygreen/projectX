export default {
    template: `
        <div class="d-flex flex-column p-3 text-white bg-dark">
            <div class="row">
                <span class="col-9">
                    <a href="" class="d-flex mb-3 text-white text-decoration-none">
                        <img src="assets/logo_blue.png"
                             width="50" height="50">
                        <h3 class="text-center ms-2">OBF-4</h3>
                    </a>
                </span>
                <span class="col-3">
                    <button class="btn btn-sm float-end btn-danger rounded-pill" title="Stop osu bot framework">
                        <i class="fas fa-power-off" />
                    </button>
                </span>
            </div>
            <hr>
            <ul class="nav nav-pills flex-column mb-auto">
              <li class="nav-item">
                <a href="#" class="nav-link active" aria-current="page">
                  <svg class="bi me-2" width="16" height="16"><use xlink:href="#home"></use></svg>
                  Home
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white">
                  <svg class="bi me-2" width="16" height="16"><use xlink:href="#speedometer2"></use></svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white">
                  <svg class="bi me-2" width="16" height="16"><use xlink:href="#table"></use></svg>
                  Orders
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white">
                  <svg class="bi me-2" width="16" height="16"><use xlink:href="#grid"></use></svg>
                  Products
                </a>
              </li>
              <li>
                <a href="#" class="nav-link text-white">
                  <svg class="bi me-2" width="16" height="16"><use xlink:href="#people-circle"></use></svg>
                  Customers
                </a>
              </li>
            </ul>
            <hr>
            <div class="dropdown">
              <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://github.com/mdo.png" alt="" width="32" height="32" class="rounded-circle me-2">
                <strong>mdo</strong>
              </a>
              <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                <li><a class="dropdown-item" href="#">Settings</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" @click="signOut()">Sign out</a></li>
              </ul>
            </div>
        </div>
    `,
    inject: ['clearCookie'],
    methods: {
        signOut: function() {
            this.clearCookie("username")
            this.clearCookie("password")
            window.location.reload()

        }
    }

}