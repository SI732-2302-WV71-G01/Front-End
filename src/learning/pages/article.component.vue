<template>
    <div class="p-3 text-center">
        <header class="flex justify-content-center">
            <h1>{{storeGlobal.article.name}}</h1>
        </header>
        <pv-divider></pv-divider>
        <p>{{storeGlobal.article.description}}</p>

    </div>
</template>


<script>
import {storeGlobal} from "../store/store";
export default {

    data(){
        return{
            storeGlobal
        };
    },
    created(){

    },
    methods:{

    }
}
</script>
