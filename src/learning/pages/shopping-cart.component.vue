<template>
    <div v-if="storeGlobal.shoppingCart !== null && storeGlobal.shoppingCart.length > 0">
        <h1 class="pl-8">Carro</h1>
        <div class="flex flex-row w-14 justify-content-around">
            <pv-data-view class="w-6" v-if="storeGlobal.shoppingCart" :value="storeGlobal.shoppingCart" paginator :rows="5">
                <template #list="slotProps">
                    <div class="col-12">

                        <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 shadow-1">
                            <img class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                                 :src="getImageUrl(slotProps.data.image)"  />

                            <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                    <div class="text-2xl font-bold text-900">{{ slotProps.data.name }}</div>
                                    <pv-rating :modelValue="slotProps.data.rating" readonly :cancel="false"></pv-rating>
                                    <div class="flex align-items-center gap-3">
                                    <span class="flex align-items-center gap-2">
                                        <i class="pi pi-tag"></i>
                                        <span class="font-semibold">{{ slotProps.data.category }}</span>
                                    </span>
                                    </div>
                                </div>

                                <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                    <span class="text-2xl font-semibold">${{ slotProps.data.price }}</span>
                                    <pv-button icon="pi pi-trash"  class="p-button-danger" rounded
                                               @click ="deleteProduct(slotProps.data);"></pv-button>
                                </div>
                            </div>
                        </div>

                    </div>
                </template>
            </pv-data-view>
            <div class="flex flex-column justify-content-start shadow-1 p-4">
                <h2>Resumen de la orden</h2>
                <div class="w-30rem">
                    <div class="flex justify-content-between">
                        <h3>Productos</h3>
                        <h3>{{storeGlobal.shoppingCart.length}}</h3>
                    </div>
                    <div class="flex justify-content-between">
                        <h3>Total</h3>
                        <h3>$  {{totalPrice}}</h3>
                    </div>
                </div>

                <pv-button :label="'Comprar'.toUpperCase()" icon="pi pi-shopping-bag" class="p-button-icon"
                           @click="goToPurchase()"/>
            </div>
        </div>
    </div>
    <div v-else class="flex justify-content-center align-items-center h-30rem min-w-screen">
        <div class="flex flex-column justify-content-center h-20rem w-20rem p-3 shadow-1">
            <h2 class="inline-flex justify-content-center">Tu carro está vacío</h2>
            <p class="inline-flex justify-content-center">
                Tenemos miles de ofertas y oportunidades únicas, ¿te las vas a perder?</p>
            <pv-button :label="'Ver Tiendas'.toUpperCase()" icon="pi pi-shopping-bag" class="p-button-icon"
                       @click="goToStores"/>

        </div>

    </div>


</template>

<script>
import { storeGlobal } from '../store/store'
export default {
    data(){
        return {
            storeGlobal,
            products: [],
            totalPrice: null,
        };
    },
    created(){
        if(storeGlobal.shoppingCart){
            this.storeGlobal.shoppingCart.forEach(
                (p) => {this.totalPrice = this.totalPrice + p.price;}
            );
        }

    },
    methods:{
        goToStores(){
            this.$router.push('/my-stores').then(() => {
                window.location.reload();
            });
            localStorage.setItem('MyStores','false')
            this.storeGlobal.goingToMyStores = localStorage.getItem('MyStores')
        },
        getImageUrl(base64Image) {
            return `data:image/png;base64, ${base64Image}`;
        },
        deleteProduct(product){
            const indexToRemove = this.storeGlobal.shoppingCart.indexOf(product);
            this.storeGlobal.shoppingCart.splice(indexToRemove, 1);
            localStorage.setItem('ShoppingCart', JSON.stringify(this.storeGlobal.shoppingCart));
            this.$toast.add({
                severity: "success",
                summary: "Successful",
                detail: "Product Removed from the Cart",
                life: 3000,
            });
            console.log("Cart Lenght")
            console.log(this.storeGlobal.shoppingCart.length);
        },
        goToPurchase(){
            if(this.storeGlobal.user.id){
                this.$router.push('/purchase')
            }
            else{
                this.$router.push('/sign-in')
            }
        }
    }
}
</script>
