<template>
    <div id="carritob" style="margin: 20px 0;">
        <h2 id="titulo-tabla">Mis pedidos</h2>
        <table id="main-container">
            <thead>
                <tr>
                    <th>ID </th>
                    <th>Dirección</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Ver detalle</th>
                </tr>
            </thead>
            <tr v-for="(dataItem, index) in dataItemsLocal" :key="index">
                <td>
                    {{ dataItem.idPedido }}
                </td>
                <td>
                    {{ dataItem.direccion }}
                </td>
                <td>
                    {{ dataItem.fecha }}
                </td>
                <td>
                    {{ formatPrice(dataItem.monto) }}
                </td>
                <td>
                    <span v-b-modal.modal-prevent-closing-orders @click="viewDetails(dataItem.idPedido)"
                        style="cursor: pointer">
                        <b-icon-eye variant="info"></b-icon-eye>
                    </span>
                </td>
            </tr>
        </table>
        <b-modal id="modal-prevent-closing-orders" hide-footer :size="'xl'">
            <template #modal-title>
                Pedido {{ selected.idPedido }}
            </template>
            <div class="d-block text-center">
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
                        </tr>
                    </thead>
                    <tr v-for="(productItem, index2) in selected.productos" :key="'p-'+index2">
                        <td><img :src="'data:image/jpeg;base64,' + productItem.picByte" class="imagen_carro" /></td>
                        <td>
                            {{ productItem.nombre }}
                        </td>
                        <td>
                            {{ productItem.tipo }}
                        </td>
                        <td>
                            <b-list-group style="max-width: 400px; margin: 0 auto;">
                                <b-list-group-item v-for="(ingredientItem, index3) in productItem.ingredientes" :key="'i-'+index3"
                                    class="d-flex justify-content-between align-items-center"
                                    style="background-color: inherit; border: none;">
                                    {{ ingredientItem.nombre }}
                                    <b-badge variant="primary" pill>{{
                                            ingredientItem.cantidad
                                    }}{{ ingredientItem.unidadMedida }}
                                    </b-badge>
                                </b-list-group-item>
                            </b-list-group>
                        </td>
                        <td>
                            {{ productItem.cantidad }}
                        </td>
                        <td>
                            {{ formatPrice(productItem.precio) }}
                        </td>
                        <td>
                            {{ formatPrice(productItem.precio * productItem.cantidad) }}
                        </td>
                    </tr>
                    <tr v-for="(menuItem, index4) in selected.menus" :key="'m-'+index4">
                        <td><img :src="'data:image/jpeg;base64,' + menuItem.picByte" class="imagen_carro" /></td>
                        <td>
                            {{ menuItem.nombre }}
                        </td>
                        <td>
                            Menú
                        </td>
                        <td>
                            <b-list-group style="max-width: 400px; margin: 0 auto;">
                                <b-list-group-item v-for="(product2Item, index5) in menuItem.productos" :key="'mp-'+index5"
                                    class="d-flex justify-content-between align-items-center"
                                    style="background-color: inherit; border: none;">
                                    {{ product2Item.nombre }}
                                    <b-badge variant="primary" pill>{{
                                            product2Item.tipo
                                    }}
                                    </b-badge>
                                </b-list-group-item>
                            </b-list-group>
                        </td>
                        <td>
                            {{ menuItem.cantidad }}
                        </td>
                        <td>
                            {{ formatPrice(menuItem.precio) }}
                        </td>
                        <td>
                            {{ formatPrice(menuItem.precio * menuItem.cantidad) }}
                        </td>
                    </tr>
                </table>
                <br>
                <h2 class="monto" style="margin-right: 40px;">Monto Total: <b class="text-green">
                        {{ formatPrice(selected.monto) }}
                    </b></h2>
            </div>
            <b-button class="mt-3" block @click="$bvModal.hide('modal-prevent-closing-orders')">Close</b-button>
        </b-modal>
    </div>
</template>

<script>
import { BIcon, BIconEye, BIconCardImage } from 'bootstrap-vue';
import Pedido from '../model/Pedido';
export default {
    mounted() {
        this.onLoad();
    },
    data() {
        return {
            dataItemsLocal: [],
            direccion: '',
            selected: {}
        }
    },
    methods: {
        onLoad() {
            if (localStorage.getItem('token') != null) {
                this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
                if (localStorage.getItem('authorities') != 'restaurante') {
                    alert("Debe iniciar sesión como Restaurante!");
                    this.$router.push('/log_in')
                }
                let url = 'http://localhost:8080/pedidos/getPedidosR?nit=' + localStorage.getItem('id');
                this.$axios.$get(url).then(res => {
                    res.forEach(element => {
                        element.productos = [];
                        element.menus = [];
                        this.$axios.$get('http://localhost:8080/productos/getPedidoProducts?idp=' + element.idPedido).then(res2 => {
                            res2.forEach(product => {
                                this.$axios.$get('http://localhost:8080/ingredientes/getIngredients?pid=' + product.idProducto).then(res3 => {
                                    product.ingredientes = res3;
                                }).catch(err => {
                                    console.log(err);
                                });
                                element.productos.push(product);
                            });
                        }).catch(err => {
                            console.log(err);
                        });
                        this.$axios.$get('http://localhost:8080/menus/getPedidoMenus?idp=' + element.idPedido).then(res4 => {
                            res4.forEach(menu => {
                                this.$axios.$get('http://localhost:8080/productos/getMenuProducts?idm=' + menu.idMenu).then(res5 => {
                                    menu.products = res5;
                                }).catch(err => {
                                    console.log(err);
                                });
                                element.menus.push(menu);
                            });
                        }).catch(err => {
                            console.log(err);
                        });
                        this.dataItemsLocal.push(element);
                    });
                    console.log(this.dataItemsLocal);
                }).catch(err => {
                    console.log(err);
                });

            }

        },
        formatPrice(value) {
            let val = (value / 1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        viewDetails(orderId) {
            this.selected = this.dataItemsLocal.find(o => o.idPedido == orderId);
            console.log(this.selected);
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
            }).catch(err => {
                console.log(err);
            });
        }
    },
    components: {
        BIcon,
        BIconEye,
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