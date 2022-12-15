<template>
    <!-- Footer -->
    <footer id="pFooter">
        <div class="container py-5">
            <div class="row py-4">
                <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
                    <p class="font-italic text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                        eiusmod tempor incididunt.</p>
                    <ul class="list-inline mt-4">
                        <li class="list-inline-item"><a href="#" target="_blank" title="twitter"><b-icon-twitter :color="'#fff'"></b-icon-twitter></a></li>
                        <li class="list-inline-item"><a href="#" target="_blank" title="facebook"><b-icon-facebook :color="'#fff'"></b-icon-facebook></a></li>
                        <li class="list-inline-item"><a href="#" target="_blank" title="instagram"><b-icon-instagram :color="'#fff'"></b-icon-instagram></a></li>
                        <li class="list-inline-item"><a href="#" target="_blank" title="youtube"><b-icon-youtube :color="'#fff'"></b-icon-youtube></a></li>
                        <li class="list-inline-item"><a href="#" target="_blank" title="whatsapp"><b-icon-whatsapp :color="'#fff'"></b-icon-whatsapp></a></li>
                    </ul>
                </div>
                <div class="col-lg-2 col-md-6 mb-4 mb-lg-0">
                    <h6 class="text-uppercase font-weight-bold mb-4">SoftSisUD</h6>
                    <ul class="list-unstyled mb-0">
                        <li class="mb-2"><a href="#" class="text-muted">Acerca de nosotros</a></li>
                        <li class="mb-2"><a href="#" class="text-muted">Registra tu restaurante</a></li>
                        <li class="mb-2"><a href="#" class="text-muted">Términos y condiciones</a></li>
                    </ul>
                </div>
                <div class="col-lg-2 col-md-6 mb-4 mb-lg-0">
                    <h6 class="text-uppercase font-weight-bold mb-4">INFO</h6>
                    <ul class="list-unstyled mb-0">
                        <li class="mb-2"><a href="#" class="text-muted">Politicas de privacidad</a></li>
                        <li class="mb-2"><a href="#" class="text-muted">Tratamiento de datos</a></li>
                        <li class="mb-2"><a href="#" class="text-muted">SIC</a></li>
                    </ul>
                </div>
                <div class="col-lg-4 col-md-6 mb-lg-0">
                    <h6 class="text-uppercase font-weight-bold mb-4">Newsletter</h6>
                    <p class="text-muted mb-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. At itaque
                        temporibus.</p>
                    <div class="p-1 rounded border">
                        <div class="input-group">
                            <input type="email" placeholder="Enter your email address" aria-describedby="button-addon1"
                                class="form-control border-0 shadow-0">
                            <div class="input-group-append">
                                <button id="button-addon1" type="submit" class="btn btn-link"><i
                                        class="fa fa-paper-plane"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <!-- End -->
</template>

<script>
import { BIcon, BIconArrowUp, BIconArrowDown, BIconTwitter, BIconFacebook, BIconInstagram, BIconYoutube, BIconWhatsapp } from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'
export default {
    name: 'Footer',
    components: {
        BIcon,
        BIconArrowUp,
        BIconArrowDown,
        BIconTwitter,
        BIconFacebook,
        BIconInstagram, 
        BIconYoutube, 
        BIconWhatsapp
    },
}
</script>

<style scoped lang="scss">
footer{
    background-color: #575755;
    color:#fff;
}
    .text-muted{
        color:#fff !important;
    }
</style>