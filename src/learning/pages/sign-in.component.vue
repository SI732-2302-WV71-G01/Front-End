<template>
    <div class="container">
        <div class="form-container">
            <div class="field mt-3">
                <span class="p-float-label">
                    <pv-input-text type="text" id="username" v-model.trim="userRequest.Username" required="true" autofocus :class="{ 'p-invalid': submitted && userRequest.Username==='' }"/>
                    <label for="username">Username</label>
                    <small class="p-error" v-if="submitted && userRequest.Username===''">
                      Username is required.
                    </small>
                </span>
            </div>
            <div class="field mt-3">
                <span class="p-float-label">
                    <pv-input-text type="text" id="password" v-model.trim="userRequest.Password" required="true" autofocus :class="{ 'p-invalid': submitted && userRequest.Password==='' }"/>
                    <label for="password">Password</label>
                    <small class="p-error" v-if="submitted && userRequest.Password===''">
                      Password is required.
                    </small>
                </span>
            </div>


            <pv-button :label="'Sign in'.toUpperCase()" class="p-button-text"  @click="submitted = true; signIn();"/>
            <div class="flex ">
                <div class="flex flex-column">
                    <p class="p">Don't have an account yet?</p>

                    <div class="c">
                        <router-link :to= "items[0].to" custom v-slot="{ navigate, href }" :key="items[0].label">
                            <pv-button  class="p-button-text text-orange-700" :href="href" @click="navigate" >Sign up</pv-button>
                        </router-link>
                    </div>



                </div>
            </div>

            <pv-dialog v-model:visible="userNotFound" modal header="Username or password Incorrect" :style="{ width: '50vw' }">
                <p>
                    Verify your credentials
                </p>
            </pv-dialog>
        </div>
    </div>

</template>

<script>

import {UsersApiService} from "@/learning/services/users-api.service";
import App from "@/App.vue";
import { storeGlobal } from '../store/store'
import {StoresApiService} from "@/learning/services/stores-api.service";
import {ProductsApiService} from "@/learning/services/products-api.service";
export default {
    name: "sign-in",
    components: {App},
    data() {
        return {
            userRequest : {Username: "", Password: ""},
            userResponse : null, //Authentication Response
            userNotFound: false,
            submitted: false,
            userService: null,
            storeGlobal,
            storeService: null,
            productService: null,
            items: [
                { label: "Sign-up", to: "/sign-up"}
            ]
        };
    },
    created(){
        this.userService = new UsersApiService();
        this.storeService = new StoresApiService();
        this.productService = new ProductsApiService();
    },
    methods: {
        signIn(){

            if (this.userRequest.Username !== "" && this.userRequest.Password !== "" ) {//Validation
                this.userService.authenticate(this.userRequest).then((response) => {
                    console.log(response.data)
                    localStorage.setItem('User', JSON.stringify(response.data));
                    this.storeGlobal.updateUser(JSON.parse(localStorage.getItem('User')));
                    this.userNotFound = false;


                    this.$router.push('/home');

                    console.log("despues de pushear a home")
                    console.log(this.storeGlobal.user)
                    //Eliminating the products from the stores of the user that logged in
                    this.storeService.getAllByUserId(response.data.id).then((response) => {
                        response.data.forEach(
                            (s) => {this.productService.getAllByStoreId(s.id).then((response3)=>{
                                response3.data.forEach((prod)=>{
                                    console.log('Product to eliminate:')
                                    console.log(prod);
                                    const productToEliminate = this.storeGlobal.shoppingCart
                                        .find((item) => item.id === prod.id);
                                    //If the product exists in the Shopping Cart
                                    /*const productExists = this.storeGlobal.shoppingCart.some(
                                        (item) => item.id === prod.id
                                    );*/
                                    //We eliminate him
                                    if(productToEliminate)
                                    {
                                        console.log(this.storeGlobal.shoppingCart);
                                        const indexToRemove = this.storeGlobal.shoppingCart.indexOf(productToEliminate);
                                        console.log(`Index ${indexToRemove}`);
                                        this.storeGlobal.shoppingCart.splice(indexToRemove, 1);
                                        localStorage.setItem('ShoppingCart', JSON.stringify(this.storeGlobal.shoppingCart));
                                    }
                                });

                            });}
                        );
                    });


                }).catch((error) => {

                    this.userNotFound = true;
                    console.log("Error occurred:", error);
                });

            }
        }
    }
}
</script>
<style>
.container {
    font-family: 'Roboto';
    display: flex;
    justify-content: center;

    height: 50vh;
    padding-top: 3rem;
}
.form-container {
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
    border-radius: 2rem;

}
.flex-column {
    display: block;
    flex-direction: column;
    justify-content: center;

}
.c{
    justify-content: center;
}

</style>
