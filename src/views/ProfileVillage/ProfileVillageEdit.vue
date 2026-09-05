<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { getProfileVillage, updateProfileVillage } from '@/services/ProfileVillage';

const router = useRouter();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const saving = ref(false);

const profile = ref([]);

const form = ref({
    name: '',
    thumbnail: '',
    district: '',
    regency: '',
    about: '',
    headman: '',
    people: '',
    total_area: '',
});

const thumbnailPreview = ref("");

// Get Profile Desa
const getProfile = async () => {
    loading.value = true;

    try {
        const response = await getProfileVillage();

        console.log(response.data.data);

        profile.value = response.data.data;
        form.value = {
            name: profile.value?.name ?? '',
            district: profile.value?.district ?? '',
            regency: profile.value?.regency ?? '',
            about: profile.value?.about ?? '',
            headman: profile.value?.headman ?? '',
            people: profile.value?.people ?? '',
            total_area: profile.value?.total_area ?? '',
        }

        thumbnailPreview.value = profile.value?.thumbnail ?? null;

    } catch (error) {
        console.log(error)

        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Data profile desa gagal diambil',
        });
    }finally{
        loading.value = false;
    }
}

// THUMBNAIL
const handleThumbnail = (event) => {
    const file = event.target.files[0];
    if(!file) return;

    form.value.thumbnail = file;

    // hapus preview lama jika ada
    if(thumbnailPreview.value?.startsWith("blob:")){
        URL.revokeObjectURL(thumbnailPreview.value);
    }

    thumbnailPreview.value = URL.createObjectURL(file);
}

// Update Profile
const updateProfile = async () => {
    saving.value = true;
    errors.value = {};
    message.value = "";

    try {
        const formData = new FormData();

        formData.append('name', form.value.name);
        formData.append('district', form.value.district);
        formData.append('regency', form.value.regency);
        formData.append('about', form.value.about ?? '');
        formData.append('headman', form.value.headman);
        formData.append('people', form.value.people);
        formData.append('total_area', form.value.total_area);

         if(form.value.thumbnail instanceof File){
                formData.append('thumbnail', form.value.thumbnail);
            }

        formData.append("_method","POST");
        
        for (const [key, value] of formData.entries()) {
        console.log( key, value);
        }

    
        await updateProfileVillage(formData);

        await Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Profile desa berhasil diperbarui.',
            confirmButtonText: 'Ok',
        });

        router.push({
            name: 'profile',
        });

    } catch (error) {
        console.log(error.response?.data?.errors);

        if(error.response?.status === 422){
            errors.value = error.response.data.errors ?? {};
        }
    }finally{
        saving.value = false;
    }
}

onMounted(() => {
    getProfile();
});


</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <h5>Edit Profile Desa</h5>
                </div>
                <small class="text-muted">Perbaruin informasi profile des</small>
            </div>
            <div class="card-body">
                <form @submit.prevent="updateProfile">
                    <div class="row p-2">
                        <div class="col-md-4">
                            <img :src="thumbnailPreview || '/src/assets/images/img-default.jpg'" width="280" height="350" class="rounded p-2" alt="">
                            <div class="form-group">
                                <label for="">Upload Foto</label>
                                <input type="file" id="thumbnail" @change="handleThumbnail" class="form-control" accept="image/*">
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="">Nama Desa</label>
                                        <input type="text" v-model="form.name" class="form-control" :class="{'is-invalid': errors.name}" placeholder="Masukkan Nama Desa">
                                        <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                                    </div>
                                    <div class="form-group">
                                        <label for="">Nama Kecamatan</label>
                                        <input type="text" v-model="form.district" class="form-control" :class="{'is-invalid': errors.district}" placeholder="Masukkan Nama Kecamatan">
                                        <small class="text-danger" v-if="errors.district">{{ errors.district[0] }}</small>
                                    </div>
                                    <div class="form-group">
                                        <label for="">Nama Kabupaten</label>
                                        <input type="text" v-model="form.regency" class="form-control" :class="{'is-invalid': errors.regency}" placeholder="Masukkan Nama Kabupaten">
                                        <small class="text-danger" v-if="errors.regency">{{ errors.regency[0] }}</small>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="">Kepala Desa</label>
                                        <input type="text" v-model="form.headman" class="form-control" :class="{'is-invalid': errors.headman}" placeholder="Masukkan Nama Kepala Desa">
                                        <small class="text-danger" v-if="errors.headman">{{ errors.headman[0] }}</small>
                                    </div>
                                    <div class="form-group">
                                        <label for="">Jumlah Penduduk</label>
                                        <input type="text" v-model="form.people" class="form-control" :class="{'is-invalid': errors.people}" placeholder="Masukkan Jumlah Penduduk">
                                        <small class="text-danger" v-if="errors.people">{{ errors.people[0] }}</small>
                                    </div>
                                    <div class="form-group">
                                        <label for="">Luas Wilayah</label>
                                        <input type="text" v-model="form.total_area" class="form-control" :class="{'is-invalid': errors.total_area}" placeholder="Masukkan luas Wilayah">
                                        <small class="text-danger" v-if="errors.total_area">{{ errors.total_area[0] }}</small>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="">Tentang Desa</label>
                                <textarea v-model="form.about" class="form-control" :class="{'is-invalid': errors.about}" rows="3" placeholder="Masukkan Deskripsi Tentang Desa"></textarea>
                                <small class="text-danger" v-if="errors.about">{{ errors.about[0] }}</small>
                            </div>
                            <div class="d-flex gap-1 mx-3 mt-2">
                                <RouterLink :to="{name: 'profile'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                                <button type="submit" class="btn btn-primary"><i class=" fas fa-paper-plane"></i> {{ loading ? 'Proses menyimpan...': 'Simpan' }}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>