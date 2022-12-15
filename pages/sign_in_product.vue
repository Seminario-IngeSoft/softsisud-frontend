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

      <b-form-group id="input-group-2" label="Tipo:" label-for="input-2">
        <b-form-select id="input-2" v-model="form.tipo" :options="platos" required></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-3" label="Customizable:" label-for="input-3">
        <b-form-select id="input-3" v-model="form.customizable" :options="types" required></b-form-select>
      </b-form-group>

      <b-form-group id="input-group-4" label="Precio:" label-for="input-4">
        <b-form-input id="input-4" v-model="form.precio" placeholder="Enter price" @keypress="onlyNumber" required>
        </b-form-input>
      </b-form-group>

      <b-form-group id="input-group-5" label="Foto:" label-for="input-5">
        <b-form-file id="input-5" type="file" v-model="form.picByte" 
        @change="obtenerImagen($event)"  accept="image/*"
          placeholder="Pick a photo"></b-form-file>
      </b-form-group>

      <b-form-group id="input-group-6" label="Stock:" label-for="input-6" description="El stock depende de la disponibilidad de los ingredientes.">
        <b-form-input class="mb-2 mr-sm-2 mb-sm-0"  v-model="form.stock" type="number" min="0" :disabled="form.ingredients.length>0" required>
            </b-form-input>
      </b-form-group>
      <hr />
      <div>
        <legend>Ingredientes:</legend>
        <div class="form-inline newInput" v-for="(ingredient, counter) in form.ingredients" v-bind:key="counter">
          <span>{{ counter + 1 }}</span>
          <label class="sr-only" for="inline-form-input-ingrediente">Name</label>
          <b-form-group label="Ingrediente: " label-for="ingredient">
            <b-form-select id="input-3" class="mb-2 mr-sm-2 mb-sm-0" style="width: 200px"
              v-model="ingredient.ingredient" required>
              <b-form-select-option v-for="(item, index) in listaIngredientes" :value="item" :key="index">{{ item }}
                ({{ listaMedidas[index] }})</b-form-select-option>
            </b-form-select>
          </b-form-group>

          <label class="sr-only" for="inline-form-input-cantidad">Name</label>
          <b-form-group label="Cantidad: " label-for="quantity">
            <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="ingredient.quantity" type="number" min="0" required>
            </b-form-input>
          </b-form-group>
          <span @click="deleteIngredient(counter)">
            <b-icon-x-circle-fill variant="danger"></b-icon-x-circle-fill>
          </span>
          <!-- <label for="ingredient">{{ counter + 1 }}. Ingrediente:</label>
          <input type="text" v-model="ingredient.ingredient" required>
          <label for="quantity">Cantidad:</label>
          <input type="text" v-model="ingredient.quantity" required> -->
        </div>

        <a href="#">
          <b-icon-plus-circle-dotted variant="success" id="addIngredient" @click="addIngredient">
          </b-icon-plus-circle-dotted>
        </a>
      </div>



      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>

<style scoped>
span {
  width: 30px;
  float: right;
  cursor: pointer;
}


.previous {
  border: 1.5px solid;
  padding: 5px;
  margin-bottom: 10px;
}

.newInput {
  justify-content: space-evenly;
  margin: 20px;
}
</style>

<script>
import { BIcon, BIconPlusCircleDotted, BIconXCircleFill } from 'bootstrap-vue'
import Producto from '../model/Producto';

export default {
  components: {
    BIcon,
    BIconPlusCircleDotted,
    BIconXCircleFill
  },
  beforeMount() {
    //window.addEventListener("load", this.onLoad);
    this.onLoad();
  },
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
        tipo: 'Entrada',
        customizable: 'No',
        precio: null,
        picByte: null,
        ingredients: [],
        stock: 0
      },
      types: ['Si', 'No'],
      platos: ['Entrada', 'Plato Fuerte', 'Postre' , 'Bebida', 'Acompañamiento'],
      show: true,
      listaIngredientes: [],
      listaMedidas: [],
      listaIds: [],
      submitted: false,
      errors: []
      //listaI: this.window.listaIngredientes
    }
  },
  computed: {
    hasErrors: function () {
      return !!this.errors.length;
    }
  },
  methods: {
    addIngredient() {
      this.form.ingredients.push({
        ingredient: '',
        quantity: 0
      })
    },
    deleteIngredient(counter) {
      this.form.ingredients.splice(counter, 1)
    },
    obtenerImagen(e) {
      this.form.picByte = e.target.files[0];
      console.log(this.form.picByte);
    },
    onSubmit(event) {
      event.preventDefault()
      this.errors = [];
      this.submitted = true;
      alert(JSON.stringify(this.form))
      console.log(this.form.personalizable);
      const busqueda = this.form.ingredients.reduce((a, i) => {
        a[i.ingredient] = ++a[i.ingredient] || 0;
        return a;
      }, {});

      const duplicados = this.form.ingredients.filter((i) => {
        return busqueda[i.ingredient];
      });
      if (duplicados.length > 0) {
        this.errors.push('Ingredientes duplicados');
        return false;
      }
      let personalizable = false;
      if (this.form.customizable == 'Si') {
        personalizable = true
      }
      var producto = new Producto(this.form.nombre, this.form.tipo, personalizable, this.form.precio);
      console.log(this.form.ingredients)
      //producto.producto_ingredientes = this.form.ingredients;
      let stock = this.form.stock;
      if(this.form.ingredients.length>0){
        stock = 1000;
      }
      let url = "http://localhost:8080/productos/newproduct?stock=" + stock + "&nit=" + restaurante.nit + "&ingredientes=";
      this.form.ingredients.forEach(element => {
        url = url.concat(element.ingredient,",",element.quantity,",");
      });
      url = url.substring(0, url.length - 1);
      console.log(url)
      if (this.form.picByte != null) {
        const uploadData = new FormData();
        uploadData.append('imageFile', this.form.picByte, this.form.picByte.name);
        
        this.$axios.$post("http://localhost:8080/productos/upload", uploadData)
          .then(res => {
            console.log(res);
            if (res.mensaje == "200") {
              console.log('subi la imagen')
              this.message2 = 'Image uploaded successfully';
              //producto.producto_ingredientes = this.ingredients;
              this.$axios.$post(url, producto)
                .then(response => {
                  console.log(response);
                  Swal.fire({
                    icon: 'success',
                    title: 'Exito',
                    text: 'Producto recibido',
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
        this.$axios.$post(url, producto)
          .then(response => {
            console.log(response);
            Swal.fire({
                    icon: 'success',
                    title: 'Exito',
                    text: 'Producto recibido',
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
      this.form.customizable = ''
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
            }
          ).catch(response => console.log(response), error => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
          });
          this.$axios.$get('http://localhost:8080/ingredientes/get').then(
            res => {
              res.forEach(element => {
                this.listaIngredientes.push(element.nombre);
                this.listaMedidas.push(element.unidadMedida);
                this.listaIds.push(element.idIngrediente);
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
  }
  /*computed: {
     validation(q) {
       return q >= 0
     }
   }*/
}

</script>
