import { createMemoryHistory, createRouter } from 'vue-router'

//import component
import Login from '../components/auth/Login.vue'
import Dashboard from '../components/Dashboard.vue'
import { createWebHistory } from 'vue-router'

const routes = [
    { 
        path: '/', 
        name: 'Login', 
        component: Login, 
        meta: {public: true}  //set page to public access
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {public:false}
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token')

    if(!to.meta.public && !isAuthenticated) {
        next({name: 'Login'})
    } 
    else if(to.meta.public && isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
        next({ name:'Dashboard'})
    } 
    else {
        next()
    }
})

export default router 