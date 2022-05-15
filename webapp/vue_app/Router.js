import Login from './Login.js'
import ContentContainer from './content/ContentContainer.js'

export default {
    template: `
        <component :is="routedComponent" :urlParams="currentUrlParams"></component>
    `,
    inject: ['changeRoute'],
    data() {
        return {
            routes: {
                "/": ContentContainer,
                "/login": Login,
            },
        }
    },
    props: {
        currentRoute: String,
        currentUrlParams: Object
    },
    computed: {
        routedComponent: function() {
            return this.routes[this.currentRoute];
        }
    },
}