<template>
    <div style="margin-top: 20px;">
        <legend>Ingredientes:</legend>
        <b-list-group style="max-width: 400px; margin: 0 auto;">
            <b-list-group-item v-for="(dataItem, index) in dataItemsIngredients" :key="index"
                class="d-flex justify-content-between align-items-center">
                {{ dataItem.nombre }}
                <b-badge variant="primary" pill>{{ dataItem.unidades }}{{ dataItem.unidadMedida }}</b-badge>
            </b-list-group-item>
        </b-list-group>
    </div>

</template>

<script>
/**export default {
  name: 'IndexPage'
}**/
import ListadoItems from '../components/ListadoItems.vue';

export default {

    /*beforeMount() {
      window.addEventListener("load", this.onLoad);
    },*/
    mounted() {
        this.onLoad();
    },
    data() {
        return {
            dataItemsIngredients: []
        }
    },
    computed: {

    },
    methods: {
        onLoad() {
            console.log(localStorage.getItem('token'))
            console.log(localStorage.getItem('authorities'))
            if (localStorage.getItem('token') != null) {
                this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
                if (localStorage.getItem('authorities') != 'restaurante') {
                    alert("Debe iniciar sesión como restaurante!");
                    window.location.href = 'http://localhost:3000/log_in';
                } else {
                    this.$axios.$get('http://localhost:8080/ingredientes/get').then(
                        res => {
                            this.dataItemsIngredients = res;
                        }).catch(response => console.log(response), error => {
                            this.errorMessage = error.message;
                            console.error("There was an error!", error);
                        });
                }

            }
        }
    },
    components: {
        ListadoItems
    }
}
</script>
