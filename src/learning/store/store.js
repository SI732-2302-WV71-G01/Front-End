import { reactive } from 'vue'

export const storeGlobal = reactive({
    shoppingCart: JSON.parse(localStorage.getItem('ShoppingCart')),
    goingToMyArticles: localStorage.getItem('MyArticles'),
    goingToMyStores: localStorage.getItem('MyStores'),
    //user: {id: null, roleId:null, token:" "},
    user: JSON.parse(localStorage.getItem('User')),
    store : JSON.parse(localStorage.getItem('Store')),
    article : JSON.parse(localStorage.getItem('Article')),
    updateUser(user) {
        this.user = user;
    }

})