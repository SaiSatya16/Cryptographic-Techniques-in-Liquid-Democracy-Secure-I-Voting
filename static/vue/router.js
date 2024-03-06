import Home from './components/home.js';
import About from './components/about.js';
import Registration from './components/registration.js';
import Login from './components/login.js';


const routes = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/about',
        component: About,
    },
    {
        path: '/register',
        component: Registration,
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: "*",
        redirect: "/"
    }
];

const router = new VueRouter({
    routes,
});

export default router;