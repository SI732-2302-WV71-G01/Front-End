<template>
    <!--SALES BUTTON-->
    <pv-button v-if="storeGlobal.user !== null && storeGlobal.user.roleId === 2
                    && this.storeGlobal.goingToMyStores === 'true'"
               :label="'Sales'" icon="pi pi-shopping-bag" class="p-button-icon"
               @click="this.$router.push('/my-sales')"/>
    <pv-divider></pv-divider>
    <!--INFORMATION OR RESEÑAS-->
    <pv-selected-button v-model="this.vistaTiendas" :options="vistasTiendas" aria-labelledby="basic" />
    <pv-divider></pv-divider>

    <!--APARTADO DE INFOMRACION-->
    <div v-if="vistaTiendas === 'Informacion'">
        <div v-if="storesImages.length > 0" class="card">

            <!--NAME AND LOGO OF THE STORE-->
            <div class="p-3 text-center">
                <header class="flex justify-content-center">
                    <h1>{{storeGlobal.store.name}}</h1>
                    <pv-divider layout="vertical"></pv-divider>
                    <img :src="getImageUrl(this.storeGlobal.store.encoded64LogoImage)" class="shadow-2 border-round w-6rem"/>
                </header>

                <pv-divider></pv-divider>
                <!--IMAGES OF THE STORE-->
                <img  :src="getImageUrl(this.storesImages[first].enconded64Image)" :alt="first" class="shadow-2 border-round w-full sm:w-15rem" />
                <p class="p-text-secondary">Dirección: {{storeGlobal.store.address}}</p>
            </div>
            <pv-paginator v-model:first="first" :rows="1" :totalRecords="storesImages.length"
                          template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
        </div>
        <pv-divider></pv-divider>
        <pv-selected-button v-model="this.vistaProductos" :options="vistasProductos" aria-labelledby="basic" />
        <!--DATA VIEW OF ALL PRODUCTS-->
        <pv-data-view v-if="products.length > 0 && vistaProductos === 'Todos'" :value="products" paginator :rows="5">
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
                                    <pv-tag :value="promotionOrNoPromotion(slotProps.data)" :severity="getSeverityOfPromotion(slotProps.data)"></pv-tag>
                                    <pv-tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)"></pv-tag>
                                </div>

                            </div>
                            <!-- ICONS -->
                            <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <span class="text-2xl font-semibold">${{ slotProps.data.price }}</span>
                                <pv-button v-if="storeGlobal.user === null || storeGlobal.goingToMyStores === 'false' "
                                           icon="pi pi-shopping-cart" rounded
                                           @click = "addProductToShoppingCart(slotProps.data) "></pv-button>
                                <pv-button v-if="storeGlobal.goingToMyStores === 'true' "
                                           icon="pi pi-pencil" class="p-button-success" rounded
                                           @click="this.producto = {...slotProps.data} ; productDialog = true;
                            producto.rating = String(producto.rating); producto.promotion = String(producto.promotion);
                            console.log(producto.rating)"></pv-button>
                                <pv-button v-if="storeGlobal.goingToMyStores === 'true' "
                                           icon="pi pi-trash"  class="p-button-danger" rounded
                                           @click ="deleteProductDialog = true; this.producto = slotProps.data"></pv-button>
                            </div>
                        </div>
                    </div>

                </div>
            </template>
        </pv-data-view>
        <!--DATA VIEW OF PODUCTS WITH PROMOTION-->
        <pv-data-view v-if="productsWithPromotion.length > 0 && vistaProductos === 'Con promocion'" :value="productsWithPromotion" paginator :rows="5">
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
                                    <pv-tag :value="promotionOrNoPromotion(slotProps.data)" :severity="getSeverityOfPromotion(slotProps.data)"></pv-tag>
                                    <pv-tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)"></pv-tag>
                                </div>

                            </div>
                            <!-- ICONS -->
                            <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <span class="text-2xl font-semibold">${{ slotProps.data.price }}</span>
                                <pv-button v-if="storeGlobal.user === null || storeGlobal.goingToMyStores === 'false' "
                                           icon="pi pi-shopping-cart" rounded
                                           @click = "addProductToShoppingCart(slotProps.data) "></pv-button>
                            </div>
                        </div>
                    </div>

                </div>
            </template>
        </pv-data-view>

        <div v-if="vistaProductos === 'Todos' && products.length === 0" class="flex justify-content-center">
            <h3>No hay productos aún</h3>
        </div>

        <div v-if="vistaProductos === 'Con promocion' && productsWithPromotion.length === 0" class="flex justify-content-center">
            <h3>No hay productos con promoción aún</h3>
        </div>

        <pv-button v-if="storeGlobal.goingToMyStores === 'true' && vistaProductos === 'Todos'"
                   label="New Product" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew()"/>

        <!--Products Dialog -->
        <pv-dialog v-model:visible="productDialog" :style="{ width: '450px' }"
                   header="Product Information" :modal="true" class="p-fluid">
            <div class="field mt-3">
                    <span class="p-float-label">
                        <i class="pi pi-shopping-bag"></i>
                        <pv-input-text type="text" id="name" v-model.trim="producto.name" required="true"
                                       autofocus :class="{ 'p-invalid': submitted && !producto.name }"/>
                        <label for="name">Product Name</label>
                        <small class="p-error" v-if="submitted && !producto.name">
                          The name of the product is required.
                        </small>
                    </span>
            </div>

            <div class="field mt-3">
                    <span class="p-float-label">
                        <i class="pi pi-tag"></i>
                        <pv-input-text type="text" id="description" v-model.trim="producto.category" required="true"
                                       autofocus :class="{ 'p-invalid': submitted && !producto.category }"/>
                        <label for="description">Product Category</label>
                        <small class="p-error" v-if="submitted && !producto.category">
                          The Category of the product is required.
                        </small>
                    </span>
            </div>

            <div class="field mt-3">
                  <span class="p-float-label">
                      <i class="pi pi-star"></i>
                      <pv-dropdown type="text" id="Rating" v-model="producto.rating" :options="ratings"
                                   optionLabel="name"
                                   optionValue ="code"
                                   placeholder="Select a rating" required="true"
                                   autofocus :class="{ 'p-invalid': submitted && !producto.rating }"
                                   class="w-full md:w-14rem" />
                      <label for="Rating">Product Rating</label>
                      <small class="p-error" v-if="submitted && !producto.rating">
                          Product Rating is required.
                      </small>
                  </span>
            </div>
            <div class="field mt-3">
                    <span class="p-float-label">
                        <i class="pi pi-dollar"></i>
                        <pv-input-text type="text" id="address" v-model.trim="producto.price" required="true"
                                       autofocus :class="{ 'p-invalid': submitted && !producto.price }"/>
                        <label for="address">Product Price</label>
                        <small class="p-error" v-if="submitted && !producto.price">
                          The Price of the product is required.
                        </small>
                    </span>
            </div>
            <div class="field mt-3">
                  <span class="p-float-label">
                      <i class="pi pi-box"></i>
                      <pv-dropdown type="text" id="Inventory" v-model="producto.inventoryStatus" :options="inventoryStatuses"
                                   optionLabel="name"
                                   optionValue ="code"
                                   placeholder="Select a Inventory Status" required="true"
                                   autofocus :class="{ 'p-invalid': submitted && !producto.inventoryStatus }"
                                   class="w-full md:w-14rem" />
                      <label for="Inventory">Product Inventory Status</label>
                      <small class="p-error" v-if="submitted && !producto.inventoryStatus">
                          Product Inventory Status is required.
                      </small>
                  </span>
            </div>

            <div class="field mt-3">
                  <span class="p-float-label">
                      <i class="pi pi-megaphone"></i>
                      <pv-dropdown type="text" id="Promotion" v-model="producto.promotion" :options="promotionOptions"
                                   optionLabel="name"
                                   optionValue ="code"
                                   placeholder="¿Está en promoción?" required="true"
                                   autofocus :class="{ 'p-invalid': submitted && !producto.promotion }"
                                   class="w-full md:w-14rem" />
                      <label for="Promotion">Product Promotion</label>
                      <small class="p-error" v-if="submitted && !producto.promotion">
                          Product Promotion Information is required.
                      </small>
                  </span>
            </div>

            <div class="field mt-3">
            <span class="p-float-label">
                    <pv-file-upload
                        id="productImage"
                        ref="fileUploadRef1"
                        name="demo[]"
                        :multiple="true"
                        accept="image/*"
                        :max-file-size="1000000"
                        :pt="{
                                content: { class: 'surface-ground ',
                                invalidFileLimitMessage: 'Max files exceeded'}
                                }"
                        :show-upload-button="false"
                        :show-choose-button="false"
                        :file-limit="maxFiles"
                        class="custom-file-upload"
                    >
                        <template #empty>
                          <p>Drag and drop the file here to upload.</p>
                        </template>
                    </pv-file-upload>

                    <label for="productImage">Product Image</label>
                    <small class="p-error" v-if="submitted && this.fileUpload1.files.length === 0">
                         The image of the product is required.
                    </small>
                    <small class="p-error" v-if="submitted && this.fileUpload1.files.length > maxFiles">
                          The number of images of exceed the maximum: 1.
                    </small>

            </span>
            </div>

            <template #footer>
                <pv-button :label="'Cancel'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="productDialog = false; submitted = false;"/>
                <pv-button :label="'Save'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="submitted = true; sendData();"/>
            </template>
        </pv-dialog>

        <!-- Delete Product Dialog -->
        <pv-dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>
                  Are you sure you want to delete <b>{{ producto.name }}</b>?
            </span>
            </div>
            <template #footer>
                <pv-button :label="'No'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false"/>
                <pv-button :label="'Yes'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="deleteProduct"/>
            </template>
        </pv-dialog>
    </div>



    <!--APARTADO DE RESEÑAS-->
    <div v-if="vistaTiendas === 'Reseñas'">
        <div v-if="storesImages.length > 0" class="card">

            <!--NAME AND LOGO OF THE STORE-->
            <div class="p-3 text-center">
                <header class="flex justify-content-center">
                    <h1>{{storeGlobal.store.name}}</h1>
                    <pv-divider layout="vertical"></pv-divider>
                    <img :src="getImageUrl(this.storeGlobal.store.encoded64LogoImage)" class="shadow-2 border-round w-6rem"/>
                </header>

                <pv-divider></pv-divider>
                <!--IMAGES OF THE STORE-->

                <div class="flex align-items-center gap-3 w-full justify-content-center">
                    <span class="flex align-items-center gap-2">
                        <i class="pi pi-star-fill"></i>
                        <pv-divider layout="vertical"></pv-divider>
                        <p class="font-semibold">{{this.comments.length}} comentarios </p>
                    </span>
                </div>


            </div>

        </div>
        <pv-divider></pv-divider>
        <!--COMMENTS-->
        <pv-button v-if="this.storeGlobal.user && this.storeGlobal.store.userId !== this.storeGlobal.user.id"
                   label="New Comment" icon="pi pi-plus" class="p-button mr-2" @click="openNew2()"/>
        <pv-data-view v-if="comments.length > 0" :value="comments" paginator :rows="5">

            <template #list="slotProps">

                <div class="col-12">

                    <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                        <img class="w-9 sm:w-16rem xl:w-4rem shadow-2 block xl:block mx-auto border-round"
                             src="../../assets/User.png"  />

                        <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                <div class="text-2xl font-bold text-900">{{ slotProps.data.username }}</div>

                                <div class="flex align-items-center gap-3">
                                    <div class="font-semibold">{{ slotProps.data.content }}</div>
                                </div>
                            </div>
                            <!-- ICONS -->
                            <div v-if="this.storeGlobal.user" class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <pv-button v-if="slotProps.data.username === this.storeGlobal.user.username "
                                           icon="pi pi-pencil" class="p-button-success" rounded
                                           @click="this.comment = {...slotProps.data} ; commentDialog = true;"></pv-button>
                                <pv-button v-if="slotProps.data.username === this.storeGlobal.user.username "
                                           icon="pi pi-trash"  class="p-button-danger" rounded
                                           @click ="deleteCommentDialog = true; this.comment = slotProps.data"></pv-button>
                            </div>
                        </div>
                    </div>

                </div>
            </template>
        </pv-data-view>

        <!--comment DIALOG-->
        <pv-dialog v-model:visible="commentDialog" :style="{ width: '450px'}"
                   header="Comment" :modal="true" class="p-fluid ">
            <div class="field mt-3">
                    <span class="p-float-label">
                        <i class="pi pi-file-edit"></i>
                        <pv-input-text type="text" id="content" v-model.trim="comment.content" required="true"
                                       autofocus :class="{ 'p-invalid': submitted2 && !comment.content }"/>
                        <label for="content">Comment Content</label>
                        <small class="p-error" v-if="submitted2 && !comment.content">
                          The content of the comment is required.
                        </small>
                    </span>
            </div>

            <template #footer>
                <pv-button :label="'Cancel'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="commentDialog = false; submitted = false;"/>
                <pv-button :label="'Save'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="submitted2 = true; saveComment();"/>
            </template>
        </pv-dialog>

        <!--DELETE Comment DIALOG-->
        <pv-dialog v-model:visible="deleteCommentDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>
                  Are you sure you want to delete the comment?
            </span>
            </div>
            <template #footer>
                <pv-button :label="'No'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="deleteCommentDialog = false"/>
                <pv-button :label="'Yes'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="deleteComment"/>
            </template>
        </pv-dialog>

    </div>



</template>


<script>
import {StoreImagesApiService} from "@/learning/services/storeImages.api.service";
import { storeGlobal } from '../store/store'
import {ProductsApiService} from "@/learning/services/products-api.service";
import {RatingsApiService} from "@/learning/services/ratings-api.service";
import {StoresApiService} from "@/learning/services/stores-api.service";
import {CommentsApiService} from "@/learning/services/comments-api.service";
export default {
    data() {
        return {
            deleteCommentDialog: false,
            articleUserRedacter:{},
            submitted2:false,
            commentDialog: false,
            commentService: null,
            comment: {},
            comments : [],
            ratingValue: 0,
            storeService: null,
            ratingService: null,
            rating: {},
            vistaTiendas:'Informacion',
            vistaProductos:'Todos',
            deleteProductDialog: false,
            maxFiles: 1,
            producto :{},
            submitted: false,
            fileUpload1 : null,
            products : [],
            productsWithPromotion: [],
            productDialog: false,
            storesImages: [],
            first: 0,
            storeImageService: null,
            productService: null,
            storeGlobal,
            inventoryStatuses: [
                { name: 'INSTOCK', code: 'INSTOCK' },
                { name: 'LOWSTOCK', code: 'LOWSTOCK' },
                { name: 'OUTOFSTOCK', code: 'OUTOFSTOCK' }
            ],
            ratings: [
                { name: '1', code: '1' },
                { name: '2', code: '2' },
                { name: '3', code: '3' },
                { name: '4', code: '4' },
                { name: '5', code: '5' }
            ],
            promotionOptions: [
                { name: 'Yes', code: 'Yes' },
                { name: 'No', code: 'No' }
            ],
            vistasProductos: [
                'Todos',
                'Con promocion'
            ],
            vistasTiendas: [
                'Informacion',
                'Reseñas'
            ],
            storeRatings:[]

        };
    },
    created() {
        //Comments
        this.commentService = new CommentsApiService();
        this.commentService.getAllByStoreId(this.storeGlobal.store.id).then((response)=>{
            this.comments = response.data;
        });

        //Rating
        this.storeService = new StoresApiService();
        this.ratingService = new RatingsApiService();
        if(this.storeGlobal.store.userId !== this.storeGlobal.user.id)
        {
            this.ratingService.getByStoreIdAndUserId(this.storeGlobal.store.id, this.storeGlobal.user.id)
                .then((response)=>{
                    this.rating = response.data[0];
                    this.ratingValue = this.rating.value
                }).catch((error) => {
                this.ratingValue = 0;
                console.log( this.rating.value)
            });
        }


        this.storeImageService = new StoreImagesApiService();
        this.productService = new ProductsApiService();
        this.storeImageService.getAllByStoreId(this.storeGlobal.store.id).then((response)=>{
            this.storesImages = response.data;
        });
        this.productService.getAllByStoreId(this.storeGlobal.store.id).then((response) => {
            this.products = response.data;
            this.productsWithPromotion = this.products.filter(
                (p) => p.promotion === 'Yes'
            );
        })
    },
    methods:{
        handleModelValueUpdate(){

            this.ratingService.getByStoreIdAndUserId(this.storeGlobal.store.id, this.storeGlobal.user.id)
                .then((response)=>{ //UPDATE
                    console.log('Updating Rating')
                    this.rating.storeId = this.storeGlobal.store.id
                    this.rating.userId = this.storeGlobal.user.id
                    this.ratingService.update(this.rating.id,this.rating).then((response) => {
                    })

                }).catch((error) => { //CREATE
                console.log('Creating Rating')
                this.rating.storeId = this.storeGlobal.store.id
                this.rating.userId = this.storeGlobal.user.id
                this.rating.value = this.ratingValue
                console.log(this.rating)
                this.ratingService.add(this.rating).then((response) => {
                    this.ratingValue = this.rating.value
                })
            });


            //Updating the averageRating of the store
            this.ratingService.getAllByStoreId(this.storeGlobal.store.id).then((response)=>{
                this.storeRatings = response.data
                let sumaRatingValues = 0;
                let averageRating;
                for (let i = 0; i < this.storeRatings.length; i++){
                    sumaRatingValues+=this.storeRatings[i].value
                }
                averageRating = sumaRatingValues/this.storeRatings.length;
                this.storeGlobal.store.avgRating = averageRating
                this.storeService.update(this.storeGlobal.store.id,this.storeGlobal.store).then((response)=>{
                    localStorage.setItem('Store', JSON.stringify(response.data));
                    this.storeGlobal.store = localStorage.getItem('Store')
                })
            })

        },

        openNew2(){
            this.commentDialog = true;
            this.comment = {};
        },
        saveComment(){
            if(this.comment.content ){ //Validation

                if(!this.comment.id){ //Save
                    this.comment.username = this.storeGlobal.user.username;
                    this.comment.articleId = 0;
                    this.comment.storeId = this.storeGlobal.store.id;
                    this.commentService.add(this.comment).then((response)=> {
                        this.comments.push(response.data);
                        this.comment = {};
                        this.commentDialog = false;
                    })
                }
                else{//Edit
                    this.comment.username = this.storeGlobal.user.username;
                    this.comment.articleId = 0;
                    this.comment.storeId = this.storeGlobal.store.id;
                    this.commentService.update(this.comment.id, this.comment).then((response) => {
                        this.comments[this.findIndexById2(response.data.id)] = response.data;
                        this.comment = {};
                        this.commentDialog = false;
                    });
                }

            }
        },
        deleteComment(){
            this.commentService.delete(this.comment.id).then((response) => {
                this.comments = this.comments.filter(
                    (c) => c.id !== response.data.id
                );
                this.$toast.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Comment Deleted",
                    life: 3000,
                });
                this.deleteCommentDialog = false;
            });
        },
        findIndexById2(id) {
            console.log(`current id: ${id}`);
            return this.comments.findIndex((comment) => comment.id === id);
        },



        getSeverityOfPromotion(product){
            switch (product.promotion) {
                case 'Yes':
                    return 'danger';

                case 'No':
                    return 'warning';
            }
        },
        promotionOrNoPromotion(product){
            if(product.promotion === 'Yes')
                return 'ON PROMOTION'
            else
                return 'Not on promotion'
        },
        openNew(){
            this.productDialog = true;
            this.producto = {};
        },
        addProductToShoppingCart(product){
            if(product.inventoryStatus === 'OUTOFSTOCK')
            {
                this.$toast.add({
                    severity: "error",
                    summary: "Warning",
                    detail: "Product is Out of Stock",
                    life: 8000,
                });
            }
            else{
                console.log(this.storeGlobal.shoppingCart)
                if(this.storeGlobal.shoppingCart === null)
                {
                    this.storeGlobal.shoppingCart = [];
                }

                const isProductExists = this.storeGlobal.shoppingCart.some(
                    (item) => item.id === product.id
                );

                if(!isProductExists)
                {
                    this.storeGlobal.shoppingCart.push(product);
                    localStorage.setItem('ShoppingCart', JSON.stringify(this.storeGlobal.shoppingCart));
                    this.$toast.add({
                        severity: "success",
                        summary: "Successful",
                        detail: "Product Added to the Cart",
                        life: 8000,
                    });
                    console.log("Cart Lenght")
                    console.log(this.storeGlobal.shoppingCart.length);
                }
                else {
                    console.log("Product is already in the cart!")
                    this.$toast.add({
                        severity: "info",
                        summary: "Alert",
                        detail: "Product is already added to the Cart",
                        life: 8000,
                    });
                }
            }

        },
        sendData(){
            const fileUpload1 = this.$refs.fileUploadRef1;
            this.fileUpload1 = fileUpload1;
            const globalConditional = this.getGlobalConditional(fileUpload1);

            if(globalConditional){
                const selectedFiles1 = fileUpload1.files;
                if(!this.producto.id){ //CREATE
                    console.log("Create");

                    this.producto.price = Number(this.producto.price);
                    this.producto.rating = Number(this.producto.rating);
                    this.producto.storeId = this.storeGlobal.store.id;

                    const file = selectedFiles1[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        //Image of the Store
                        this.producto.image = reader.result.split(",")[1];

                        console.log(this.producto);
                        this.productService.add(this.producto).then((response) => {
                            this.products.push(response.data);
                            this.productsWithPromotion = this.products.filter(
                                (p) => p.promotion === 'Yes'
                            );
                            this.producto = {};
                            this.productDialog = false;
                        });
                    };
                    reader.readAsDataURL(file);
                }
                else{ //UPDATE
                    console.log("Edit");
                    console.log(this.producto.id);
                    this.producto.price = Number(this.producto.price);
                    this.producto.rating = Number(this.producto.rating);
                    this.producto.storeId = this.storeGlobal.store.id;

                    const saveProductResource = {};
                    saveProductResource.name = this.producto.name;
                    saveProductResource.category = this.producto.category;
                    saveProductResource.rating = this.producto.rating;
                    saveProductResource.inventoryStatus = this.producto.inventoryStatus;
                    saveProductResource.promotion = this.producto.promotion;
                    saveProductResource.price = this.producto.price;
                    saveProductResource.storeId = this.producto.storeId;
                    console.log(saveProductResource);
                    const file = selectedFiles1[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        //Image of the Store
                        saveProductResource.image = reader.result.split(",")[1];

                        this.productService.update(this.producto.id, saveProductResource).then((response) => {
                            console.log(response.data)
                            //Actualizar los datos del DataView
                            this.products[this.findIndexById(response.data.id)] = response.data;
                            this.productsWithPromotion = this.products.filter(
                                (p) => p.promotion === 'Yes'
                            );
                            this.producto = {};
                            this.productDialog = false;
                        });
                    };
                    reader.readAsDataURL(file);
                }
            }

        },
        deleteProduct(){
            this.productService.delete(this.producto.id).then((response) => {
                this.products = this.products.filter(
                    (p) => p.id !== response.data.id
                );
                this.productsWithPromotion = this.products.filter(
                    (p) => p.promotion === 'Yes'
                );

                this.$toast.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Deleted",
                    life: 3000,
                });
                this.deleteProductDialog = false;
            });
        },
        getImageUrl(base64Image) {
            return `data:image/png;base64, ${base64Image}`;
        },
        getSeverity(producto) {
            switch (producto.inventoryStatus) {
                case 'INSTOCK':
                    return 'success';

                case 'LOWSTOCK':
                    return 'warning';

                case 'OUTOFSTOCK':
                    return 'danger';

                default:
                    return null;
            }
        },
        getGlobalConditional(fileUpload1){
            return this.producto.name && this.producto.category && this.producto.rating && this.producto.promotion
                && this.producto.price  && this.producto.inventoryStatus  &&
                fileUpload1.files.length === 1;
        },
        findIndexById(id) {
            console.log(`current id: ${id}`);
            return this.products.findIndex((producto) => producto.id === id);
        }
    }
};
</script>