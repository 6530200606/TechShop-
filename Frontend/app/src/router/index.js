import { createRouter, createWebHistory } from "vue-router"
import TheHome from '../components/TheHome.vue'
import PageProduct from '../components/PageProduct.vue'
import TheLogin from '../components/TheLogin.vue'
import TheRegister from '../components/TheRegister.vue'
import PageMember from '../components/PageMember.vue'
import ProductShow from '../components/ProductShow.vue'
import CartShow from '../components/CartShow.vue'
import PurchaseHist from '../components/PurchaseHist.vue'
import PurchaseDetail from '../components/PurchaseDetail.vue'
import ManageInfo from '../components/ManageInfo.vue';
import ManageAddress from '../components/ManageAddress.vue';
import AdminLogin from '../components/AdminLogin.vue';
import OrderList from '../components/OrderList.vue';
import OrderDetail from '../components/OrderDetail.vue';
import ProductList from '../components/ProductList.vue';
import EmployeeList from '../components/employeeList.vue';
import error from '../components/error.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: TheHome
    },
    {
        path: '/products',
        name: 'PageProduct',
        component: PageProduct
    },
    {
        path: '/login',
        name: 'Login',
        component: TheLogin
    },
    {
        path: '/register',
        name: 'TheRegister',
        component: TheRegister
    },
    {
        path: '/pagemember',
        name: 'PageMember',
        component: PageMember
    },
    {
        path: '/ProductShow/:pdId',
        name: 'ProductShow',
        component: ProductShow
    },
    {
        path: '/CartShow/:cartId',
        name: 'CartShow',
        component: CartShow
    },
    {
        path: '/History',
        name: 'PurchaseHist',
        component: PurchaseHist
    },
    {
        path: '/PurchaseDtl/:orderId',
        name: 'PurchaseDetail',
        component: PurchaseDetail
    },
    {
        path: '/manage-info',
        name: 'ManageInfo',
        component: ManageInfo,
    },
    {
        path: '/manage-address',
        name: 'ManageAddress',
        component: ManageAddress,
    },
    {
        path: '/adminLogin',
        name: 'AdminLogin',
        component: AdminLogin
    },
    {
        path: '/orderlist',
        name: 'OrderList',
        component: OrderList
    },
    {
        path: '/orderdetail/:orderId',
        name: 'OrderDetail',
        component: OrderDetail
    },
    {
        path: '/productlist',
        name: 'ProductList',
        component: ProductList
    },
    {
        path: '/employeeList',
        name: 'employeeList',
        component: EmployeeList
    },
    {
        path: '/error',
        name: 'errorPage',
        component: error
    }
]
const router = createRouter({
    history: createWebHistory(process.env.BASE_URL), routes
})
export default router