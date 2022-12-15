<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show" class="formulario">

      <b-form-group id="input-group-1" label="Nombre:" label-for="input-1">
        <b-form-input id="input-1" v-model="form.nombre" placeholder="Enter Name" required>
        </b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Unidades:" label-for="input-2">
        <b-form-input id="input-2" v-model="form.unidades" placeholder="Enter unities" @keypress="onlyNumber" required></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Unidad_medida:" label-for="input-3">
        <b-form-input id="input-3" v-model="form.unidadMedida" placeholder="Enter unit of measurement" required></b-form-input>    
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
<script>
import Ingrediente from '../model/Ingrediente';

export default {
  mounted() {
    if (localStorage.getItem('token')!=null) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    }else{
      this.$router.push('/log_in')
    }
    if(localStorage.getItem('authorities')!='restaurante'){
      alert("Debe iniciar sesión como restaurante!");
      this.$router.push('/log_in')
    }
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', '//cdn.jsdelivr.net/npm/sweetalert2@11')
    document.head.appendChild(recaptchaScript)
  },
  data() {
    return {
      form: {
        nombre: '',
        unidades: '',
        unidad_medida: '',
        checked: []
      },
      show: true
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      alert(JSON.stringify(this.form))
      console.log(this.form.unidadMedida);
      const ingrediente = new Ingrediente(this.form.unidades, this.form.unidadMedida, this.form.nombre);
      console.log(ingrediente)
      this.$axios.$post("http://localhost:8080/ingredientes/newingredient", ingrediente)
        .then(response => {
          console.log(response)
          Swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'Ingrediente recibido',
          })
          }

          )
        .catch(error => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.nombre = ''
      this.form.unidades = ''
      this.form.unidad_medida = ''
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
    }
  },
 /* computed: {
    validation() {
      //return this.form.unidadMedida.length >= 1 && this.form.unidadMedida.length <=5
    }
  }*/
}
</script>
