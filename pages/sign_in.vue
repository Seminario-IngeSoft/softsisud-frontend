<template>
    <div>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show" class="formulario">
            <b-form-group id="input-group-1" label="Email address:" label-for="input-1"
                description="We'll never share your email with anyone else.">
                <b-form-input id="input-1" v-model="form.email" type="email" placeholder="Enter email" required>
                </b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
                <b-form-input id="input-2" v-model="form.name" placeholder="Enter name" required></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-3" label="Type:" label-for="input-3">
                <b-form-select id="input-3" v-model="form.type" :options="types" required></b-form-select>
            </b-form-group>

            <b-form-group id="input-group-4" label="Celular:" label-for="input-4">
                <b-form-input id="input-4" v-model="form.celular" placeholder="Enter celular" required></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-5" label="Password:" label-for="input-5">
                <b-form-input type="password" id="input-5" aria-describedby="password-help-block" v-model="form.password" required></b-form-input>
                <b-form-text id="password-help-block">
                    Your password must be 8-20 characters long, contain letters and numbers, and must not
                    contain spaces, special characters, or emoji.
                </b-form-text>
                <!--<b-form-input id="input-5" v-model="form.password" placeholder="Enter password" required></b-form-input>-->
            </b-form-group>

            <b-form-group id="input-group-6" v-slot="{ ariaDescribedby }">
                <b-form-checkbox-group v-model="form.checked" id="checkboxes-6" :aria-describedby="ariaDescribedby">
                    <b-form-checkbox value="me">Check me out</b-form-checkbox>
                    <b-form-checkbox value="that">Check that out</b-form-checkbox>
                </b-form-checkbox-group>
            </b-form-group>

            <b-button type="submit" variant="primary">Submit</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
        <b-card class="mt-3" header="Form Data Result">
            <pre class="m-0">{{ form }}</pre>
        </b-card>
    </div>
</template>

<script>
import Usuario from '../model/Usuario';

export default {
    data() {
        return {
            form: {
                email: '',
                name: '',
                type: null,
                celular: null,
                password: null,
                checked: []
            },
            types: [{ text: 'Select One', value: null }, 'Usuario', 'Administrador'],
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
            const user = new Usuario(this.form.name, this.form.celular, this.form.type, this.form.password, this.form.email);
            this.$axios.$post("http://localhost:8080/auth/newuser", user)
                .then(response => {
                    console.log(response)
                    Swal.fire({
                    icon: 'success',
                    title: 'Exito',
                    text: 'Usuario registrado',
                    })
                }
                ).catch(error => {
                    this.errorMessage = error.message;
                    console.error("There was an error!", error);
                });
        },
        onReset(event) {
            event.preventDefault()
            // Reset our form values
            this.form.email = ''
            this.form.name = ''
            this.form.type = null
            this.form.celular = null
            this.form.password = null
            this.form.checked = []
            // Trick to reset/clear native browser form validation state
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        }
    }
}
</script>