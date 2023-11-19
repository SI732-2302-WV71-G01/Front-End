<template>
    <div v-if="storesImages.length > 0" class="card">
        <pv-button v-if="storeGlobal.user !== null && storeGlobal.user.roleId === 2
                    && this.storeGlobal.goingToMyStores === 'true'"
                   :label="'Sales'" icon="pi pi-shopping-bag" class="p-button-icon"
                   @click="this.$router.push('/my-sales')"/>
        <div class="p-3 text-center">
            <header class="flex justify-content-center">

                <h1>{{storeGlobal.store.name}}</h1>
                <pv-divider layout="vertical"></pv-divider>
                <img :src="getImageUrl(this.storeGlobal.store.encoded64LogoImage)" class="shadow-2 border-round w-6rem"/>
            </header>
            <pv-divider></pv-divider>
            <img  :src="getImageUrl(this.storesImages[first].enconded64Image)" :alt="first" class="shadow-2 border-round w-full sm:w-15rem" />
        </div>
        <pv-paginator v-model:first="first" :rows="1" :totalRecords="storesImages.length"
                      template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
    </div>
    <pv-divider></pv-divider>


    <pv-data-view v-if="products.length > 0" :value="products" paginator :rows="5">
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
                            producto.rating = String(producto.rating); console.log(producto.rating)"></pv-button>
                            <pv-button v-if="storeGlobal.goingToMyStores === 'true' "
                                       icon="pi pi-trash"  class="p-button-danger" rounded
                                       @click ="deleteProductDialog = true; this.producto = slotProps.data"></pv-button>
                        </div>
                    </div>
                </div>

            </div>
        </template>
    </pv-data-view>




    <div v-else class="flex justify-content-center">
        <h3>No hay productos aún</h3>
    </div>

    <pv-button v-if="storeGlobal.goingToMyStores === 'true'"
               label="New Product" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew()"/>

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
</template>


<script>
import {StoreImagesApiService} from "@/learning/services/storeImages.api.service";
import { storeGlobal } from '../store/store'
import {ProductsApiService} from "@/learning/services/products-api.service";
export default {
    data() {
        return {
            deleteProductDialog: false,
            maxFiles: 1,
            producto :{},
            submitted: false,
            fileUpload1 : null,
            products : [],
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

        };
    },
    created() {
        this.storeImageService = new StoreImagesApiService();
        this.productService = new ProductsApiService();
        this.storeImageService.getAllByStoreId(this.storeGlobal.store.id).then((response)=>{
            this.storesImages = response.data;
        });
        this.productService.getAllByStoreId(this.storeGlobal.store.id).then((response) => {
            this.products = response.data;
        })
    },
    methods:{
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
                    saveProductResource.price = this.producto.price;
                    saveProductResource.storeId = this.producto.storeId;
                    console.log(saveProductResource);
                    const file = selectedFiles1[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        //Image of the Store
                        saveProductResource.image = reader.result.split(",")[1];

                        this.productService.update(this.producto.id, saveProductResource).then((response) => {
                            //Actualizar los datos del DataView
                            this.products[this.findIndexById(response.data.id)] = response.data;
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
            return this.producto.name && this.producto.category && this.producto.rating
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