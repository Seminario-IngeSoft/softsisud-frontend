<template>
    <div id="carritob" style="margin-top:10px;">
        <h2 id="titulo-tabla">Carrito de compras</h2>
        <table id="main-container">
            <thead>
                <tr>
                    <th>
                        <b-icon-card-image></b-icon-card-image>
                    </th>
                    <th>Nombre </th>
                    <th>Tipo</th>
                    <th>Componentes </th>
                    <th>Cantidad</th>
                    <th>Precio por unidad</th>
                    <th>Precio Total</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tr v-for="(dataItem, index) in dataItemsLocal" :key="index">
                <td><img :src="'data:image/jpeg;base64,' + dataItem.picByte" class="imagen_carro" /></td>
                <td>
                    {{ dataItem.nombre }}
                </td>
                <td v-if="dataItem.hasOwnProperty('tipo')">
                    {{ dataItem.tipo }}
                </td>
                <td v-else>
                    Menú
                </td>
                <td>
                    <b-list-group style="max-width: 400px; margin: 0 auto;">
                        <b-list-group-item v-for="(dataItem2, index2) in dataItem.componentes" :key="index2"
                            class="d-flex justify-content-between align-items-center"
                            style="background-color: inherit; border: none;">
                            {{ dataItem2.nombre }}
                            <b-badge v-if="dataItem.hasOwnProperty('tipo')" variant="primary" pill>{{ dataItem2.cantidad
                            }}{{ dataItem2.unidadMedida }}
                            </b-badge>
                            <b-badge v-else variant="primary" pill>{{ dataItem2.tipo }}
                            </b-badge>
                        </b-list-group-item>
                    </b-list-group>
                </td>
                <td>
                    {{ dataItem.cantidad }}
                </td>
                <td>
                    {{ formatPrice(dataItem.precio) }}
                </td>
                <td>
                    {{ formatPrice(dataItem.precio * dataItem.cantidad) }}
                </td>
                <td>
                    <span @click="removeItemFromCart(dataItem.idProducto)" style="cursor: pointer">
                        <b-icon-x-circle-fill variant="danger"></b-icon-x-circle-fill>
                    </span>
                </td>
            </tr>
        </table>
        <br>
        <h2 class="monto">Monto Total: <b class="text-green">
                {{ formatPrice(precioTotal) }}
            </b></h2>
        <form @submit.stop.prevent="handleSubmit" style="text-align: center;max-width: 70%; margin: 20px auto;">
            <b-form-group id="input-group-1" label="Dirección:" label-for="input-1"
                description="Dirección de entrega del pedido">
                <b-form-input id="input-1" v-model="direccion" placeholder="Ingrese dirección" required>
                </b-form-input>
            </b-form-group>
            <b-button variant="success" type="submit">Realizar pedido</b-button>
        </form>
    </div>
</template>


<script>
import { BIcon, BIconXCircleFill, BIconCardImage } from 'bootstrap-vue';
import Pedido from '../model/Pedido';
export default {
    mounted() {
        this.onLoad();
    },
    data() {
        return {
            dataItemsLocal: [],
            direccion: ''
        }
    },
    methods: {
        onLoad() {
            if (localStorage.getItem('token') != null) {
                this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
                if (localStorage.getItem('authorities') != 'Usuario') {
                    alert("Debe iniciar sesión como Usuario!");
                    this.$router.push('/log_in')
                }
                let cartData = [];
                //retrieve cart data from localstorage
                let data = sessionStorage.getItem('cart');
                //parse it to json
                if (data !== null) {
                    cartData = JSON.parse(data);
                }
                this.dataItemsLocal = cartData;
            }

        },
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        removeItemFromCart(productId) {
            let cartData = [];
            let data = sessionStorage.getItem('cart');
            //parse it to json
            if (data !== null) {
                cartData = JSON.parse(data);
            }
            const found = cartData.find(element => element.idProducto === productId);
            var i = cartData.indexOf(found);

            if (i !== -1) {
                cartData.splice(i, 1);
            }
            sessionStorage.setItem('cart', JSON.stringify(cartData));
            data = sessionStorage.getItem('cart');
            //updated the cartGames
            cartData = JSON.parse(data);
            window.cartProducts = cartData;
            this.dataItemsLocal = cartData;
            this.$bvToast.toast('Eliminado del carrito', {
                title: 'Éxito',
                variant: 'success',
                solid: true
            });
        },
        handleSubmit() {
            var restaurants = [];
            let url = "http://localhost:8080/pedidos/newpedido?productos=";
            let productos = '';
            let menus = '';
            this.dataItemsLocal.forEach(element => {
                if (!restaurants.some(r => r.nit === element.restaurant.nit)) {
                    restaurants.push(element.restaurant);
                }
                console.log("Restaurantes:", restaurants)
                if (element.type_id == "producto") {
                    productos = productos.concat(element.idProducto, ",", element.cantidad, ",")
                }
                if (element.type_id == "menu") {
                    menus = menus.concat(element.idMenu, ",", element.cantidad, ",")
                }
            });
            productos = productos.substring(0, productos.length - 1);
            menus = menus.substring(0, menus.length - 1);

            url = url.concat(productos, "&menus=", menus);
            console.log(url);
            var dateString = new Date().toISOString().substring(0, 10);
            var pedido = new Pedido(this.precioTotal, this.direccion, dateString, Number(localStorage.getItem('id')), restaurants);
            console.log(pedido);
            this.$axios.$post(url, pedido).then(res => {
                console.log(res);
                this.$bvToast.toast('Pedido Realizado correctamente', {
                    title: 'Éxito',
                    variant: 'success',
                    solid: true
                });
                this.dataItemsLocal = [];
                sessionStorage.clear();
            }).catch(err => {
                console.log(err);
            });
        }
    },
    components: {
        BIcon,
        BIconXCircleFill,
        BIconCardImage
    },
    computed: {
        precioTotal() {
            let precio = 0;
            this.dataItemsLocal.forEach(element => {
                precio += element.precio * element.cantidad;
            });
            return precio;

        }
    }
}

</script>