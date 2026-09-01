<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { forgotPassword } from '@/services/UserService';

const router = useRouter();

const form = ref({
    email: '',
});

const loading = ref(false);

const submitForgotPassword = async () => {
    loading.value = true;

    try {
        console.log('EMAIL:', form.value.email);

        const response = await forgotPassword(form.value);

        console.log('STATUS:', response.status);
        console.log('DATA:', response.data);

        await Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: response.data.message
        });

        form.value.email = '';
    } catch (error) {
        console.log('STATUS:', error.response?.status);
        console.log('DATA:', error.response?.data);
        console.log('MESSAGE:', error.response?.data?.message);

        const message = error.response?.data?.message ?? 'Gagal mengirim link reset password';
    }finally{
        loading.value = false;
    }
};

const backToLogin = () => {
    router.push('/login');
}

</script>

<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">

                <div class="card mt-5 shadow-sm">

                    <div class="card-body p-4">

                        <h4 class="text-center mb-2">
                            Forgot Password
                        </h4>

                        <p class="text-muted text-center mb-4">
                            Masukkan email yang terdaftar untuk
                            mendapatkan link reset password.
                        </p>

                        <form @submit.prevent="submitForgotPassword">

                            <div class="form-group mb-3">

                                <label for="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    class="form-control"
                                    v-model="form.email"
                                    placeholder="Masukkan email"
                                    required
                                >

                            </div>

                            <button
                                type="submit"
                                class="btn btn-info w-100"
                                :disabled="loading"
                            >
                                {{ loading ? 'Mengirim...': 'Kirim Link Reset Password' }}
                            </button>

                        </form>

                        <div class="mt-3">

                            <a @click.prevent="backToLogin" class="text-decoration-underline"
                            >
                                Kembali ke Login
                            </a>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    </div>
</template>