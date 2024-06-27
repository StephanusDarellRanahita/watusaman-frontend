import { createWebHistory, createRouter } from 'vue-router'

//import component
import Login from '../components/auth/Login.vue'
import LoginDana from '../components/auth/LoginDana.vue'
import VerifLogin from '../components/auth/VerifLogin.vue'
import Dashboard from '../components/Dashboard.vue'
import DashboardAdmin from '../components/DashboardAdmin.vue'

const routes = [
    { 
        path: '/', 
        name: 'Login', 
        component: Login, 
        meta: {public: true}  //set page to public access
    },
    {
        path: '/dana',
        name: 'LoginDana',
        component: LoginDana,
        meta: {public: true}
    },
    {   
        path: '/verifLogin',
        name: 'VerifLogin',
        component: VerifLogin,
        meta: {public: true}
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {public:false}
    },
    {
        path: '/dashboardAdmin',
        name: 'DashboardAdmin',
        component: DashboardAdmin,
        meta: {public:false}
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

function getRoleFromToken(token) {
    if(!token) return null
    const parts = token.split('|')
    return parts.length > 0 ? parts[0] : null
}

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token')
    const isAuthenticatedDana = !!localStorage.getItem('tokenDana')
    const token = localStorage.getItem('token')
    const role = getRoleFromToken(token)

    if(!to.meta.public && !isAuthenticated && from.name === 'Login' && role !== 'ADMIN') {
        next({name: 'Login'})
    } 
    else if(to.meta.public && isAuthenticated && from.name === 'Login' && role === 'ADMIN') {
        next({name: 'DashboardAdmin'})
    }
    else if(to.meta.public && isAuthenticated && (to.name === 'Login' && role === 'ADMIN')) {
        next({ name:'DashboardAdmin'})
    }
    else if(to.meta.public && isAuthenticated && (to.name === 'Login' && role !== 'ADMIN')) {
        next({ name:'Dashboard'})
    }
    else {
        next()
    }

    if(!to.meta.public && !isAuthenticatedDana && from.name === 'LoginDana') {
        console.log('here')
        next({name: 'LoginDana'})
    }else if(to.meta.public && isAuthenticatedDana && (to.name === 'LoginDana')) {
        next({ name:'DashboardDana' })
    }else {
        console.log('dana');
        next()
    }
})

export default router 