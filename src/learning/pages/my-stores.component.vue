<template>
    <div class="card">
        <pv-toolbar class="mb-4">
            <template #start>
                <pv-button v-if="this.storeGlobal.goingToMyStores === 'true'" label="Delete" icon="pi pi-trash" class="p-button-danger" @click="store = {}; deleteStoresDialog = true;" :disabled="!selectedStores || !selectedStores.length"/>
            </template>
        </pv-toolbar>
        <pv-data-table ref="dt" :value="stores" v-model:selection="selectedStores" dataKey="id" :paginator="true" :rows="10" :filters="filters"
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5, 10, 25]"
                       currentPageReportTemplate="Showing {first} to {last} of {totalRecords} stores" responsiveLayout="scroll">
            <template #header>
                <div class="table-header flex flex-column md:flex-row md:justify-content-between">
                    <h5 v-if="this.storeGlobal.goingToMyStores === 'true'" class="mb-2 md:m-0 p-as-md-center text-xl">My Stores</h5>
                    <h5 v-else class="mb-2 md:m-0 p-as-md-center text-xl">Stores</h5>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <pv-input-text v-model="filters['global'].value" placeholder="Search..."/>
                    </span>
                </div>
            </template>
            <pv-column v-if="this.storeGlobal.goingToMyStores === 'true'" selectionMode="multiple" style="width: 3rem" :exportable="false"></pv-column>
<!--            <pv-column  field="id" header="Id" :sortable="true" style="min-width: 12rem"></pv-column>-->
            <pv-column field="name" header="name" :sortable="true" style="min-width: 16rem">
                <template #body="slotProps">
                    <pv-button class="p-button-text text-orange-700"  @click="goToStore(slotProps.data)">{{slotProps.data.name}}</pv-button>
                </template>
            </pv-column>
            <pv-column field="description" header="Description" :sortable="true" style="min-width: 16rem"></pv-column>
            <pv-column field="address" header="Address" :sortable="true" style="min-width: 16rem"></pv-column>
            <pv-column field="encoded64LogoImage" header="Logo" :sortable="false" style="min-width: 12rem">
                <template #body="slotProps">
                    <img v-if="slotProps.data.encoded64LogoImage"
                         :src="getImageUrl(slotProps.data.encoded64LogoImage)" width="100" height="100" alt="Image Description">
                </template>
            </pv-column>
            <pv-column v-if="this.storeGlobal.goingToMyStores === 'true'" :exportable="false" style="min-width: 8rem">
                <template #body="slotProps">
                    <pv-button icon="pi pi-pencil" class="p-button-text p-button-rounded" @click="this.store = {...slotProps.data} ; storeDialog = true; selectedStores = [];"/>
                    <pv-button icon="pi pi-trash" class="p-button-text p-button-rounded" @click="this.store = slotProps.data; deleteStoresDialog = true; selectedStores = []; storableSelectedStores.push(store);"/>
                </template>
            </pv-column>
        </pv-data-table>
    </div>


    <pv-button  v-if="this.storeGlobal.goingToMyStores === 'true'"
                label="New Store" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew()"/>

    <pv-dialog v-model:visible="storeDialog" :style="{ width: '450px' }"
             header="Store Information" :modal="true" class="p-fluid">
        <div class="field mt-3">
                    <span class="p-float-label">
                        <pv-input-text type="text" id="name" v-model.trim="store.name" required="true"
                                       autofocus :class="{ 'p-invalid': submitted && !store.name }"/>
                        <label for="name">Store Name</label>
                        <small class="p-error" v-if="submitted && !store.name">
                          The name of the store is required.
                        </small>
                    </span>
        </div>

        <div class="field mt-3">
                    <span class="p-float-label">
                        <pv-input-text type="text" id="description" v-model.trim="store.description" required="true"
                                       autofocus :class="{ 'p-invalid': submitted && !store.description }"/>
                        <label for="description">Store Description</label>
                        <small class="p-error" v-if="submitted && !store.description">
                          The description of the store is required.
                        </small>
                    </span>
        </div>

        <div class="field mt-3">
                    <span class="p-float-label">
                        <pv-input-text type="text" id="address" v-model.trim="store.address" required="true"
                                       autofocus :class="{ 'p-invalid': submitted && !store.address }"/>
                        <label for="address">Store Address</label>
                        <small class="p-error" v-if="submitted && !store.address">
                          The address of the store is required.
                        </small>
                    </span>
        </div>

        <div class="field mt-3">
            <span class="p-float-label">
                    <pv-file-upload
                          id="logo"
                          ref="fileUploadRef1"
                          name="demo[]"
                          :multiple="false"
                          accept="image/*"
                          :max-file-size="1000000"
                          :pt="{
                                content: { class: 'surface-ground ',
                                invalidFileLimitMessage: 'Max files exceeded'}
                                }"
                          :show-upload-button="false"
                          :show-choose-button="false"
                          :file-limit="maxFilesLogo"
                          class="custom-file-upload"
                    >
                        <template #empty>
                          <p>Drag and drop files here to upload.</p>
                        </template>
                    </pv-file-upload>

                    <label for="logo">Store Logo</label>
                    <small class="p-error" v-if="submitted && this.fileUpload1.files.length === 0">
                         The logo of the store is required.
                    </small>

            </span>
        </div>

        <div class="field mt-3">
            <span class="p-float-label">
                <pv-file-upload
                            id="storeImages"
                            ref="fileUploadRef2"
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
                            :file-limit="maxFilesStoreImages"
                            class="custom-file-upload"
                        >
                    <template #empty>
                        <p>Drag and drop files here to upload.</p>
                    </template>
                </pv-file-upload>
                <label for="storeImages">Store Images</label>
                <small class="p-error" v-if="submitted && this.fileUpload2.files.length === 0">
                    The images of the store are required.
                </small>
                <small class="p-error" v-if="submitted && this.fileUpload2.files.length > maxFilesStoreImages">
                    The number of images of exceed the maximum: 2.
                </small>
            </span>
        </div>

        <template #footer>
          <pv-button :label="'Cancel'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="storeDialog = false; submitted = false;"/>
          <pv-button :label="'Save'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="submitted = true; sendData();"/>
        </template>
    </pv-dialog>

    <pv-dialog v-model:visible="deleteStoresDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="store.id">
                  Are you sure you want to delete <b>{{ store.name }}</b>?
              </span>
            <span v-else>
                  Are you sure you want to delete the stores selected?
              </span>
        </div>
        <template #footer>
            <pv-button :label="'No'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="deleteStoresDialog = false"/>
            <pv-button :label="'Yes'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="deleteSelectedStores"/>
        </template>
    </pv-dialog>





</template>


<script>
import {StoresApiService} from "@/learning/services/stores-api.service";
import {StoreImagesApiService} from "@/learning/services/storeImages.api.service";
import {FilterMatchMode} from "primevue/api";
import { storeGlobal } from '../store/store'

export default {
    data() {
        return {
            stores: [],
            selectedStores: null,
            storableSelectedStores: [],
            fileUpload1 : null,
            fileUpload2 : null,
            store:{},
            deleteStoresDialog: false,
            storeDialog: false,
            submitted: false,
            filters: {},
            base64Logo: null,
            maxFilesLogo: 1,
            base64StoreImages: [],
            maxFilesStoreImages: 2,
            storeService: null,
            storeImageService: null,
            storeAddedSuccessfully: false,
            storeGlobal,
            items:
                [
                    { label: "Stores/store", to: "/stores/store" },
                ],
        };
    },
    created(){

        this.storeService = new StoresApiService();
        this.storeImageService = new StoreImagesApiService();
        if(/*this.storeGlobal.goingToMyStores*/localStorage.getItem('MyStores') === 'true'){ //Going to My Stores
            this.storeService.getAllByUserId(this.storeGlobal.user.id).then((response) => {
                this.stores = response.data;

            });
        }
        else{ //Going to "Stores"
            if(this.storeGlobal.user === null || this.storeGlobal.user.roleId === 1){// Inexpert User
                this.storeService.getAll().then((response) => {
                    this.stores = response.data;
                });
            }
            else{ //Expert User
                this.storeService.getAll().then((response) => {
                    response.data.forEach(
                        (s) => {
                            if (s.userId !== this.storeGlobal.user.id)
                                this.stores.push(s);
                        }
                    );
                });
            }
        }

        this.initFilters();
    },
    methods: {
        openNew(){
            this.store = {};
            this.submitted = false;
            this.storeDialog = true;
        },
        goToStore(store){
            localStorage.setItem('Store', JSON.stringify(store));
            this.storeGlobal.store = JSON.parse(localStorage.getItem('Store'));
            //this.storeGlobal.store = store;
            this.$router.push('/stores/store');
            console.log(this.storeGlobal.store.name);
        },
        findIndexById(id) {
            console.log(`current id: ${id}`);
            return this.stores.findIndex((store) => store.id === id);
        },
        sendData() {
            const fileUpload1 = this.$refs.fileUploadRef1;
            const fileUpload2 = this.$refs.fileUploadRef2;
            this.fileUpload1 = fileUpload1;
            this.fileUpload2 = fileUpload2;
            const globalConditional = this.getGlobalConditional(fileUpload1, fileUpload2);
            console.log("Enter1");

            if (globalConditional){
                const selectedFiles1 = fileUpload1.files;
                const selectedFiles2 = fileUpload2.files;

                if(!this.store.id){ //CREATE
                    console.log("Enter2");

                    //FILE UPLOAD OF STORES' LOGO
                    const file = selectedFiles1[0];
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        //Logo of the Store
                        this.base64Logo = reader.result.split(",")[1];
                        this.store.Encoded64LogoImage = this.base64Logo;
                        this.store.UserId = this.storeGlobal.user.id;
                        this.storeService.add(this.store).then((response) => {
                            this.stores.push(response.data);
                            this.store = {};
                            this.storeDialog = false;
                            //Actualizar el $store.StoreId mediante el response**
                            //Images of the Store
                            for (let i = 0; i < selectedFiles2.length; i++) {
                                const file = selectedFiles2[i];
                                const reader = new FileReader();

                                reader.onloadend = () => {
                                    const storeImage = {};
                                    const base64Data = reader.result.split(",")[1];
                                    this.base64StoreImages.push(base64Data);
                                    storeImage.StoreId = response.data.id;
                                    storeImage.Enconded64Image = base64Data;
                                    this.storeImageService.add(storeImage).then((response) => {});
                                };

                                reader.onerror = (error) => {
                                    console.error("Error reading file as Base64:", error);
                                };

                                reader.readAsDataURL(file);
                            }

                        });
                    };
                    reader.readAsDataURL(file);
                }
                else { //EDIT
                    console.log("Enter3");
                    //Actualizamos el Store
                        const saveStoreResource = {};
                        saveStoreResource.name = this.store.name;
                        saveStoreResource.description = this.store.description;
                        saveStoreResource.address = this.store.address;
                        saveStoreResource.userId = this.store.userId;

                        const file = selectedFiles1[0];
                        const reader = new FileReader();

                        reader.onloadend = () => {
                            this.base64Logo = reader.result.split(",")[1];
                            saveStoreResource.encoded64LogoImage = this.base64Logo;
                            console.log(saveStoreResource.encoded64LogoImage);

                            this.storeService.update(this.store.id, saveStoreResource).then((response)=>{
                                //Actualizar los datos de la DataTable
                                this.stores[this.findIndexById(response.data.id)] = response.data;
                                //Delete Store Images
                                this.storeImageService.getAllByStoreId(response.data.id).then((response2) => {
                                    response2.data.forEach(
                                        (storeImage) => this.storeImageService.delete(storeImage.id).then((response)=>{})
                                    );
                                    this.store = {};
                                    this.storeDialog = false;
                                });

                                //Agregar las nuevas Store Images
                                for (let i = 0; i < selectedFiles2.length; i++) {
                                    const file = selectedFiles2[i];
                                    const reader = new FileReader();

                                    reader.onloadend = () => {
                                        const storeImage = {};
                                        const base64Data = reader.result.split(",")[1];
                                        this.base64StoreImages.push(base64Data);
                                        storeImage.StoreId = response.data.id;
                                        storeImage.Enconded64Image = base64Data;
                                        this.storeImageService.add(storeImage).then((response) => {});
                                    };

                                    reader.onerror = (error) => {
                                        console.error("Error reading file as Base64:", error);
                                    };

                                    reader.readAsDataURL(file);
                                }
                            });

                        };
                        reader.readAsDataURL(file);



                }//TERMINA EL "EDIT"


            }//TERMINA EL "IF GLOBAL CONDITIONAL"

        },

        deleteSelectedStores(){
            if(this.selectedStores.length > 0){ // Si se opto por selected tutorials
                this.storableSelectedStores = this.selectedStores;
            }
            //Delete Logic
            this.storableSelectedStores.forEach((store) => {
                this.storeService.delete(store.id)
                    .then((response) => {
                        this.stores = this.stores.filter(
                            (s) => s.id !== store.id
                        );
                        console.log(response);
                    });
                this.$toast.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Store Deleted",
                    life: 3000,
                });
            });

            this.deleteStoresDialog = false;
            this.selectedStores = []; //Por si acaso
            this.storableSelectedStores = [];
        },

        getImageUrl(base64Image) {
            return `data:image/png;base64, ${base64Image}`;
        },
        getGlobalConditional(fileUpload1, fileUpload2)
        {
            return this.store.name && this.store.description && this.store.address &&
            fileUpload1.files.length === 1 && fileUpload2.files.length <= this.maxFilesStoreImages
            && fileUpload2.files.length > 0;
        },
        initFilters() {
            this.filters = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            };
        }
  }




};
</script>
