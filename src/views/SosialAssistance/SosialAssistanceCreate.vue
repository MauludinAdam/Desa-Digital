<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { createSosialAssistance } from '@/services/SosialAssistance';
import { getCategorySosialOptions } from '@/services/CategorySosial';
import { toast } from '@/utils/swal';

const router = useRouter();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const categories = ref([]);

const form = ref({
    name: '',
    category_id: '',
    amount: '',
    provider: '',
    description: '',
    is_available: '',
});

const getCategories = async () => {
    try {
        const response = await getCategorySosialOptions();

        categories.value = response.data.data.data ?? [];

        console.log(categories.value);
    } catch (error) {
        console.log(error);
    }
}

const saveData = async () => {
    errors.value = {};
    message.value = ""

    if(!form.value.name){
        errors.value.name = ["Nama harus diisi"];
    }

    if(!form.value.category_id){
        errors.value.category_id = ["Kategori harus diisi"];
    }

    if(!form.value.amount){
        errors.value.amount = ["Jumlah harus diisi"];
    }

    if(!form.value.provider){
        errors.value.provider = ["Penyedia harus diisi"];
    }

    if(!form.value.description){
        errors.value.description = ["Deskripsi harus diisi"];
    }

    if(!form.value.is_available){
        errors.value.is_available = ["Ketersediaan harus diisi"];
    }

    if(Object.keys(errors.value).length > 0){
        loading.value = false;
        return;
    }

    loading.value = true;

    try {
        const formData = new FormData();

        Object.keys(form.value).forEach((key) => {
            formData.append(key, form.value[key]);
        });

        for (let pair of formData.entries()){
            console.log(pair[0], pair[1]);
        }

        await createSosialAssistance(formData);
        toast("success","Data bantuan sosial berhasil ditambahkan.");

        router.push({
            name: 'master-sosial.bantuan-sosial',
        })
    } catch (error) {
        if(error.response?.status === 422){
            errors.value = error.response?.data?.errors || {};
        }
    }finally{
        loading.value = false;
    }
}

onMounted(() => {
    getCategories();
});
</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header">
                <div class="card-title"><h5>Tambah Data</h5></div>
            </div>
            <div class="card-body">
                <form @submit.prevent="saveData">
                    <div class="form-group">
                        <label for="">Nama</label>
                        <input type="text" v-model="form.name" class="form-control" :class="{'is-invalid': errors.name}" placeholder="Masukkna Nama">
                        <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Kategory</label>
                        <select v-model="form.category_id" class="form-select" :class="{'is-invalid': errors.category_id}">
                            <option value="">--- Pilih ---</option>
                            <option v-for="item in categories" :value="item.id" :key="item.id">{{ item.name }}</option>
                        </select>
                        <small class="text-danger" v-if="errors.category_id">{{ errors.category_id[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Jumlah</label>
                        <input type="text" v-model="form.amount" class="form-control" :class="{'is-invalid': errors.amount}" placeholder="Masukkan Jumlah">
                        <small class="text-danger" v-if="errors.amount">{{ errors.amount[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Penyedia</label>
                        <input type="text" v-model="form.provider" class="form-control" :class="{'is-invalid': errors.provider}" placeholder="Masukkan Penyedia Bantuan">
                        <small class="text-danger" v-if="errors.provider">{{ errors.provider[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Deskripsi</label>
                        <textarea class="form-control" v-model="form.description" rows="2" :class="{'is-invalid': errors.description}" placeholder="Masukkan Deskripsi"></textarea>
                        <small class="text-danger" v-if="errors.description">{{ errors.description[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Ketresediaan</label>
                        <select v-model="form.is_available" class="form-select" :class="{'is-invalid': errors.is_available}">
                            <option value="">--- Pilih ---</option>
                            <option value="1">Tersedia</option>
                            <option value="0">Tidak Tersedia</option>
                        </select>
                        <small class="text-danger" v-if="errors.is_available">{{ errors.is_available[0] }}</small>
                    </div>
                    <div class="d-flex gap-1 mx-3 mt-3">
                        <RouterLink :to="{name: 'master-sosial.bantuan-sosial'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                        <button type="submit" class="btn btn-info" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? 'Proses menyimpan...': 'Simpan' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>