<template>
    <div style="    position: sticky;top: 0;z-index: 999;">
        <b-navbar toggleable="lg" type="dark" variant="danger" sticky:true>

            <b-navbar-brand>
                <NuxtLink to="/" class="navbar-brand">
                    Logo
                </NuxtLink>
            </b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <li class="nav-item" v-if="userLoged">
                        <NuxtLink to="#carouselContainer" class="nav-link">
                            Recomendado |
                        </NuxtLink>
                    </li>
                    <li class="nav-item" v-if="userLoged">
                        <NuxtLink to="/productos" class="nav-link">
                            Productos |
                        </NuxtLink>
                    </li>
                    <li class="nav-item" v-if="userLoged">
                        <NuxtLink to="/menus" class="nav-link">
                            Menús
                        </NuxtLink>
                    </li>
                    <li class="nav-item" v-if="restaurantLoged">
                        <NuxtLink to="/record_menu" class="nav-link">
                            Añadir Menú |
                        </NuxtLink>
                    </li>
                    <li class="nav-item" v-if="restaurantLoged">
                        <NuxtLink to="/sign_in_product" class="nav-link">
                            Añadir Producto |
                        </NuxtLink>
                    </li>
                    <li class="nav-item" v-if="restaurantLoged">
                        <NuxtLink to="/sign_in_ingredient" class="nav-link">
                            Añadir Ingrediente
                        </NuxtLink>
                    </li>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-form>
                        <!-- <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input> -->
                        <!-- <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button> -->
                        <!-- <NuxtLink class="btn my-2 my-sm-0 btn-secondary btn-sm" to="/sign_in">
                            Sign In
                        </NuxtLink> -->
                        <!-- <b-nav-item-dropdown v-if="!logIn & !restaurantLoged">
                            <template #button-content>
                                    Registrarse
                            </template>
                                <b-dropdown-item href="#">
                                    <NuxtLink to="/Sign_in" class="dp-item-custom">Registrar Usuario</NuxtLink>
                                </b-dropdown-item>
                                <b-dropdown-item href="#">
                                    <NuxtLink to="/Sign_in_restaurant" class="dp-item-custom">Registrar Restaurante</NuxtLink>
                                </b-dropdown-item>
                        </b-nav-item-dropdown>-->
                        <NuxtLink v-if="!logIn & !restaurantLoged" class="nav-link" to="/Sign_in">
                            Registrarse
                        </NuxtLink>
                        <NuxtLink v-if="adminLoged" class="nav-link" to="/Sign_in_restaurant">
                            Registrar restaurante
                        </NuxtLink>

                        <NuxtLink v-if="!logIn" class="nav-link" to="/Log_in">
                            Ingresar
                        </NuxtLink>
                        <b-nav-item-dropdown v-if="userLoged">
                            <!-- Using 'button-content' slot -->
                            <template #button-content>
                                {{ name }}
                            </template>
                            <b-dropdown-item href="#">
                                <NuxtLink to="/cart" class="dp-item-custom">Carrito de compras</NuxtLink>
                            </b-dropdown-item>
                            <b-dropdown-item href="#">
                                <NuxtLink to="/pedidos" class="dp-item-custom">Pedidos</NuxtLink>
                            </b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item-dropdown v-if="restaurantLoged">
                            <!-- Using 'button-content' slot -->
                            <template #button-content>
                                {{ name }}
                            </template>
                            <b-dropdown-item href="#">
                                <NuxtLink to="/ingredientes" class="dp-item-custom">Ingredientes</NuxtLink>
                            </b-dropdown-item>
                            <b-dropdown-item href="#">
                                <NuxtLink to="/productos" class="dp-item-custom">Productos</NuxtLink>
                            </b-dropdown-item>
                            <b-dropdown-item href="#">
                                <NuxtLink to="/menus" class="dp-item-custom">Menús</NuxtLink>
                            </b-dropdown-item>
                            <b-dropdown-item href="#">
                                <NuxtLink to="/pedidosR" class="dp-item-custom">Pedidos</NuxtLink>
                            </b-dropdown-item>
                        </b-nav-item-dropdown>
                        <!-- <NuxtLink v-if="logIn" class="nav-link" to="/User">
                            {{ name }}
                        </NuxtLink> -->
                        <a href="#" v-if="logIn" class="nav-link" @click="removeToken">Cerrar Sesión</a>
                        <!-- <button >Cerrar Sesión</button> -->
                    </b-nav-form>

                    <!-- <b-nav-item-dropdown text="Lang" right>
                        <b-dropdown-item href="#">EN</b-dropdown-item>
                        <b-dropdown-item href="#">ES</b-dropdown-item>
                        <b-dropdown-item href="#">RU</b-dropdown-item>
                        <b-dropdown-item href="#">FA</b-dropdown-item>
                    </b-nav-item-dropdown> -->

                    <!-- <b-nav-item-dropdown right>
                         Using 'button-content' slot 
                        <template #button-content>
                            <em>User</em>
                        </template>
                        <b-dropdown-item href="#">Profile</b-dropdown-item>
                        <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                    </b-nav-item-dropdown> -->
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<style scoped>
.dp-item-custom {
    clear: both;
    font-weight: 400;
    color: #212529;
    text-align: inherit;
    white-space: nowrap;
    background-color: transparent;
    border: 0;
    text-decoration: none;
}
</style>

<script>
export default {
    name: 'Header',
    /*beforeMount() {
        //window.addEventListener("load", this.onLoad);
        this.onLoad();
        //window.addEventListener("beforeunload", this.onUnload);
    },*/
    mounted() {
        //window.addEventListener("load", this.onLoad);
        this.onLoad();
        //window.addEventListener("beforeunload", this.onUnload);
    },
    /*mounted() {

    },*/
    data() {
        return {
            logIn: true,
            name: '',
            userLoged: true,
            adminLoged: false,
            restaurantLoged: false
        }
    },
    methods: {
        removeToken() {
            localStorage.clear();
            this.logIn = false;
            //this.$router.push('/')
            window.location.href = 'http://localhost:3000/';

        },
        onLoad() {
            if (localStorage.getItem('token') != null) {
                this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
                this.name = localStorage.getItem('userName');
                this.logIn = true;
                if (localStorage.getItem('authorities') == 'Usuario') {
                    this.userLoged = true;
                }else if(localStorage.getItem('authorities') == 'Administrador'){
                    this.adminLoged = true;
                }else if(localStorage.getItem('authorities') == 'restaurante'){
                    this.restaurantLoged = true;
                }
            }
        }
    }
}
</script>