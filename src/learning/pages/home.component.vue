<!--<template>
  <div class="flex p-8 h-30rem justify-content-around">
    <div class="flex flex-column bg-blue-500" >
        <pv-button class="p-button-text text-orange-700"  @click="goToStores()">Stores</pv-button>
    </div>
    <div class="flex flex-column bg-blue-500">
        <pv-button class="p-button-text text-orange-700"  @click="goToResources()">Resources</pv-button>
    </div>
  </div>
</template>-->
<template>

    <div class="pantalla">
        <div class="container3">
            <div class="column">
                <div class="contenido">
                    <p class="titulo">Tiendas</p>
                    <p class="descripcion">
                        Explora nuestras tiendas afiliadas y rodéate de los mejores
                        productos del mercado. Podrás visitar todo el catálogo de productos
                        de numerosas tiendas a nivel nacional e internacional. Además,
                        estate pendiente de las promociones únicas de cada tienda.
                    </p>
                    <div class="flex flex-column bg-blue-500" >
                        <pv-button class="p-button-text text-orange-700"  @click="goToStores()" style="color:black">Tiendas</pv-button>
                    </div>
                </div>
            </div>

            <div class="column">
                <div class="contenido">
                    <p class="titulo">Biblioteca</p>
                    <p class="descripcion">
                        Navega mediante numerosas fuentes de información acerca de los
                        componentes de hardware o software que más te interesan. No te
                        pierdas la información detallada en forma de guías, artículos,
                        videos, etc. ¿Qué esperas?
                    </p>
                    <div class="flex flex-column bg-blue-500">
                        <pv-button class="p-button-text text-orange-700"  @click="goToResources()">Recursos</pv-button>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>


<script>
import {storeGlobal} from "@/learning/store/store";
export default {
  data() {
    return {
      items:
          [
            { label: "Stores", to: "/stores" },
            { label: "Resources", to: "/resources" },
            { label: "Community", to: "/community" }
          ],
        storeGlobal
    };
  },
    created() {
    },
    methods: {
        goToStores(){
            localStorage.setItem('MyStores', 'false');
            this.storeGlobal.goingToMyStores = localStorage.getItem('MyStores');
            this.$router.push('/my-stores');
        },
        goToResources(){
            localStorage.setItem('MyArticles', 'false');
            this.storeGlobal.goingToMyArticles = localStorage.getItem('MyArticles');
            this.$router.push('/resources');
        }
    }
}
</script>

<style>
.pantalla {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 85vh;
}

.container3 {
    width: 80%;
    display: flex;
    justify-content: center;
    height: 60vh;
    border: solid 2px #9b4e00;
}

.column {
    flex: 1;
    height: 100%;
    background-position: center;
    background-size: cover;
    position: relative;
}

.column:nth-child(1) {
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("../../assets/home1.jpg");
}

.column:nth-child(2) {
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("../../assets/home2.jpeg");
}

.column:nth-child(3) {
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("../../assets/img/home3.jpg");
}

.column .contenido {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.column .titulo {
    color: white;
    font-size: 2rem;
    font-weight: bold;
}

.column .descripcion {
    color: white;
}

@media (max-width: 1285px) {
    .pantalla {
        padding-top: 30vh;
    }
    .container {
        flex-direction: column;
        height: 100vh;
    }

    .column {
        padding: 3px;
        width: 100%;
        height: auto;
    }
}
</style>
