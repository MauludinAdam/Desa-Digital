<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, logout } from '@/services/authService';
import Swal from 'sweetalert2';

const router = useRouter();

const showPassword = ref(false);

const form = ref({
    email: "",
    password: "",
});

const message = ref("");
const successMessage = ref("");
const loading = ref(false);
const errors = ref({});

const logoutMessage = localStorage.getItem("logoutMessage");

if(logoutMessage) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: logoutMessage,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    localStorage.removeItem("logoutMessage");
}

const submitLogin = async() => {
    loading.value = true;
    message.value = "";
    errors.value = {};

    if(!form.value.email){
        errors.value.email = ["Email harus diisi"];
    }

    if(form.value.email && !form.value.email.includes("@")){
        errors.value.email = ["Format email tidak valid"];
    }

    if(!form.value.password){
        errors.value.password = ["Password harus diisi"];
    }

    if(form.value.password && form.value.password.length < 8) {
        errors.value.password = ["Password harus terdiri dari 8 karakter"];
    }

    // jika ada error, stop proses login
    if(Object.keys(errors.value).length > 0){
        loading.value = false;

        return;
    }

    try {
        const response = await login(form.value);

        // console.log('LOGIN RESPON:', response.data)

        console.log(response.data);
        console.log(response.data.user);

        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.data));

        localStorage.setItem("loginMessage","Anda berhasil login");

        router.push({
            name: "dashboard",
        });
    } catch (error) {
        console.log('LOGIN ERROR:', error)
        if(error.response){
            if(error.response.status === 401){
                message.value = "Email atau password salah";
            }else if(error.response.status === 500){
                message.value = "Terjadi kesalahan pada server, silahkan coba lagi nanti,";

                setTimeout(() => {
                    message.value = "";
                }, 4000);
            }else{
                message.value = error.response.data.message || "Terjadi kesalahan";

                setTimeout(() => {
                    message.value = "";
                }, 4000);
            }
        }else{
            message.value = "Tidak dapat terhubung ke server. Mohon periksa kembali koneksi internet anda!.";

            setTimeout(() => {
                message.value = "";
            }, 4000);
        }
        
    }finally{
        loading.value = false;
    }
}

</script>


<template>
    <div class="login-page">
        <div class="login-container">

            <!-- Login Card -->
             <div class="login-card rounded">
                <h2 class="text-center text-black"><i class="fas fa-home"></i></h2>
                <h4 class="text-center mb-3">Sistem Administrasi Desa</h4>
                <div v-if="successMessage" class="alert bg-success text-white">
                    <i class="fas fa-check-circle"></i> {{ successMessage }}
                </div>
                
                <div v-if="message" class="alert bg-danger alert-dismissable fade show text-white">
                    <i class="fas fa-exlamation-triangle me-2"></i> {{ message }}
                </div>
                <form @submit.prevent="submitLogin">

                    <div class="mb-3">
                         <label for="exampleFormControlInput1" class="form-label">Email</label>
                         <input type="email" v-model="form.email" class="form-control" :class="{ 'is-invalid' : errors.email }" placeholder="email@gmail.com">
                         <small class="invalid-feedback">{{ errors.email?.[0] }}</small>
                    </div>
                    <div class="mb-3">
                         <label for="exampleFormControlTextarea1" class="form-label">Password</label>
                         <input :type="showPassword ? 'text' : 'password'" class="form-control" v-model="form.password" :class="{'is-invalid': errors.password}" placeholder="Password">
                         <small class="invalid-feedback">{{ errors.password?.[0] }}</small>
                    </div>
                    <div class="d-flex justify-content-between">
                        <div class="show mb-3 d-flex gap-2">
                            <label for="">Show password</label>
                            <input type="checkbox" v-model="showPassword">
                        </div>
                        <div class="forgot-password">
                            <RouterLink :to="{name: 'forgot-password'}" class="text-decoration-underline">Forgot Password</RouterLink>
                        </div>
                    </div>
                    <div class="login-button">
                        <button type="submit" :disabled="loading" class="btn btn-dark w-100"> <i class="fa-solid fa-arrow-right-from-bracket"></i> {{ loading ? "Loading...": "login" }}</button>
                    </div>
                </form>
            </div>

            <!-- Footer -->
            <div class="text-center footer-text">
                © 2026 Administrasi Desa
            </div>

        </div>
    </div>
</template>

<style scoped>
.login-page {
    min-height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 20px;

    background:
        linear-gradient(
            rgba(9, 3, 36, 0.92),
            rgba(9, 3, 36, 0.9)
        ),
        url("https://images.unsplash.com/photo-1500534623283-312aade485b7")
        center / cover no-repeat;
}

/* Container */
.login-container {
    width: 100%;
    max-width: 430px;
}

/* Card */
.login-card {
    background-color: #f8f9fa;
    padding: 2rem;
    overflow: hidden;
    border-radius: 20px;
    box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.25);
}

.login-card h2 i{
    /* display: flex; */
    text-align: center;
    justify-content: center;
    font-size: 6rem;
    color: #198754;
}

/* Label */
.form-label {
    font-size: 14px;
    font-weight: 600;
    color: #343a40;
}

/* Input */
.input-group-text {
    min-width: 45px;
    justify-content: center;
    background: #f8f9fa;
    border-right: 0;
}

.form-control {
    height: 48px;
    border-left: 0;
}

.form-control:focus {
    border-color: #198754;

    box-shadow:
        0 0 0 0.2rem rgba(25, 135, 84, 0.12);
}

/* Button */
.login-button {
    height: 48px;
    border-radius: 10px;
    font-weight: 600;
    font-size: 15px;
}

.login-button .btn{
    font-size: 1.2rem;
}

/* Forgot Password */
.forgot-password {
    color: blue;
    font-size: 15px;
    text-decoration: none;
}

.forgot-password:hover {
    text-decoration: underline;
}

/* Footer */
.footer-text {
    margin-top: 18px;

    color: rgba(255, 255, 255, 0.85);

    font-size: 13px;
}

/* Mobile */
@media (max-width: 576px) {

    .login-page {
        padding: 15px;
    }

    .login-body {
        padding: 25px 20px;
    }
}
</style>


