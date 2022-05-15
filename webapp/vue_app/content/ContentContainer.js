import Sidebar from './Sidebar.js'
import MainWindow from './MainWindow.js'

export default {
    template: `
    <div class="d-flex vh-100">
        <div class="row">
            <sidebar class="col-5" />
            <main-window class="col-7" />
        </div>
        </div>
    `,
    components: {
        Sidebar,
        MainWindow
    },
}