<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { updateBumdes, getBumdes } from '@/services/ProfileBumdes';
import Swal from 'sweetalert2';

const router = useRouter();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const saving = ref(false);

const bumdes = ref([]);

const form = ref({
    name: '',
    title: '',
    legal_number: '',
    established_year: '',
    address: '',
    description: '',
}); 

const logoPreview = ref("");

const getData = async () => {
    loading.value = true;

    try {
        const response = await getBumdes();

        console.log(response.data.data);

        bumdes.value = response.data.data ?? {};

        form.value = {
            name: bumdes.value?.name ?? '',
            title: bumdes.value?.title ?? '',
            legal_number: bumdes.value?.legal_number ?? '',
            established_year: bumdes.value?.established_year ?? '',
            address: bumdes.value?.address ?? '',
            description: bumdes.value?.description ?? '',
        }

        logoPreview.value = bumdes.value?.logo ?? null;

    } catch (error) {
        console.log(error)

        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Data Profile Bumdes gagal Diambil',
        });
    }finally{
        loading.value = false;
    }
}

// logo
const handleLogo = (event) => {
    const file = event.target.files[0];
    if(!file) return;

    form.value.logo = file;

    // Hapus preview lama ada
    if(logoPreview.value?.startsWith("blob:")){
        URL.revokeObjectURL(logoPreview.value);
    }

    logoPreview.value = URL.createObjectURL(file);
}

// Update Profile
const updateData = async () => {
    saving.value = true;
    errors.value = {};
    message.value = "";
    loading.value = true;

    try {
        const formData = new FormData();

        formData.append('name', form.value.name);
        formData.append('title', form.value.title);
        formData.append('legal_number', form.value.legal_number);
        formData.append('established_year', form.value.established_year);
        formData.append('address', form.value.address);
        formData.append('description', form.value.description);

        if(form.value.logo instanceof File){
            formData.append('logo', form.value.logo);
        }

        formData.append("_method","POST");

        for (const[key, value] of formData.entries()){
            console.log(key, value)
        }

        await updateBumdes(formData);

        await Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Profile BUMDes berhasil diperbarui.',
            confirmButtonText: 'Ok',
        });

        router.push({
            name: 'bumdes',
        });
    } catch (error) {
        console.log(error.response?.data?.errors);

        if(error.response?.status === 422){
            errors.value = error.response.data.errors ?? {};
        }
    }finally{
        saving.value = false;
        loading.value = false
    }
}

onMounted(() => {
    getData();
})


</script>


<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="container-fluit">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">
                        <h5 class="fw-bold">Edit Profile BUMDes</h5>
                    </div>
                </div>
                <div class="card-body">
                    <form @submit.prevent="updateData">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="image">
                                <img :src="logoPreview || '/src/assets/images/img-default.jpg'" alt="image-profile" class="rounded" width="200" height="220">
                            </div>
                            <div class="form-group">
                                <label for="">Ganti Logo</label>
                                <input type="file" @change="handleLogo" class="form-control" :class="{'is-invalid': errors.logo}" accept="image/*">
                                <small class="text-danger" v-if="errors.logo">{{ errors.logo[0] }}</small>
                            </div>
                        </div>
                        <div class="col-md-8">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="">Nama BUMDes</label>
                                            <input type="text" v-model="form.name" class="form-control" :class="{'is-invalid':errors.name}" placeholder="Masukkan Nama BUMDes">
                                            <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                                        </div>
                                        <div class="form-group">
                                            <label for="">Title</label>
                                            <input type="text" v-model="form.title" class="form-control" :class="{'is-invalid': errors.established_year}" placeholder="Masukkan Title BUMDes">
                                            <small class="text-danger" v-if="errors.established_year">{{ errors.established_year[0] }}</small>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label for="">Tahun Berdiri</label>
                                            <input type="text" v-model="form.established_year" class="form-control" placeholder="Masukkan Tahun Berdiri">
                                        </div>
                                        <div class="form-group">
                                            <label for="">Nomor Legalitas</label>
                                            <input type="text" v-model="form.legal_number" class="form-control" :class="{'is-invalid': errors.legal_number}" placeholder="Masukkan Nomor Legalitas">
                                            <small class="text-danger" v-if="errors.legal_number">{{ errors.legal_number[0] }}</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                        <label for="">Alamat</label>
                                        <input type="text" v-model="form.address" class="form-control" :class="{'is-invalid':errors.address}" placeholder="Masukkan Alamat">
                                        <small class="text-danger" v-if="errors.address">{{ errors.address[0] }}</small>
                                    </div>
                                    <div class="form-group">
                                        <label for="">Deskripsi</label>
                                        <textarea rows="3" v-model="form.description" class="form-control" :class="{'is-invalid': errors.description}" placeholder="Masukkan Deskripsi"></textarea>
                                        <small class="text-danger" v-if="errors.description">{{ errors.description[0] }}</small>
                                    </div>
                                    <div class="d-flex gap-1 mx-2 mt-2">
                                        <RouterLink :to="{name: 'bumdes'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                                        <button type="submit" class="btn btn-primary" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? 'Mengupload..': 'Update' }}</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    </div>
</template>