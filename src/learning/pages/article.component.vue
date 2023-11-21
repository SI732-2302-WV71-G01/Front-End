<template>
    <div class="p-3 text-center">
        <header class="flex-column justify-content-center">
            <h1>{{storeGlobal.article.name}}</h1>
            <p class="p-text-secondary">Redactado por: {{this.articleUserRedacter.username}}</p>
        </header>
        <pv-divider></pv-divider>
        <p>{{storeGlobal.article.description}}</p>
        <pv-divider></pv-divider>

        <!--COMMENTS-->
        <pv-button v-if="this.storeGlobal.user && this.storeGlobal.article.userId !== this.storeGlobal.user.id"
                   label="New Comment" icon="pi pi-plus" class="p-button mr-2" @click="openNew()"/>
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
                                       autofocus :class="{ 'p-invalid': submitted && !comment.content }"/>
                        <label for="content">Comment Content</label>
                        <small class="p-error" v-if="submitted && !comment.content">
                          The content of the comment is required.
                        </small>
                    </span>
            </div>

            <template #footer>
                <pv-button :label="'Cancel'.toUpperCase()" icon="pi pi-times" class="p-button-text" @click="commentDialog = false; submitted = false;"/>
                <pv-button :label="'Save'.toUpperCase()" icon="pi pi-check" class="p-button-text" @click="submitted = true; saveComment();"/>
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
import {storeGlobal} from "../store/store";
import {CommentsApiService} from "@/learning/services/comments-api.service";
import {UsersApiService} from "@/learning/services/users-api.service";
export default {

    data(){
        return{
            articleUserRedacter:{},
            submitted:false,
            commentDialog: false,
            commentService: null,
            userService: null,
            deleteCommentDialog: false,
            storeGlobal,
            comment: {},
            comments : [],
        };
    },
    created(){
        console.log('article id', this.storeGlobal.article.id)
        this.userService = new UsersApiService();
        this.userService.getById(this.storeGlobal.article.userId).then((response)=>{
            this.articleUserRedacter = response.data;
        });
        this.commentService = new CommentsApiService();
        this.commentService.getAllByArticleId(this.storeGlobal.article.id).then((response)=>{
            this.comments = response.data;
        });
    },
    methods:{
        openNew(){
            this.commentDialog = true;
            this.comment = {};
        },
        saveComment(){
            if(this.comment.content ){ //Validation

                if(!this.comment.id){ //Save
                    this.comment.username = this.storeGlobal.user.username;
                    this.comment.articleId = this.storeGlobal.article.id;
                    this.comment.storeId = 0;
                    this.commentService.add(this.comment).then((response)=> {
                        this.comments.push(response.data);
                        this.comment = {};
                        this.commentDialog = false;
                    })
                }
                else{//Edit
                    this.comment.username = this.storeGlobal.user.username;
                    this.comment.articleId = this.storeGlobal.article.id;
                    this.comment.storeId = 0;
                    this.commentService.update(this.comment.id, this.comment).then((response) => {
                        this.comments[this.findIndexById(response.data.id)] = response.data;
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
        findIndexById(id) {
            console.log(`current id: ${id}`);
            return this.comments.findIndex((comment) => comment.id === id);
        },
    }
}
</script>
