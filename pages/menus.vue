<template>
    <div style="margin-top: 20px;">
        <legend>Menus:</legend>
        <listado-items :dataItems="dataItemsMenus" id="menus"></listado-items>
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
            allMenus: [],
            dataItemsMenus: [],
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
                    this.$axios.$get('http://localhost:8080/restaurantes/get').then(
                        res => {
                            let i_restaurants = res;
                            let restaurante = i_restaurants.find(r => {
                                return r.nombre == localStorage.getItem('userName');
                            });
                            let url = "http://localhost:8080/menus/get";
                            this.$axios.$get(url).then(res2 => {
                                var filtrados = res2.filter(obj => obj.restaurantNit == restaurante.nit);
                                filtrados.forEach(element => {
                                    if (element.personalizable == false) {
                                        element.personalizable = 'No'
                                    } else {
                                        element.personalizable = 'Si'
                                    };
                                    this.allMenus.push({
                                        id: element.idMenu,
                                        src: 'data:image/jpeg;base64,' + element.picByte,
                                        tipo: element.personalizable,
                                        alt: element.nombre,
                                        price: element.precio,
                                        nombre_restaurante: localStorage.getItem('userName')
                                    });
                                });
                                this.dataItemsMenus = this.allMenus;
                            }).catch(response => console.log(response), error => {
                                this.errorMessage = error.message;
                                console.error("There was an error!", error);
                            });
                        }
                    ).catch(response => console.log(response), error => {
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
