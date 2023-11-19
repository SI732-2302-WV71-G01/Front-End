<template>
      <pv-toast />
      <header>
        <pv-toolbar class="flex bg-yellow-50">

          <template #start>
              <img src="./assets/User.png" width="70"/>
              <router-link v-if="storeGlobal.user === null"
                         :to= "items[0].to" custom v-slot="{ navigate, href }" :key="items[0].label">
                  <pv-button class="p-button-text text-orange-700" :href="href" @click="navigate">Access</pv-button>
              </router-link>

              <pv-button v-if="storeGlobal.user !== null " class="p-button-text text-orange-700" @click="test()">
                  Welcome, {{storeGlobal.user.username}}</pv-button>

              <pv-divider v-if="storeGlobal.user !== null" layout="vertical"></pv-divider>

              <pv-button v-if="storeGlobal.user !== null" class="p-button-text text-orange-700" @click="logOut()">
                  Log out</pv-button>

              <pv-divider v-if="storeGlobal.user !== null && storeGlobal.user.roleId === 2" layout="vertical"></pv-divider>

              <pv-button v-if="storeGlobal.user !== null && storeGlobal.user.roleId === 2" class="p-button-text text-orange-700"
                         @click="goToMyStores()">My Stores</pv-button>

              <pv-divider v-if="storeGlobal.user !== null && storeGlobal.user.roleId === 2" layout="vertical"></pv-divider>

              <pv-button v-if="storeGlobal.user !== null && storeGlobal.user.roleId === 2" class="p-button-text text-orange-700"
                         @click="goToMyArticles()">My Resources</pv-button>

              <pv-divider v-if="storeGlobal.user !== null" layout="vertical"></pv-divider>
              <pv-button v-if="storeGlobal.user !== null" class="p-button-text text-orange-700"
                         @click="goToMyPurchases">My Purchases</pv-button>

              <pv-divider layout="vertical"></pv-divider>

              <pv-button icon="pi pi-shopping-cart" rounded @click = "goToShoppingCart()"></pv-button>


          </template>

          <template #end>

            <router-link :to= "items[1].to" custom v-slot="{ navigate, href }" :key="items[1].label">
              <img src="./assets/PcBuildersLogo.png" width="70"/>
              <pv-button class="p-button-text text-orange-700" :href="href" @click="navigate">PC Builders</pv-button>
            </router-link>

          </template>

        </pv-toolbar>
      </header>

  <RouterView />
</template>

<script>
import { storeGlobal } from './learning/store/store'
export default {
  name: "app",
  data() {
    return {
        user3: {id: null, firstName: null, lastName: null, username: null,
            roleId: null, token: ""},
        //user3: JSON.parse(localStorage.getItem('User')),
        user2: null,
        user: null,
        userLogged: false,
        items:
          [
            { label: "Sign-in", to: "/sign-in" },
            { label: "Home", to: "/home" },
            { label: "My Stores", to: "/my-stores" },
          ],
        storeGlobal
    };
  },
  created() {
      console.log("User")
      console.log(this.storeGlobal.user);
      console.log("Cart")
      console.log(this.storeGlobal.shoppingCart)
      if(this.storeGlobal.shoppingCart !== null)
      {
          console.log("Cart length")
          console.log(this.storeGlobal.shoppingCart.length)
      }
  },
  methods:{
      goToMyPurchases(){
          this.$router.push('/my-purchases').then(() => {
              window.location.reload();
          });
      },
      test(){
          console.log(this.storeGlobal.user);
          console.log(this.storeGlobal.shoppingCart);
      },
      logOut(){
          localStorage.setItem('User', null);
          //this.storeGlobal.updateUser(JSON.parse(localStorage.getItem('User')));

          if(this.storeGlobal.shoppingCart !== null && this.storeGlobal.shoppingCart.length > 0){
              this.storeGlobal.shoppingCart.splice(0, this.storeGlobal.shoppingCart.length);
              localStorage.setItem('ShoppingCart', JSON.stringify(this.storeGlobal.shoppingCart));
          }

          console.log(this.storeGlobal.user);

          this.$router.push('/home').then(() => {
              window.location.reload();
          });

      },
      goToMyStores(){
          /*if(this.storeGlobal.goingToMyStores === 'false')*/

          localStorage.setItem('MyStores', 'true');
          this.storeGlobal.goingToMyStores = localStorage.getItem('MyStores');
          this.$router.push('/my-stores').then(() => {
              window.location.reload();
          });

      },
      goToMyArticles(){
          localStorage.setItem('MyArticles', 'true');
          this.storeGlobal.goingToMyStores = localStorage.getItem('MyArticles');
          this.$router.push('/resources').then(() => {
              window.location.reload();
          });
      },
      goToShoppingCart(){

          this.$router.push('/shopping-cart');
      }
  }
}


</script>

