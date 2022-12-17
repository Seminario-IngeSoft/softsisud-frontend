<template>
  <div class="login">
    <h1 class="title">Iniciar sesión</h1>
    <form action class="form formulario" @submit.prevent="login">
      <label class="form-label" for="#email">Email:</label>
      <input v-model="email" class="form-input" type="email" id="email" required placeholder="Email">
      <label class="form-label" for="#password">Password:</label>
      <input v-model="password" class="form-input" type="password" id="password" placeholder="Password">
      <p v-if="error" class="error">Has introducido mal el email o la contraseña.</p>
      <input class="form-submit" type="submit" value="Login">
    </form>
  </div>
</template>

<script>
import UsuarioLogin from '../model/UsuarioLogin';
export default {
  mounted() { 
    if (localStorage.getItem('token')!=null) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
      alert("ya se encuentra loggeado");
      this.$router.push('/')
    }
    let recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', '//cdn.jsdelivr.net/npm/sweetalert2@11')
    document.head.appendChild(recaptchaScript)
  },
  data: () => ({
    email: "",
    password: "",
    error: false,
    error_msg: ""
  }),
  methods: {
    login() {
      console.log(this.email);
      console.log(this.password);
      const usuario = new UsuarioLogin(this.email, this.password);
      this.$axios.$post("http://localhost:8080/auth/login", usuario).
        then(response => {
          console.log(response);
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.token;
          console.log(this.$axios.defaults.headers)
          localStorage.setItem('token', response.token);
          localStorage.setItem('userName', response.name);
          localStorage.setItem('authorities', response.authorities[0].authority);
          localStorage.setItem('id', response.id);
          //this.$router.push('/')
          window.location.href = 'http://localhost:3000/';
        }
        )
        .catch(error => {
          alert("Datos erróneos");
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });
    }
  }

};
</script>

<style lang="scss" scoped>
.login {
  padding: 2rem;
  min-height: 668px;
}

.title {
  text-align: center;
}

.form {
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 20%;
  min-width: 350px;
  max-width: 100%;
  background: #e0782f;
  border-radius: 5px;
  padding: 40px;
  box-shadow: 0 4px 10px 4px rgba(0, 0, 0, 0.3);
}

.form-label {
  margin-top: 2rem;
  color: white;
  margin-bottom: 0.5rem;

  &:first-of-type {
    margin-top: 0rem;
  }
}

.form-input {
  padding: 10px 15px;
  background: none;
  background-image: none;
  border: 1px solid white;
  color: white;

  &:focus {
    outline: 0;
    border-color: #1ab188;
  }
}

.form-submit {
  background: #571a0d;
  border: none;
  color: white;
  margin-top: 3rem;
  padding: 1rem 0;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0b9185;
  }
}
</style>