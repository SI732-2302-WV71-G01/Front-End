import { createRouter, createWebHistory } from 'vue-router'
import home from '../learning/pages/home.component.vue'
const router = createRouter(
    {
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            {
                path: '/home',
                name: 'home',
                component: home,
            },
            {
                path: '/',
                redirect: 'home'
            },
            {
                path: '/sign-in',
                name: 'sign-in',
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('../learning/pages/sign-in.component.vue')
            },
            {
                path: '/sign-up',
                name: 'sign-up',
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('../learning/pages/sign-up.component.vue')
            },
            {
                path: '/my-stores',
                name: 'my-stores',
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('../learning/pages/my-stores.component.vue')
            },
            {
                path: '/stores',
                name: 'stores',
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('../learning/pages/stores.component.vue')
            },
            {
                path: '/resources',
                name: 'resources',
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('../learning/pages/resources.component.vue')
            },
            {
                path: '/community',
                name: 'community',
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('../learning/pages/community.component.vue')
            },
            {
                path: '/stores/store',
                name: 'stores/store',
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('../learning/pages/store.component.vue')
            },
            {
                path: '/shopping-cart',
                name: 'shopping-cart',
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('../learning/pages/shopping-cart.component.vue')
            },
            {
                path: '/purchase',
                name: 'purchase',
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('../learning/pages/purchase.component.vue')
            },
            {
                path: '/my-purchases',
                name: 'my-purchases',
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('../learning/pages/my-purchases.component.vue')
            },
            {
                path: '/my-sales',
                name: 'my-sales',
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('../learning/pages/my-sales.component.vue')
            },
            {
                path: '/articles/article',
                name: 'articles/article',
                // route level code-splitting
                // this generates a separate chunk (About.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import('../learning/pages/article.component.vue')
            }

        ]
    }
)

export default router