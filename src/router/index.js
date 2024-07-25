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
    const token = localStorage.getItem('token')
    const role = getRoleFromToken(token)

    console.log('ROLE : ' + role)
    
    if (isAuthenticated && to.name === 'Login') {
        if(role === 'ADMIN') {
            next({ name: 'DashboardAdmin' })
        } else {
            next({ name: 'Dashboard' })
        }
    } else if (isAuthenticated && to.name === 'DashboardAdmin' && role !== 'ADMIN') {
        next({ name: 'Dashboard' })
    } else if (isAuthenticated && to.name === 'Dashboard' && role === 'ADMIN') {
        next({ name: 'DashboardAdmin' })
    } else if (!isAuthenticated && !to.meta.public) {
        next({ name: 'Login' })
    } else {
        next();
    }
})

export default router 