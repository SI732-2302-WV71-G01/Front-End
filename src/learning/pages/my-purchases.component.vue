<template>
    <div v-if="purchases.length > 0" v-for="purchase in purchases">
        <h1>Historial de compras:</h1>
        <pv-button icon="pi pi-trash"  class="p-button-danger" rounded
                   @click ="deletePurchase(purchase)"></pv-button>
        <h3>Nro de compra: {{purchase.code}}</h3>
        <h3>Store name: {{purchase.storeName}}</h3>
        <h3>Productos: </h3>

        <pv-data-view v-if="purchase.products.length > 0" :value="purchase.products" paginator :rows="5">
            <template #list="slotProps">
                <div class="col-12">

                    <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
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
                            <!-- ICONS -->
                            <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <span class="text-2xl font-semibold">${{ slotProps.data.price }}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </template>
        </pv-data-view>
    </div>
    <div v-else class="flex justify-content-center align-items-center h-30rem min-w-screen">
        <div class="flex flex-column justify-content-center h-20rem w-20rem p-3 shadow-1">
            <h2 class="inline-flex justify-content-center">No tienes compras aún</h2>
            <p class="inline-flex justify-content-center">
                Tenemos miles de ofertas y oportunidades únicas, ¿te las vas a perder?</p>
            <pv-button :label="'Ver Tiendas'.toUpperCase()" icon="pi pi-shopping-bag" class="p-button-icon"
                       @click=" this.storeGlobal.goingToMyStores = 'false'; this.$router.push('/my-stores');"/>
        </div>
    </div>
</template>

<script>
import {PurchasesApiService} from "@/learning/services/purchases-api.service";
import {storeGlobal} from "@/learning/store/store";
import {StoresApiService} from "@/learning/services/stores-api.service";
export default {
    data(){
        return{
            purchaseService: null,
            purchases: [],
            storeGlobal
        };
    },
    created() {
        this.purchaseService = new PurchasesApiService();
        this.storeService = new StoresApiService();
        this.purchaseService.getAllByUserId(this.storeGlobal.user.id).then((response) => {
            this.purchases = response.data;
            this.purchases.forEach(
                (purchase) => {
                    purchase.products.forEach(
                        (product) => {
                            this.storeService.getById(product.storeId).then((response) => {
                                console.log(response.data);
                                purchase.storeName = response.data.name;
                        });}
                    );
                }
            );
        })
    },
    methods:{
        getImageUrl(base64Image) {
            return `data:image/png;base64, ${base64Image}`;
        },
        deletePurchase(purchase){
            this.purchaseService.delete(purchase.id).then((response) => {
                this.purchases = this.purchases.filter(
                    (p) => p.id !== response.data.id
                );
                this.$toast.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Purchase Deleted from History",
                    life: 3000,
                });
            });
        }
    }
}
</script>

