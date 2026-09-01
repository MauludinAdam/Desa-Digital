<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { resetPassword } from '@/services/UserService';

const route = useRoute();
const router = useRouter();

const form = ref({
    token: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const loading = ref(false);

onMounted(() => {
    form.value.token = route.query.token ?? '';
    form.value.email = route.query.email ?? '';

    console.log(form.value.email);
    console.log(form.value.token);
});

const submitResetPassword = async () => {
    loading.value = true;

    try {
        const response = await resetPassword(form.value);

        await Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: response.data.message,
        });

        router.push({
            name: 'login',
        })
    } catch (error) {
        console.log(error);

        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: error.response?.data?.message ?? 'Gagal mereset passwrod'
        });
    }finally{
        loading.value = true;
    }
}


</script>


<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6 col-lg-5">

                <div class="card mt-5 shadow-sm">
                    <div class="card-body p-4">

                        <h4 class="text-center mb-2">
                            Reset Password
                        </h4>

                        <p class="text-muted text-center mb-4">
                            Silakan masukkan password baru Anda.
                        </p>

                        <form @submit.prevent="submitResetPassword">

                            <div class="form-group mb-3">
                                <label for="password">
                                    Password Baru
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    class="form-control"
                                    v-model="form.password"
                                    placeholder="Masukkan password baru"
                                    required
                                >
                            </div>

                            <div class="form-group mb-3">
                                <label for="password_confirmation">
                                    Konfirmasi Password
                                </label>

                                <input
                                    id="password_confirmation"
                                    type="password"
                                    class="form-control"
                                    v-model="form.password_confirmation"
                                    placeholder="Konfirmasi password"
                                    required
                                >
                            </div>

                            <button
                                type="submit"
                                class="btn btn-info w-100"
                                :disabled="loading"
                            >
                                {{ loading ? 'Memproses...': 'Reset Password' }}
                            </button>

                        </form>

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>