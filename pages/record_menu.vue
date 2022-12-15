<template>
    <div>
        <b-form @submit.prevent="onSubmit" @reset="onReset" v-if="show" class="formulario">
            <div v-if="submitted === true">
                <div v-if="hasErrors" class="error">
                    <strong>Se han producido los siguientes errores:</strong>
                    <ul>
                        <li v-for="error in errors">{{ error }}</li>
                    </ul>
                </div>
                <div v-else class="correcto">
                    <strong>Enviado!</strong>
                </div>
            </div>
            <b-form-group id="input-group-1" label="Nombre:" label-for="input-1">
                <b-form-input id="input-1" v-model="form.nombre" placeholder="Enter Name" required>
                </b-form-input>
            </b-form-group>

            <b-form-group id="input-group-3" label="Customizable:" label-for="input-3">
                <b-form-select id="input-3" v-model="form.customizable" :options="types" required></b-form-select>
            </b-form-group>

            <div>
                <legend>Entrada: <span v-if="selectedImagesEntrada.length > 0"
                        v-for="(image, idx) in selectedImagesEntrada" :key="idx">{{ image.alt }}</span></legend>
                <vue-select-image :dataImages="dataImagesEntrada" @onselectimage="onSelectImage" :is-multiple="true"
                    :selectedImages="initialSelected" :limit=1 @onselectmultipleimage="onSelectMultipleImageEntrada"
                    :h="'150px'" :w="'150px'">
                </vue-select-image>


                <legend>Plato Fuerte: <span v-if="selectedImagesPlatoFuerte.length > 0"
                        v-for="(image, idx) in selectedImagesPlatoFuerte" :key="idx">{{ image.alt }}</span></legend>
                <vue-select-image :dataImages="dataImagesPlatoFuerte" @onselectimage="onSelectImage" :is-multiple="true"
                    :selectedImages="initialSelected" :limit=1 @onselectmultipleimage="onSelectMultipleImagePlatoFuerte"
                    :h="'150px'" :w="'150px'">
                </vue-select-image>

                <legend>Postre: <span v-if="selectedImagesPostre.length > 0"
                        v-for="(image, idx) in selectedImagesPostre" :key="idx">{{ image.alt }}</span></legend>
                <vue-select-image :dataImages="dataImagesPostre" @onselectimage="onSelectImage" :is-multiple="true"
                    :selectedImages="initialSelected" :limit=1 @onselectmultipleimage="onSelectMultipleImagePostre"
                    :h="'150px'" :w="'150px'">
                </vue-select-image>

                <legend>Bebida: <span v-if="selectedImagesBebida.length > 0"
                        v-for="(image, idx) in selectedImagesBebida" :key="idx">{{ image.alt }}</span></legend>
                <vue-select-image :dataImages="dataImagesBebida" @onselectimage="onSelectImage" :is-multiple="true"
                    :selectedImages="initialSelected" :limit=1 @onselectmultipleimage="onSelectMultipleImageBebida"
                    :h="'150px'" :w="'150px'">
                </vue-select-image>

                <legend>Acompañamiento: <span v-if="selectedImagesAcompaniamiento.length > 0"
                        v-for="(image, idx) in selectedImagesAcompaniamiento" :key="idx">{{ image.alt }}</span></legend>
                <vue-select-image :dataImages="dataImagesAcompaniamiento" @onselectimage="onSelectImage"
                    :is-multiple="true" :selectedImages="initialSelected" :limit=1
                    @onselectmultipleimage="onSelectMultipleImageAcompaniamiento" :h="'150px'" :w="'150px'">
                </vue-select-image>
            </div>

            <b-form-group id="input-group-4" label="Precio:" label-for="input-4" :description="'Sugerido:' + precioSugerido">
                <b-form-input id="input-4" v-model="form.precio" placeholder="Enter price" @keypress="onlyNumber"
                    required>
                </b-form-input>
            </b-form-group>

            <b-form-group id="input-group-5" label="Foto:" label-for="input-5">
                <b-form-file id="input-5" type="file" v-model="form.picByte" @change="obtenerImagen($event)"
                    accept="image/*" placeholder="Pick a photo"></b-form-file>
            </b-form-group>
            <hr />

            <b-button type="submit" variant="primary">Submit</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
        <b-card class="mt-3" header="Form Data Result">
            <pre class="m-0">{{ form }}</pre>
        </b-card>

    </div>
</template>

<script>
import VueSelectImage from '../components/VueSelectImage.vue';
import Menu from '../model/Menu';

export default {
    name: "SelectImage",
    beforeMount() {
        //window.addEventListener("load", this.onLoad);
        this.onLoad();
    },/*
    async created() {
        //window.addEventListener("load", this.onLoad);
        this.onLoad();
    },*/
    mounted() {
        let recaptchaScript = document.createElement('script')
        recaptchaScript.setAttribute('src', '//cdn.jsdelivr.net/npm/sweetalert2@11')
        document.head.appendChild(recaptchaScript)
    },
    beforeDestroy() {
        window.removeEventListener("load", this.onLoad);
        window.removeEventListener("beforeunload", this.onUnload);
    },
    data() {
        return {
            form: {
                nombre: '',
                customizable: 'No',
                precio: null,
                picByte: null,
                productos: []
            },
            types: ['Si', 'No'],
            show: true,
            submitted: false,
            errors: [],
            //listaI: this.window.listaIngredientes
            selectedImagesEntrada: [],
            selectedImagesPlatoFuerte: [],
            selectedImagesPostre: [],
            selectedImagesBebida: [],
            selectedImagesAcompaniamiento: [],
            initialSelected: [],
            dataImagesEntrada: [],
            dataImagesPlatoFuerte: [],
            dataImagesPostre: [],
            dataImagesBebida: [],
            dataImagesAcompaniamiento: [],
            allProducts: [],
            listaIds: []
        };
    },
    computed: {
        hasErrors: function () {
            return !!this.errors.length;
        }
    },
    methods: {
        onSelectImage(img) {
            alert(`Selected image: ${img.alt}`);
        },
        obtenerImagen(e) {
            this.form.picByte = e.target.files[0];
            console.log(this.form.picByte);
        },
        onSelectMultipleImageEntrada(images) {
            this.selectedImagesEntrada = images;
            this.actualizarProductos();
            //alert("multiple selected");
        },
        onSelectMultipleImagePlatoFuerte(images) {
            this.selectedImagesPlatoFuerte = images;
            this.actualizarProductos();
            //alert("multiple selected");
        },
        onSelectMultipleImagePostre(images) {
            this.selectedImagesPostre = images;
            this.actualizarProductos();
            //alert("multiple selected");
        },
        onSelectMultipleImageBebida(images) {
            this.selectedImagesBebida = images;
            this.actualizarProductos();
            //alert("multiple selected");
        },
        onSelectMultipleImageAcompaniamiento(images) {
            this.selectedImagesAcompaniamiento = images;
            this.actualizarProductos();
            //alert("multiple selected");
        },
        actualizarProductos() {
            this.form.productos = this.selectedImagesEntrada.concat(this.selectedImagesPlatoFuerte, this.selectedImagesPostre, this.selectedImagesBebida, this.selectedImagesAcompaniamiento);
        },
        onSubmit(event) {
            event.preventDefault()
            this.errors = [];
            this.submitted = true;
            alert(JSON.stringify(this.form))
            const productosMenu = this.allProducts.filter(product => this.form.productos.some(d => d.id === product.idProducto))
            var personalizable = false;
            if (this.form.customizable == 'Si') {
                personalizable = true
            }
            var menu = new Menu(this.form.nombre, personalizable, this.form.precio, restaurante.nit, productosMenu);
            //producto.producto_ingredientes = this.form.ingredients;
            let url = "http://localhost:8080/menus/newmenu";
            
            if (this.form.picByte != null) {
                const uploadData = new FormData();
                uploadData.append('imageFile', this.form.picByte, this.form.picByte.name);
                this.$axios.$post("http://localhost:8080/menus/upload", uploadData)
                    .then(res => {
                        console.log(res);
                        if (res.mensaje == "200") {
                            console.log('subi la imagen')
                            this.message2 = 'Image uploaded successfully';
                            //producto.producto_ingredientes = this.ingredients;
                            this.$axios.$post(url, menu)
                                .then(response => {
                                    console.log(response);
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Exito',
                                        text: 'Menu recibido',
                                    })
                                    return true;
                                })
                                .catch(response => console.log(response), error => {
                                    this.errorMessage = error.message;
                                    console.error("There was an error!", error);
                                });
                        } else {
                            console.log('f');
                            console.log(res.status);
                            this.message2 = 'Image not uploaded successfully';
                        }
                    }).catch((promise) => {
                        console.log(promise)
                        this.handleError(promise)
                    }
                    );
            } else {
                this.$axios.$post(url, menu)
                    .then(response => {
                        console.log(response);
                        Swal.fire({
                            icon: 'success',
                            title: 'Exito',
                            text: 'Menu recibido',
                         })
                        return true;
                    })
                    .catch(response => console.log(response), error => {
                        this.errorMessage = error.message;
                        console.error("There was an error!", error);
                    });
            }
        },
        onReset(event) {
            event.preventDefault()
            // Reset our form values
            this.form.nombre = ''
            this.form.tipo = null
            this.form.customizable = false
            this.form.precio = null
            this.form.picByte = null
            this.form.checked = []
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        },
        onlyNumber($event) {
            //console.log($event.keyCode); //keyCodes value
            let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
            if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
                $event.preventDefault();
            }
        },
        onLoad() {
            if (localStorage.getItem('token') != null) {
                this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
                if (localStorage.getItem('authorities') != 'restaurante') {
                    alert("Debe iniciar sesión como restaurante!");
                    this.$router.push('/log_in')
                } else {
                    this.$axios.$get('http://localhost:8080/restaurantes/get').then(
                        res => {
                            let i_restaurants = res;
                            window.restaurante = i_restaurants.find(r => {
                                return r.nombre == localStorage.getItem('userName');
                            });
                            let url = "http://localhost:8080/productos/getProducts?nit=" + restaurante.nit;
                            this.$axios.$get(url).then(
                                res => {
                                    //console.log(res);
                                    this.allProducts = res;
                                    res.forEach(element => {
                                        this.listaIds.push(element.idProducto);
                                        if (element.tipo == "Entrada") {
                                            this.dataImagesEntrada.push({
                                                id: element.idProducto,
                                                src: 'data:image/jpeg;base64,' + element.picByte,
                                                alt: element.nombre,
                                                price: element.precio
                                            });
                                        } else if (element.tipo == "Plato Fuerte") {
                                            this.dataImagesPlatoFuerte.push({
                                                id: element.idProducto,
                                                src: 'data:image/jpeg;base64,' + element.picByte,
                                                alt: element.nombre,
                                                price: element.precio
                                            });
                                        } else if (element.tipo == "Postre") {
                                            this.dataImagesPostre.push({
                                                id: element.idProducto,
                                                src: 'data:image/jpeg;base64,' + element.picByte,
                                                alt: element.nombre,
                                                price: element.precio
                                            });
                                        } else if (element.tipo == "Bebida") {
                                            this.dataImagesBebida.push({
                                                id: element.idProducto,
                                                src: 'data:image/jpeg;base64,' + element.picByte,
                                                alt: element.nombre,
                                                price: element.precio
                                            });
                                        } else if (element.tipo == "Acompañamiento") {
                                            this.dataImagesAcompaniamiento.push({
                                                id: element.idProducto,
                                                src: 'data:image/jpeg;base64,' + element.picByte,
                                                alt: element.nombre,
                                                price: element.precio
                                            });
                                        }
                                    });
                                }
                            ).catch(response => console.log(response), error => {
                                this.errorMessage = error.message;
                                console.error("There was an error!", error);
                            });
                        }
                    ).catch(response => console.log(response), error => {
                        this.errorMessage = error.message;
                        console.error("There was an error!", error);
                    });


                    //const restaurante = new Restaurante(this.form.nit, this.form.name, this.form.telefono, this.form.especialidad, this.form.email,this.form.password);
                }
            } else {
                alert("Debe iniciar sesión como restaurante!");
                this.$router.push('/log_in')
            }
        }
    },
    computed:{
        precioSugerido(){
            let price = 0;
            this.form.productos.forEach(p => {
                price += p.price;
            })
            this.form.precio = price;
            return price;
        }
    },
    components: {
        VueSelectImage
    },
};
</script>