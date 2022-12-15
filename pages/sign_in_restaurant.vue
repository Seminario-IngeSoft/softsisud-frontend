<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show" class="formulario">
      <b-form-group id="input-group-1" label="NIT:" label-for="input-1">
        <b-form-input v-model="form.nit" :state="validation" id="input-1" @keypress="onlyNumber" required>
        </b-form-input>
        <b-form-invalid-feedback :state="validation">
          Your NIT must be 9-10 characters long.
        </b-form-invalid-feedback>
        <b-form-valid-feedback :state="validation">
          Looks Good.
        </b-form-valid-feedback>
      </b-form-group>

      <b-form-group id="input-group-2" label="Nombre Restaurante:" label-for="input-2">
        <b-form-input id="input-2" v-model="form.name" placeholder="Enter name" required></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Teléfono:" label-for="input-3">
        <b-form-input id="input-3" v-model="form.telefono" placeholder="Enter telefono" @keypress="onlyNumber" required>
        </b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Especialidad:" label-for="input-4">
        <b-form-input id="input-4" v-model="form.especialidad" required></b-form-input>
      </b-form-group>
      <div class="subform">
        <legend>Datos Cuenta:</legend>
        <b-form-group id="input-group-5" label="Email address:" label-for="input-5"
          description="We'll never share your email with anyone else.">
          <b-form-input id="input-5" v-model="form.email" type="email" placeholder="Enter email" required>
          </b-form-input>
        </b-form-group>
        <b-form-group id="input-group-6" label="Password:" label-for="input-6">
          <b-form-input type="password" id="input-6" aria-describedby="password-help-block" v-model="form.password"
            required></b-form-input>
          <b-form-text id="password-help-block">
            Your password must be 8-20 characters long, contain letters and numbers, and must not
            contain spaces, special characters, or emoji.
          </b-form-text>
          <!--<b-form-input id="input-5" v-model="form.password" placeholder="Enter password" required></b-form-input>-->
        </b-form-group>
      </div>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>

<script>
import Restaurante from '../model/Restaurante';

export default {
  data() {
    return {
      form: {
        nit: '',
        name: '',
        especialidad: '',
        telefono: '',
        password: '',
        email:'',
        checked: []
      },
      show: true
    }
  },
  mounted(){
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', '//cdn.jsdelivr.net/npm/sweetalert2@11')
    document.head.appendChild(recaptchaScript)
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      alert(JSON.stringify(this.form))
      const restaurante = new Restaurante(this.form.nit, this.form.name, this.form.telefono, this.form.especialidad, this.form.email,this.form.password);
      this.$axios.$post("http://localhost:8080/auth/newrestaurant", restaurante)
        .then(response => {
          console.log(response)
          Swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'Restaurante registrado',
           })
        })
        .catch(response => console.log(response),error => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.nit = ''
      this.form.email = ''
      this.form.name = ''
      this.form.password = ''
      this.form.telefono = ''
      this.form.especialidad = ''
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
  computed: {
    validation() {
      return this.form.nit.length > 8 && this.form.nit.length < 11
    }
  }
}
</script>