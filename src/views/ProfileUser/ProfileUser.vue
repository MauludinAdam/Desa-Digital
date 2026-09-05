<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { getMe, updateMe } from '@/services/UserService';

const loading = ref(false);
const saving = ref(false);

const errors = ref({});
const message = ref("");

const user = ref([]);

const form = ref({
    name: '',
    email: '',
    role: '',
});

const passwordForm = ref({
    current_password: '',
    password: '',
    password_confirmation: '',
});

// GET USER YANG SEDANG LOGIN
const getUser = async () => {
    loading.value = true;

    try {
        const response = await getMe();

        console.log(response.data);

        user.value = response.data.data;

        form.value.name = user.value?.name ?? '';
        form.value.email = user.value?.email ?? '';
        form.value.role = user.value?.role ?? '';

    } catch (error) {
        console.log(error.response?.status);
        console.log('DATA:', error.response?.data);
        console.log('ERROR:', error);

        console.log(error.response?.data);

        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Data profile user gagal diambil.',
        });
    }finally{
        loading.value = false;
    }
};

// UPDATE PROFILE USER
const updateProfile = async () => {
    saving.value = true;
    errors.value = {};
    message.value = "";

    try {
        const response = await updateMe({
            name: form.value.name,
            email: form.value.email,
        });

        console.log(response.data);

        // Update data user dihalaman
        user.value = response.data.data ?? response.data;

        // Update local form
        form.value.name = user.value?.name ?? '';
        form.value.email = user.value?.email ?? '';

        await Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Profile user berhasil diperbarui.',
            confirmButtonText: 'Ok',
        });
    } catch (error) {
        console.log(error.response?.status);

        if(error.response?.status === 422){
            errors.value = error.response.data.errors ?? {};
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: error.response?.data?.message ?? 'Profile user gagal diperbarui.',
            });
        }
    }finally{
        saving.value = false;
    }
};

const updatePassword = async () => {
    saving.value = true;
    errors.value = {};

    try {
        console.log('PASSWORD FORM:', passwordForm.value);

        const response = await updateMe(passwordForm.value);

        console.log(response.data);

        await Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Password berhasil diperbarui.',
        });

        passwordForm.value = {
            current_password: '',
            password: '',
            password_confirmation: '',
        };

    } catch (error) {
        console.log(error);

        if(error.response?.status === 422) {
            errors.value = error.response.data.errors ?? {};

            // Kalau password lama salah 
            if(!error.response.data.errors) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: error.response.data.message,
                })
            }
        }
    }finally{
        saving.value = false;
    }
}


// RESET FORM
const resetForm = () => {
    form.value.name = user.value?.name ?? '';
    form.value.email = user.value?.email ?? '';

    errors.value = {};
};

// LOAD DATA
onMounted(() => {
    getUser();
});

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="container-fluit">

            <h4>Profile Saya</h4>
            <span>Kelola informasi profile dan keamanan akun anda</span>
            <div class="row mt-4">
                    <div class="col-lg-4">
                        <div class="card bg-dark text-white h-75">
                            <div class="text-center" style="padding: 3rem;">
                                <p class="fs-3"><i class="fas fa-user fa-3x"></i></p>
                                <strong>{{ form.name }}</strong><br>
                                <span class="mt-3">{{ form.email }}</span><br>
                                <span class="mt-3">{{ form.role?.name }}</span>
                            </div>
                        </div>
                    </div>
            
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-header">
                            <h5>Informasi Profile</h5>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="updateProfile">
                                <div class="form-group">
                                    <label for="">Nama</label>
                                    <input type="text" v-model="form.name" id="name" class="form-control" :class="{'is-invalid': errors.name}">
                                    <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                                </div>
                                <div class="form-group">
                                    <label for="">Email</label>
                                    <input type="email" v-model="form.email" id="email" class="form-control" :class="{'is-invalid': errors.email}">
                                    <small class="text-danger" v-if="errors.name">{{ errors.email[0] }}</small>
                                </div>
                                <div class="mt-2 mx-3">
                                    <button type="submit" class="btn btn-info">Simpan Perubahan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-header">
                            <div class="card-title">
                                <h5><i class="fas fa-key"></i> Keamanan Akun</h5>
                            </div>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="updatePassword">
                                <div class="mb-4 row">
                                    <label for="staticPassword" class="col-sm-2 col-form-label">Password Lama</label>
                                    <div class="col-sm-10">
                                        <input type="password" v-model="passwordForm.current_password" class="form-control" :class="{'is-invalid':errors.current_password}" placeholder="Masukkan password lama">
                                        <small class="text-danger" v-if="errors.current_password">{{ errors.current_password[0] }}</small>
                                    </div>
                                </div>
                                <div class="mb-4 row">
                                    <label for="staticPassword" class="col-sm-2 col-form-label">Password Baru</label>
                                    <div class="col-sm-10">
                                        <input type="password" v-model="passwordForm.password" class="form-control" :class="{'is-invalid':errors.password }" placeholder="Masukkan password baru">
                                        <small class="text-danger" v-if="errors.password">{{ errors.password[0] }}</small>
                                    </div>
                                </div>
                                <div class="row">
                                    <label for="inputPassword" class="col-sm-2 col-form-label">Ulangi Password</label>
                                    <div class="col-sm-10">
                                        <input type="password" v-model="passwordForm.password_confirmation" class="form-control" :class="{'is-invalid': errors.password_confirmation}" placeholder="Konfirmasi password baru">
                                        <small class="text-danger" v-if="errors.password_confirmation">{{ errors.updatePassword[0] }}</small>
                                        <button type="submit" class="btn btn-info mt-3">Ganti Password</button>
                                    </div>
                                </div>
                                <div class=" mt-3 text-end">
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>