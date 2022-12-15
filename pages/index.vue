<template>
  <div>
    <!-- <Tutorial /> -->
    <div class="jumbotron fluid" id="indexJumbotron">
      <div class="row">
        <div class="col-5">
          <div>
            <h1 class="display-4">Consorcio de Comidas a Domicilio</h1>
            <p class="lead">
              Pide domicilio tus comidas y productos de preferencia. Tus
              restaurantes favoritos están en SoftSisUD, donde te garantizamos el
              mejor servicio en todo el país.
            </p>
          </div>
        </div>
        <div class="col-7" id="header_img"></div>
      </div>
    </div>
    <!--  -->

    <div>
      <b-carousel
        id="carousel-1"
        v-model="slide"
        :interval="4000"
        controls
        indicators
        background="#ababab"
        img-width="1024"
        img-height="280"
        style="text-shadow: 1px 1px 2px #333"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <!-- Text slides with image -->
        <b-carousel-slide
          width="1024"
          height="280"
          caption="First slide"
          text="Nulla vitae elit libero, a pharetra augue mollis interdum."
          :img-src="image_options[0]"
        ></b-carousel-slide>

        <!-- Slides with custom text -->
        <b-carousel-slide :img-src="image_options[1]" width="1024" height="280">
          <h1>Hello world!</h1>
        </b-carousel-slide>

        <!-- Slides with image only -->
        <b-carousel-slide
          :img-src="image_options[2]"
          width="1024"
          height="280"
        ></b-carousel-slide>

        <!-- Slides with img slot -->
        <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
        <b-carousel-slide>
          <template #img>
            <img
              class="d-block img-fluid w-100"
              width="1024"
              height="280"
              src="https://picsum.photos/1024/480/?image=55"
              alt="image slot"
            />
          </template>
        </b-carousel-slide>

        <!-- Slide with blank fluid image to maintain slide aspect ratio -->
        <b-carousel-slide caption="Blank Image" img-blank img-alt="Blank image">
          <p>
            {{ text1_options[slide] }}
          </p>
        </b-carousel-slide>
      </b-carousel>

      <!--     <p class="mt-4">
      Slide #: {{ slide }}<br>
      Sliding: {{ sliding }}
    </p> -->
    </div>
    <!--  -->

    <div id="carouselContainer">
      <div
        id="carousel-wrapper"
        v-bind:class="{ anim_next: animNext, anim_previous: animPrev }"
      >
        <div id="menu" :style="menuStyle">
          <div id="current-option">
            <span
              id="current-option-text1"
              :data-previous-text="data_previous_text"
              :data-next-text="data_next_text"
              >{{ currentOptionText1 }}</span
            >
            <span
              id="current-option-text2"
              :data-previous-text="data_previous_text2"
              :data-next-text="data_next_text2"
              >{{ currentOptionText2 }}</span
            >
          </div>
          <button id="previous-option" @click="next"></button>
          <button id="next-option" @click="prev"></button>
        </div>
        <div id="image" :style="imgStyle"></div>
      </div>
    </div>
    <b-row
      class="my-1"
      style="display: flex; justify-content: center; width: 100%"
    >
      <div>
        <label for="filter">Filtrar por:</label>
      </div>
      <b-col sm="9">
        <b-form-select
          id="filter"
          v-model="selected"
          :options="options"
          @change="onChange"
        ></b-form-select>
      </b-col>
    </b-row>

    <legend>Productos:</legend>
    <listado-items
      :dataItems="dataItemsProductos"
      :userLoged="userLoged"
      id="productos"
      @selectitem="alertar"
    >
    </listado-items>

    <legend>Menus:</legend>
    <listado-items
      :dataItems="dataItemsMenus"
      :userLoged="userLoged"
      id="menus"
      @selectitem="alertar"
    ></listado-items>

    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      :title="selected.alt"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
      :size="'lg'"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <!-- <b-form-group label="Name" label-for="name-input" invalid-feedback="Name is required" :state="nameState">
          <b-form-input id="name-input" v-model="name" :state="nameState" required></b-form-input>
        </b-form-group> -->
        <b-card no-body class="overflow-hidden">
          <b-row no-gutters>
            <b-col md="6">
              <b-card-img
                :src="selected.src"
                alt="Image"
                class="rounded-0"
              ></b-card-img>
            </b-col>
            <b-col md="6">
              <b-card-body
                v-if="selected.type_id == 'producto'"
                title="Ingredientes:"
              >
                <b-card-text>
                  <b-list-group style="max-width: 400px; margin: 0 auto">
                    <b-list-group-item
                      v-for="(dataItem, index) in selectedIngredients"
                      :key="index"
                      class="d-flex justify-content-between align-items-center"
                    >
                      {{ dataItem.nombre }}
                      <b-badge variant="primary" pill
                        >{{ dataItem.cantidad
                        }}{{ dataItem.unidadMedida }}</b-badge
                      >
                    </b-list-group-item>
                  </b-list-group>
                  <label class="sr-only" for="inline-form-input-cantidad"
                    >Name</label
                  >
                  <b-form-group label="Cantidad: " label-for="quantity">
                    <b-form-input
                      class="mb-2 mr-sm-2 mb-sm-0"
                      v-model="quantity"
                      type="number"
                      min="1"
                      required
                    >
                    </b-form-input>
                  </b-form-group>
                  <span
                    style="
                      position: absolute;
                      bottom: 0;
                      right: 20px;
                      color: #28a745;
                    "
                    >Precio: ${{ formatPrice(precioCalculado) }}</span
                  >
                </b-card-text>
              </b-card-body>
              <b-card-body
                v-else-if="selected.type_id == 'menu'"
                title="Productos:"
              >
                <b-card-text>
                  <b-list-group style="max-width: 400px; margin: 0 auto">
                    <b-list-group-item
                      v-for="(dataItem, index) in selectedProducts"
                      :key="index"
                      class="d-flex justify-content-between align-items-center"
                    >
                      <b-badge variant="primary" pill>{{
                        dataItem.tipo
                      }}</b-badge>
                      {{ dataItem.nombre }}
                    </b-list-group-item>
                  </b-list-group>
                  <label class="sr-only" for="inline-form-input-cantidad"
                    >Name</label
                  >
                  <b-form-group label="Cantidad: " label-for="quantity">
                    <b-form-input
                      class="mb-2 mr-sm-2 mb-sm-0"
                      v-model="quantity"
                      type="number"
                      min="0"
                      required
                    >
                    </b-form-input>
                  </b-form-group>
                  <span
                    style="
                      position: absolute;
                      bottom: 0;
                      right: 20px;
                      color: #28a745;
                    "
                    >Precio: ${{ formatPrice(precioCalculado) }}</span
                  >
                </b-card-text>
              </b-card-body>
            </b-col>
          </b-row>
        </b-card>
      </form>
    </b-modal>

    <!-- <div style="padding: 10px">
      <h1>Nuxt.js + Spring Boot</h1>
      <p>Message from API: {{ ip }}</p>
    </div> -->
  </div>
</template>
<!--<script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js" integrity="sha512-VEd+nq25CkR676O+pLBnDW09R7VQX9Mdiij052gVCp5yVH3jGtH70Ho/UUv4mJDsEdTvqRCFZg0NKGiojGnUCw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.css" integrity="sha512-3pIirOrwegjM6erE5gPSwkUzO+3cTjpnV9lexlNZqvupR64iZBnOOTiiLPb9M36zpMScbmUNIcHUqKD47M719g==" crossorigin="anonymous" referrerpolicy="no-referrer" />-->
<script>
/**export default {
  name: 'IndexPage'
}**/
import ListadoItems from "../components/ListadoItems.vue";

export default {
  /*beforeMount() {
    window.addEventListener("load", this.onLoad);
  },*/
  mounted() {
    this.onLoad();
  },
  data() {
    return {
      selected: {},
      quantity: 1,
      submittedNames: [],
      originalProducts: [],
      originalMenus: [],
      selectedIngredients: [],
      selectedProducts: [],
      selected: "Todo",
      userLoged: false,
      allProducts: [],
      allRestaurants: [],
      allProductsRestaurants: [],
      options: [
        { value: "Todo", text: "Todo" },
        {
          label: "Menús",
          options: [
            { value: "AllMenus", text: "Todos" },
            { value: "Personalizable", text: "Personalizables" },
          ],
        },
        {
          label: "Productos",
          options: [
            { value: "AllProducts", text: "Todos" },
            { value: "Entrada", text: "Entradas" },
            { value: "Plato Fuerte", text: "Platos Fuertes" },
            { value: "Postre", text: "Postres" },
            { value: "Bebida", text: "Bebidas" },
            { value: "Acompañamiento", text: "Acompañamientos" },
          ],
        },
      ],
      dataItemsProductos: [],
      dataItemsMenus: [],
      slide: 0,
      sliding: null,
      i: 0,
      text1_options: [
        "Recomendado1",
        "Recomendado2",
        "Recomendado3",
        "Recomendado4",
        "Recomendado5",
        "Recomendado6",
        "Recomendado7",
        "Recomendado8",
      ],
      text2_options: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet arcu dignissim urna suscipit interdum. Quisque odio sapien, ultricies sit amet massa vel, pharetra bibendum est. Nunc egestas euismod odio non feugiat. Phasellus blandit euismod nisi a lobortis. Donec pharetra risus ut volutpat efficitur. Morbi pellentesque enim non facilisis blandit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet arcu dignissim urna suscipit interdum. Quisque odio sapien, ultricies sit amet massa vel, pharetra bibendum est. Nunc egestas euismod odio non feugiat. Phasellus blandit euismod nisi a lobortis. Donec pharetra risus ut volutpat efficitur. Morbi pellentesque enim non facilisis blandit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet arcu dignissim urna suscipit interdum. Quisque odio sapien, ultricies sit amet massa vel, pharetra bibendum est. Nunc egestas euismod odio non feugiat. Phasellus blandit euismod nisi a lobortis. Donec pharetra risus ut volutpat efficitur. Morbi pellentesque enim non facilisis blandit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet arcu dignissim urna suscipit interdum. Quisque odio sapien, ultricies sit amet massa vel, pharetra bibendum est. Nunc egestas euismod odio non feugiat. Phasellus blandit euismod nisi a lobortis. Donec pharetra risus ut volutpat efficitur. Morbi pellentesque enim non facilisis blandit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet arcu dignissim urna suscipit interdum. Quisque odio sapien, ultricies sit amet massa vel, pharetra bibendum est. Nunc egestas euismod odio non feugiat. Phasellus blandit euismod nisi a lobortis. Donec pharetra risus ut volutpat efficitur. Morbi pellentesque enim non facilisis blandit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet arcu dignissim urna suscipit interdum. Quisque odio sapien, ultricies sit amet massa vel, pharetra bibendum est. Nunc egestas euismod odio non feugiat. Phasellus blandit euismod nisi a lobortis. Donec pharetra risus ut volutpat efficitur. Morbi pellentesque enim non facilisis blandit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet arcu dignissim urna suscipit interdum. Quisque odio sapien, ultricies sit amet massa vel, pharetra bibendum est. Nunc egestas euismod odio non feugiat. Phasellus blandit euismod nisi a lobortis. Donec pharetra risus ut volutpat efficitur. Morbi pellentesque enim non facilisis blandit.",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet arcu dignissim urna suscipit interdum. Quisque odio sapien, ultricies sit amet massa vel, pharetra bibendum est. Nunc egestas euismod odio non feugiat. Phasellus blandit euismod nisi a lobortis. Donec pharetra risus ut volutpat efficitur. Morbi pellentesque enim non facilisis blandit.",
      ],
      color_options: [
        "#EBB9D2",
        "#FE9968",
        "#7FE0EB",
        "#6CE5B1",
        "#EBB9D2",
        "#FE9968",
        "#7FE0EB",
        "#6CE5B1",
      ],
      image_options: [
        "img/ca1.jpg",
        "img/ca2.jpg",
        "img/ca3.jpg",
        "img/ca4.jpg",
        "img/ca5.jpg",
        "img/ca6.jpg",
        "img/ca7.jpg",
        "img/ca8.jpg",
      ],
      data_previous_text: "",
      data_next_text: "",
      data_previous_text2: "",
      data_next_text2: "",
      animNext: false,
      animPrev: false,
      backgroundImage: "url(" + "img/ca1.jpg" + ")",
      currentOptionText1: "Recomendado1",
      currentOptionText2:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet arcu dignissim urna suscipit interdum. Quisque odio sapien, ultricies sit amet massa vel, pharetra bibendum est. Nunc egestas euismod odio non feugiat. Phasellus blandit euismod nisi a lobortis. Donec pharetra risus ut volutpat efficitur. Morbi pellentesque enim non facilisis blandit.",
    };
  },
  computed: {
    menuStyle() {
      return {
        backgroundColor: this.color_options[this.i],
      };
    },
    imgStyle() {
      return {
        backgroundImage: this.backgroundImage,
      };
    },
    precioCalculado() {
      let price = 0;
      price = this.quantity * this.selected.real_price;
      return price;
    },
  },
  methods: {
    alertar(Object) {
      console.log(Object);
      this.selected = Object;
      if (Object.type_id == "producto") {
        this.$axios
          .$get(
            "http://localhost:8080/ingredientes/getIngredients?pid=" + Object.id
          )
          .then((res9) => {
            console.log(res9);
            this.selectedIngredients = res9;
          })
          .catch((err) => {
            console.log(err);
            alert("Sesión expirada, vuelva a iniciar sesión");
            localStorage.clear();
            //this.$router.push('/log_in');
            window.location.href = "http://localhost:3000/log_in";
          });
      } else if (Object.type_id == "menu") {
        this.$axios
          .$get(
            "http://localhost:8080/productos/getMenuProducts?idm=" + Object.id
          )
          .then((res9) => {
            console.log(res9);
            this.selectedProducts = res9;
          })
          .catch((err) => {
            console.log(err);
            alert("Sesión expirada, vuelva a iniciar sesión");
            localStorage.clear();
            //this.$router.push('/log_in');
            window.location.href = "http://localhost:3000/log_in";
          });
      }
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    resetModal() {
      this.quantity = 1;
    },
    handleOk(bvModalEvent) {
      // Prevent modal from closing
      bvModalEvent.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }

      // Actions
      let cartData = [];
      //retrieve cart data from localstorage
      let data = sessionStorage.getItem("cart");
      //parse it to json
      if (data !== null) {
        cartData = JSON.parse(data);
      }
      let item;
      if (this.selected.type_id == "producto") {
        item = this.originalProducts.filter(
          (product) => this.selected.id == product.idProducto
        )[0];
        if (cartData.some((d) => d.idProducto === item.idProducto)) {
          this.$bvToast.toast("Ya está en el carrito", {
            title: "Fallo",
            variant: "danger",
            solid: true,
          });
          return;
        }
        item.cantidad = this.quantity;
        item.componentes = this.selectedIngredients;
        let restaurant = this.allProducts.filter(
          (product) => this.selected.id == product.id
        )[0];
        item.restaurant = restaurant.restaurant;
      } else if (this.selected.type_id == "menu") {
        item = this.originalMenus.filter(
          (menu) => this.selected.id == menu.idMenu
        )[0];
        if (cartData.some((d) => d.idMenu === item.idMenu)) {
          this.$bvToast.toast("Ya está en el carrito", {
            title: "Fallo",
            variant: "danger",
            solid: true,
          });
          return;
        }

        let restaurant = this.allRestaurants.filter(
          (restaurant) => item.restaurantNit == restaurant.nit
        )[0];
        item.cantidad = this.quantity;
        item.componentes = this.selectedProducts;
        item.restaurant = restaurant;
        console.log("Item ", item);
      }
      item.type_id = this.selected.type_id;
      // add the selected product to cart data
      cartData.push(item);
      sessionStorage.setItem("cart", JSON.stringify(cartData));
      data = sessionStorage.getItem("cart");
      //updated the cart
      cartData = JSON.parse(data);
      window.cartProducts = cartData;
      this.quantity = 0;
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
      this.$bvToast.toast("Agregado al carrito", {
        title: "Éxito",
        variant: "success",
        solid: true,
      });
    },
    onChange() {
      console.log(this.selected);
      var tipo = this.selected;
      if (this.selected == "AllProducts") {
        this.dataItemsProductos = this.allProducts;
      } else {
        this.dataItemsProductos = this.allProducts.filter(function (el) {
          return el.tipo == tipo;
        });
      }
      /* if (this.selected == "AllMenus") {
         this.dataItemsMenus = this.allMenus;
       } else {
         this.dataItemsMenus = this.allMenus.filter(function (el) {
           return el.personalizable == personalizable;
         });
       }*/
    },
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
    next(event) {
      this.i = this.i + 1;
      this.i = this.i % this.text1_options.length;
      this.data_next_text = this.text1_options[this.i];

      this.data_next_text2 = this.text2_options[this.i];

      //mainMenu.style.background = color_options[i];

      //carousel.classList.add("anim-next");
      this.animNext = true;

      setTimeout(() => {
        this.backgroundImage = "url(" + this.image_options[this.i] + ")";
        //this.imgStyle;
      }, 455);

      setTimeout(() => {
        this.currentOptionText1 = this.text1_options[this.i];
        this.currentOptionText2 = this.text2_options[this.i];
        this.animNext = false;
      }, 650);
    },
    prev() {
      if (this.i === 0) {
        this.i = this.text1_options.length;
      }
      this.i = this.i - 1;
      this.data_previous_text = this.text1_options[this.i];

      this.data_previous_text2 = this.text2_options[this.i];

      //mainMenu.style.background = color_options[i];
      //carousel.classList.add("anim-previous");
      this.animPrev = true;

      setTimeout(() => {
        this.backgroundImage = "url(" + this.image_options[this.i] + ")";
        //this.imgStyle;
      }, 455);

      setTimeout(() => {
        this.currentOptionText1 = this.text1_options[this.i];
        this.currentOptionText2 = this.text2_options[this.i];
        this.animPrev = false;
      }, 650);
    },
    onLoad() {
      console.log(localStorage.getItem("token"));
      console.log(localStorage.getItem("authorities"));
      if (localStorage.getItem("token") != null) {
        this.$axios.defaults.headers.common["Authorization"] =
          "Bearer " + localStorage.getItem("token");
      }
      if (localStorage.getItem("authorities") == "Usuario") {
        this.userLoged = true;
      }

      this.$axios
        .$get("http://localhost:8080/restaurantes/get")
        .then((res) => {
          this.allRestaurants = res;
          this.$axios
            .$get("http://localhost:8080/restaurantes/getAllMenus")
            .then((res4) => {
              this.allMenus = res4;

              console.log("Original menus", this.originalMenus);
              this.$axios
                .$get("http://localhost:8080/menus/get")
                .then((res5) => {
                  this.originalMenus = res5;

                  console.log(res5);
                  res5.forEach((element) => {
                    this.$axios
                      .$get(
                        "http://localhost:8080/menus/getNameMenuRestaurant?id=" +
                          element.restaurantNit
                      )
                      .then((res7) => {
                        console.log(this.allMenus);
                        if (element.personalizable == false) {
                          element.personalizable = "No";
                        } else {
                          element.personalizable = "Si";
                        }
                        this.allMenus.push({
                          id: element.idMenu,
                          src: "data:image/jpeg;base64," + element.picByte,
                          //  src: src.style.width="1px",
                          alt: element.nombre,
                          real_price: element.precio,
                          price: this.formatPrice(element.precio),
                          tipo: element.personalizable,
                          nombre_restaurante: res7.nombre,
                          type_id: "menu",
                          restaurant: element.restaurantNit,
                        });
                        console.log(this.allMenus);
                        this.allMenus.shift();
                      })
                      .catch((err) => {
                        console.log(err);
                        alert("Sesión expirada, vuelva a iniciar sesión");
                        localStorage.clear();
                        //this.$router.push('/log_in');
                        window.location.href = "http://localhost:3000/log_in";
                      });
                    console.log("entre  x veces");
                  });

                  console.log(this.allMenus);
                  this.dataItemsMenus = this.allMenus;

                  this.$axios
                    .$get("http://localhost:8080/restaurantes/getAllProducts")
                    .then((res2) => {
                      this.allProductsRestaurants = res2;
                      console.log(res2);
                      this.$axios
                        .$get("http://localhost:8080/productos/get")
                        .then((res3) => {
                          this.originalProducts = res3;

                          res3.forEach((element) => {
                            this.$axios
                              .$get(
                                "http://localhost:8080/productos/getNameProductRestaurant?id=" +
                                  element.idProducto
                              )
                              .then((res6) => {
                                this.allProducts.push({
                                  id: element.idProducto,
                                  src:
                                    "data:image/jpeg;base64," + element.picByte,
                                  alt: element.nombre,
                                  real_price: element.precio,
                                  price: this.formatPrice(element.precio),
                                  tipo: element.tipo,
                                  nombre_restaurante: res6.nombre,
                                  type_id: "producto",
                                  restaurant: res6,
                                });
                              })
                              .catch((err) => {
                                console.log(err);
                                alert(
                                  "Sesión expirada, vuelva a iniciar sesión"
                                );
                                localStorage.clear();
                                //this.$router.push('/log_in');
                                window.location.href =
                                  "http://localhost:3000/log_in";
                              });
                          });
                          this.dataItemsProductos = this.allProducts;
                        })
                        .catch((err) => {
                          console.log(err);
                          alert("Sesión expirada, vuelva a iniciar sesión");
                          localStorage.clear();
                          //this.$router.push('/log_in');
                          window.location.href = "http://localhost:3000/log_in";
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                      alert("Sesión expirada, vuelva a iniciar sesión");
                      localStorage.clear();
                      //this.$router.push('/log_in');
                      window.location.href = "http://localhost:3000/log_in";
                    });
                })
                .catch((err) => {
                  console.log(err);
                  alert("Sesión expirada, vuelva a iniciar sesión");
                  localStorage.clear();
                  //this.$router.push('/log_in');
                  window.location.href = "http://localhost:3000/log_in";
                });
            })
            .catch((err) => {
              console.log(err);
              alert("Sesión expirada, vuelva a iniciar sesión");
              localStorage.clear();
              //this.$router.push('/log_in');
              window.location.href = "http://localhost:3000/log_in";
            });
        })
        .catch((err) => {
          console.log(err);
          alert("Sesión expirada, vuelva a iniciar sesión");
          localStorage.clear();
          //this.$router.push('/log_in');
          window.location.href = "http://localhost:3000/log_in";
        });
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(2).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
  },
  components: {
    ListadoItems,
  },
};
</script>
