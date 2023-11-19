<template>

    <div class="w-screen flex flex-column align-items-center">
        <div>
            <div class="field mt-3">
                <span class="p-float-label">
                    <pv-input-text type="text" id="FirstName" v-model.trim="registerRequest.streetAddress" required="true"
                                   autofocus :class="{ 'p-invalid': submitted && registerRequest.streetAddress==='' }"/>
                    <label for="FirstName">Street Address</label>
                    <small class="p-error" v-if="submitted && registerRequest.streetAddress===''">
                      Street Address is required.
                    </small>
                </span>
            </div>
            <div class="field mt-3">
                <span class="p-float-label">
                    <pv-input-text type="text" id="FirstName" v-model.trim="registerRequest.city" required="true"
                                   autofocus :class="{ 'p-invalid': submitted && registerRequest.city==='' }"/>
                    <label for="FirstName">City</label>
                    <small class="p-error" v-if="submitted && registerRequest.city===''">
                      City is required.
                    </small>
                </span>
            </div>
            <div class="field mt-3">
                <span class="p-float-label">
                    <pv-input-text type="text" id="FirstName" v-model.trim="registerRequest.postalCode" required="true"
                                   autofocus :class="{ 'p-invalid': submitted && registerRequest.postalCode==='' }"/>
                    <label for="FirstName">Postal Code</label>
                    <small class="p-error" v-if="submitted && registerRequest.postalCode===''">
                      Postal Code is required.
                    </small>
                </span>
            </div>
            <div class="field mt-3">
                <span class="p-float-label">
                    <pv-input-text type="text" id="FirstName" v-model.trim="registerRequest.cardNumber" required="true"
                                   autofocus :class="{ 'p-invalid': submitted && registerRequest.cardNumber==='' }"/>
                    <label for="FirstName">Card Number</label>
                    <small class="p-error" v-if="submitted && registerRequest.cardNumber===''">
                      Card Number is required.
                    </small>
                </span>
            </div>
            <div class="field mt-3">
                <span class="p-float-label">
                    <pv-dropdown type="text" id="Role" v-model="registerRequest.month" :options="months" optionLabel="name"
                                 optionValue="value"
                                 placeholder="Month" required="true"
                                 autofocus :class="{ 'p-invalid': submitted && registerRequest.month===-1 }"
                                 class="w-full md:w-5rem" />
                    <label for="Role">Month</label>
                    <small class="p-error" v-if="submitted && registerRequest.month===-1">
                          Month is required.
                    </small>
                </span>
            </div>
            <div class="field mt-3">
                <span class="p-float-label">
                    <pv-dropdown type="text" id="Role" v-model="registerRequest.year" :options="years" optionLabel="name"
                                 optionValue="value"
                                 placeholder="Year" required="true"
                                 autofocus :class="{ 'p-invalid': submitted && registerRequest.year===-1 }"
                                 class="w-full md:w-5rem" />
                    <label for="Role">Year</label>
                    <small class="p-error" v-if="submitted && registerRequest.year===-1">
                          Year is required.
                    </small>
                </span>
            </div>
            <div class="field mt-3">
                <span class="p-float-label">
                    <pv-input-text type="text" id="FirstName" v-model.trim="registerRequest.cardHolder" required="true"
                                   autofocus :class="{ 'p-invalid': submitted && registerRequest.cardHolder==='' }"/>
                    <label for="FirstName">Card Holder</label>
                    <small class="p-error" v-if="submitted && registerRequest.cardHolder===''">
                      Card Holder is required.
                    </small>
                </span>
            </div>
            <div class="field mt-3">
                <span class="p-float-label">
                    <pv-input-text type="text" id="FirstName" v-model.trim="registerRequest.sCode" required="true"
                                   autofocus :class="{ 'p-invalid': submitted && registerRequest.sCode==='' }"/>
                    <label for="FirstName">Security Code</label>
                    <small class="p-error" v-if="submitted && registerRequest.sCode===''">
                      Security Code is required.
                    </small>
                </span>
            </div>
            <pv-button :label="'Comprar'" icon="pi pi-shopping-bag" class="p-button-icon"
                       @click="submitted=true; purchase()"/>
        </div>
        <div>

        </div>
    </div>


</template>

<script>

import {PurchasesApiService} from "@/learning/services/purchases-api.service";
import {storeGlobal} from "@/learning/store/store";
import {SalesApiService} from "@/learning/services/sales-api.service";

export default {
    data(){
        return{
            purchaseService: null,
            registerRequest : {streetAddress: "", city: "", postalCode: "",cardNumber:"",cardHolder:"",
                sCode:"", month: -1, year: -1},
            submitted: false,
            months: [
                { name: '01', value: 1 },
                { name: '02', value: 2 },
                { name: '03', value: 3 },
                { name: '04', value: 4 },
                { name: '05', value: 5 },
                { name: '06', value: 6 },
                { name: '07', value: 7 },
                { name: '08', value: 8 },
                { name: '09', value: 9 },
                { name: '10', value: 10 },
                { name: '11', value: 11 },
                { name: '12', value: 12 },
            ],
            years: [
                { name: '23', value: 23 },
                { name: '24', value: 24 },
                { name: '25', value: 25 },
                { name: '26', value: 26 },
                { name: '27', value: 27 },
                { name: '28', value: 28 },
                { name: '29', value: 29 },
                { name: '30', value: 30 },
                { name: '31', value: 31 },
                { name: '32', value: 32 },
            ],
            storeGlobal

        };
    },
    created() {
        this.purchaseService = new PurchasesApiService();
        this.saleService = new SalesApiService();
    },


    methods: {
        purchase(){
            if(this.registerRequest.streetAddress !== "" && this.registerRequest.city !== "" &&
                this.registerRequest.postalCode !== "" && this.registerRequest.cardNumber !== "" &&
                this.registerRequest.cardHolder !== "" && this.registerRequest.sCode !== ""
                && this.registerRequest.year !== -1 && this.registerRequest.month !== -1)

            {
               /* const savePurchaseResource = {};
                const saveSaleResource = {};

                savePurchaseResource.code = this.generateRandomString();
                savePurchaseResource.userId = this.storeGlobal.user.id;

                saveSaleResource.code = savePurchaseResource.code;
                saveSaleResource.purchaserId = savePurchaseResource.userId;

                this.purchaseService.add(savePurchaseResource).then((response) => {
                    const productToPurchaseResource = {};
                    productToPurchaseResource.purchaseId = response.data.id;

                    this.storeGlobal.shoppingCart.forEach(
                        (p)=>{
                            productToPurchaseResource.productId = p.id;
                            console.log(productToPurchaseResource);
                            this.purchaseService.addProductToPurchase(productToPurchaseResource).then(
                                (response2) => {
                                    console.log(response);
                                    this.$router.push('/my-purchases');
                                    this.registerRequest = {};
                                }
                            );

                            saveSaleResource.storeId = p.storeId
                            this.saleService.add(saveSaleResource).then((response) => {

                            })

                        }
                    );

                });*/
                const savePurchaseResource = {};
                const saveSaleResource = {};
                const productToPurchaseResource = {};
                const productToSaleResource = {};

                this.storeGlobal.shoppingCart.forEach(
                    (p) => {
                        //Purchase
                        savePurchaseResource.code = this.generateRandomString();
                        savePurchaseResource.userId = this.storeGlobal.user.id;
                        console.log('savePurchaseResource.userId', savePurchaseResource.userId)
                        this.purchaseService.add(savePurchaseResource).then((response) => {
                            productToPurchaseResource.purchaseId = response.data.id;
                            productToPurchaseResource.productId = p.id;
                            this.purchaseService.addProductToPurchase(productToPurchaseResource);
                        });
                        //Sale
                        saveSaleResource.code = savePurchaseResource.code;
                        saveSaleResource.purchaserId = savePurchaseResource.userId;
                        saveSaleResource.storeId = p.storeId;
                        this.saleService.add(saveSaleResource).then((response) => {
                            productToSaleResource.saleId = response.data.id;
                            productToSaleResource.productId = p.id;
                            this.saleService.addProductToSale(productToSaleResource);
                            this.$router.push('/my-purchases').then(() => {
                                window.location.reload();
                            });
                            this.registerRequest = {};
                        });
                    }
                );

            }

        },




        generateRandomString(){
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const length = 10;
            let randomString = '';

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                randomString += characters.charAt(randomIndex);
            }

            return randomString;
        }
    }
}

</script>