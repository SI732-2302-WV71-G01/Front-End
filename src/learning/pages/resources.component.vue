<template>
    <pv-data-view v-if="articles.length > 0" :value="articles" paginator :rows="5">
        <template #list="slotProps">
            <div class="col-12">

                <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">

                    <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div class="text-2xl font-bold text-900">
                                <pv-button class="p-button-text text-orange-700"  @click="goToArticle(slotProps.data)">{{slotProps.data.name}}</pv-button>
                            </div>
                            <div class="text-100 text-900">{{ slotProps.data.description }}</div>
                        </div>
                        <!-- ICONS -->
                        <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">

                            <pv-button v-if="storeGlobal.goingToMyArticles === 'true' "
                                       icon="pi pi-pencil" class="p-button-success" rounded
                                       @click="this.article = {...slotProps.data} ; articleDialog = true;"></pv-button>
                            <pv-button v-if="storeGlobal.goingToMyArticles === 'true' "
                                       icon="pi pi-trash"  class="p-button-danger" rounded
                                       @click ="deleteArticleDialog = true; this.article = slotProps.data"></pv-button>
                        </div>
                    </div>
                </div>

            </div>
        </template>
    </pv-data-view>
    <div v-if="articles.length === 0 && this.storeGlobal.goingToMyArticles === 'true'" class="flex justify-content-center align-items-center h-30rem min-w-screen">
        <div class="flex flex-column justify-content-center h-20rem w-20rem p-3 shadow-1">
            <h2 class="inline-flex justify-content-center">No tienes artículos escritos aún</h2>
            <p class="inline-flex justify-content-center">
                Empieza a escribir uno y ayuda a la comunidad inexperta</p>
            <pv-button :label="'Nuevo Artículo'.toUpperCase()" icon="pi pi-file-edit" class="p-button-icon"
                       @click="openNew()"/>
        </div>
    </div>

    <pv-button v-if="storeGlobal.goingToMyArticles === 'true'"
               label="New Article" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew()"/>

    <pv-dialog v-model:visible="articleDialog" :style="{ width: '450px' }"
               header="Article Information" :modal="true" class="p-fluid">
        <div class="field mt-3">
                    <span class="p-float-label">
                        <i class="pi pi-bookmark-fill"></i>
                        <pv-input-text type="text" id="name" v-model.trim="article.name" required="true"
                                       autofocus :class="{ 'p-invalid': submitted && !article.name }"/>
                        <label for="name">Article Name</label>
                        <small class="p-error" v-if="submitted && !article.name">
                          The name of the article is required.
                        </small>
                    </span>
        </div>

        <div class="field mt-3">
                    <span class="p-float-label">
                        <i class="pi pi-file-edit"></i>
                        <pv-input-text type="text" id="description" v-model.trim="article.description" required="true"
                                       autofocus :class="{ 'p-invalid': submitted && !article.description }"/>
                        <label for="description">Article Description</label>
                        <small class="p-error" v-if="submitted && !article.description">
                          The description of the article is required.
                        </small>
                    </span>
        </div>

        <template #footer>
            <pv-button :label="'Cancel'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="articleDialog = false; submitted = false;"/>
            <pv-button :label="'Save'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="submitted = true; saveArticle();"/>
        </template>
    </pv-dialog>

    <!--DELETE ARTICLE DIALOG-->
    <pv-dialog v-model:visible="deleteArticleDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>
                  Are you sure you want to delete <b>{{ article.name }}</b>?
            </span>
        </div>
        <template #footer>
            <pv-button :label="'No'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="deleteArticleDialog = false"/>
            <pv-button :label="'Yes'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="deleteArticle"/>
        </template>
    </pv-dialog>
</template>


<script>
import {ArticlesApiService} from "@/learning/services/articles-api.service";
import {storeGlobal} from "@/learning/store/store";

export default {
    data(){
        return{
            article: {},
            articles: [],
            articleDialog: false,
            submitted: false,
            deleteArticleDialog: false,
            articleService: null,
            storeGlobal
        };
    },
    created() {
        this.articleService = new ArticlesApiService();
        if(localStorage.getItem('MyArticles') === 'true'){ //Going to My Stores
            this.articleService.getAllByUserId(this.storeGlobal.user.id).then((response) => {
                this.articles = response.data;

            });
        }
        else{ //Going to "Stores"
            if(this.storeGlobal.user === null || this.storeGlobal.user.roleId === 1){// Inexpert User
                this.articleService.getAll().then((response) => {
                    this.articles = response.data;
                });
            }
            else{ //Expert User
                this.articleService.getAll().then((response) => {
                    response.data.forEach(
                        (a) => {
                            if (a.userId !== this.storeGlobal.user.id)
                                this.articles.push(a);
                        }
                    );
                });
            }
        }
    },
    methods:{
        openNew(){
            this.articleDialog = true;
            this.article = {};
        },
        saveArticle(){
            if(this.article.name && this.article.description){
                if(!this.article.id){ //Save
                    this.article.userId = this.storeGlobal.user.id;
                    this.articleService.add(this.article).then((response)=> {
                        this.articles.push(response.data);
                        this.article = {};
                        this.articleDialog = false;
                    })
                }
                else{//Edit
                    this.article.userId = this.storeGlobal.user.id;
                    this.articleService.update(this.article.id, this.article).then((response) => {
                        this.articles[this.findIndexById(response.data.id)] = response.data;
                        this.article = {};
                        this.articleDialog = false;
                    });
                }
            }
        },
        deleteArticle(){
            this.articleService.delete(this.article.id).then((response) => {
                this.articles = this.articles.filter(
                    (p) => p.id !== response.data.id
                );
                this.$toast.add({
                    severity: "success",
                    summary: "Successful",
                    detail: "Article Deleted",
                    life: 3000,
                });
                this.deleteArticleDialog = false;
            });
        },
        findIndexById(id) {
            return this.articles.findIndex((article) => article.id === id);
        },
        goToArticle(article){
            localStorage.setItem('Article', JSON.stringify(article));
            this.storeGlobal.store = JSON.parse(localStorage.getItem('Article'));
            this.$router.push('/articles/article');
            console.log(this.storeGlobal.store.name);
        }

    }
}
</script>
