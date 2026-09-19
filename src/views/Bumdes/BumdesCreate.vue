<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { toast } from '@/utils/swal';
import { createBumdes } from '@/services/ProfileBumdes';

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const errors = ref({})
const message = ref('');

const bumdes = ref([]);

const form = ref({
    name: '',
    title: '',
    legal_number: '',
    established_year: '',
    address: '',
    description: '',
    logo: null
})

const handleChange = (event) => {
    const file = event.target.files[0] ?? null;

    if(!file){
        form.value.logo = null;
        return;
    }

    form.value.logo = file;

    delete errors.value.logo;
}

const saveData = async () => {
    errors.value = {};
    message.value = ''

    if(!form.value.name){
        errors.value.name = ["Nama harus diisi"];
    }

    if(!form.value.title){
        errors.value.title = ["judul harus diisi"];
    }

    if(!form.value.legal_number){
        errors.value.legal_number = ["Nomor legalitas bumdes harus diisi"];
    }

    if(!form.value.established_year){
        errors.value.established_year = ["Tahun berdiri bumdes harus diisi"];
    }

    if(!form.value.address){
        errors.value.address = ["Alamat harus diisi"];
    }

    if(!form.value.description){
        errors.value.description = ["Descripsi harus diisi"]
    }

    if(!form.value.logo){
        errors.value.logo = ["Logo bumdes harus diisi"];
    }

    if(Object.keys(errors.value).length > 0){
        return;
    }

    try {
        loading.value = true

        const formData = new FormData();

        formData.append('name', form.value.name);
        formData.append('title', form.value.title)
        formData.append('legal_number', form.value.legal_number);
        formData.append('established_year', form.value.established_year);
        formData.append('address', form.value.address);
        formData.append('description', form.value.description);

        if(form.value.logo instanceof File){
            formData.append('logo', form.value.logo)
        }

        for(const[key, value] of formData.entries()){
            console.log(key, value)
        }

        await createBumdes(formData);

        Swal.fire({
            icon: 'success',
            title: 'berhasil',
            text: 'profile bumdes berhasil ditambahkan.',
            confirmButtonText: 'Ok',
        })

        router.push({
            name: 'bumdes',
        });

    } catch (error) {
        if(error.response?.status === 422){
            errors.value = error.response.data.errors ?? {};
        }
        console.log(error)
    }finally{
        loading.value = false;
    }
    
}

</script>

<template>
    <div class="container-fluit">
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <h5 class="fw-bold">Tambah Profile Bumdes</h5>
                </div>
            </div>
            <div class="card-body">
                <form @submit.prevent="saveData">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Nama</label>
                                <input type="text" v-model="form.name" class="form-control" :class="{'is-invalid': errors.name}" placeholder="Masukkan Nama Bumdes">
                                <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Judul</label>
                                <input type="text" v-model="form.title" class="form-control" :class="{'is-invalid': errors.title}" placeholder="Masukkan Judul">
                                <small class="text-danger" v-if="errors.title">{{ errors.title[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Tahun Berdiri</label>
                                <input type="text" v-model="form.established_year" class="form-control" :class="{'is-invalid': errors.established_year}" placeholder="Masukkan Tahun berdiri">
                                <small class="text-danger" v-if="errors.established_year">{{ errors.established_year[0] }}</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Nomor Legalitas</label>
                                <input type="text" v-model="form.legal_number" class="form-control" :class="{'is-invalid': errors.legal_number}" placeholder="Masukkan Nomor Legalitas">
                                <small class="text-danger" v-if="errors.legal_number">{{ errors.legal_number[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Alamat</label>
                                <textarea v-model="form.address" class="form-control" rows="1" :class="{'is-invalid':errors.address}" placeholder="Masukkan Alamat Lengkap"></textarea>
                                <small class="text-danger" v-if="errors.address">{{ errors.address[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Logo</label>
                                <input type="file" @change="handleChange" class="form-control" :class="{'is-invalid': errors.logo}">
                                <small class="text-danger" v-if="errors.logo">{{ errors.logo[0] }}</small>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="">Deskripsi</label>
                        <textarea v-model="form.description" class="form-control" :class="{'is-invalid': errors.description}" rows="3" placeholder="Masukkan Deskripsi"></textarea>
                        <small class="text-danger" v-if="errors.description">{{ errors.description[0] }}</small>
                    </div>
                    <div class="d-flex align-items-center gap-2 mx-3 mt-3">
                        <RouterLink :to="{name: 'bumdes'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                        <button class="btn btn-primary" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? 'Proses upload...' : 'Simpan' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>