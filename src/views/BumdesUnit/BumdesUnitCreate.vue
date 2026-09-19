<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from '@/utils/swal';
import { createBumdeUnit } from '@/services/BumdesUnit';

const router = useRouter();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const bumdesUnit = ref([]);

const form = ref({
    name: '',
    business_type: '',
    established_year: '',
    description: '',
    status: '',
});

const saveData = async () => {
    loading.value = true;
    errors.value = {};
    message.value = "";

    if(!form.value.name){
        errors.value.name = ["Nama harus diisi"];
    }

    if(!form.value.business_type){
        errors.value.business_type = ["Type bisnis harus diisi"];
    }

    if(!form.value.established_year){
        errors.value.established_year = ["Tahub berdiri harus diisi"];
    }

    if(!form.value.description){
        errors.value.description = ["Descripsi harus diisi"];
    }

    if(!form.value.status){
        errors.value.status = ["Status harus diisi"];
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

        await createBumdeUnit(formData);
        toast("success", "Data unit usaha bumdes berhasil ditambahkan");

        router.push({
            name: 'unit-usaha',
        });

    } catch (error) {
        if(error.response?.status === 422){
            errors.value = error.response?.data.errors || {};
        }
    }finally{
        loading.value = false;
    }
}

</script>


<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="container-fluit">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">
                        <h5 class="fw-bold">Tambah Unit Usaha BUMDes</h5>
                    </div>
                </div>
                <div class="card-body">
                    <form @submit.prevent="saveData">
                        <div class="form-group">
                            <label for="">Nama Unit Usaha</label>
                            <input type="text" v-model="form.name" class="form-control" :class="{'is-invalid': errors.name}" placeholder="Masukkan Nama Unit Usaha">
                            <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                        </div>
                        <div class="form-group">
                            <label for="">Type Bisnis</label>
                            <select v-model="form.business_type" class="form-control" :class="{'is-invalid': errors.business_type}">
                                <option value="">--- Pilih ---</option>
                                <option value="Perdagangan">Perdagangan</option>
                                <option value="Pertanian">Pertanian</option>
                                <option value="Peternakan">Perternakan</option>
                                <option value="Perikanan">Perikanan</option>
                                <option value="Pariwisata">Pariwisata</option>
                                <option value="Pengolahan">Pengolahan</option>
                            </select>
                            <small class="text-danger" v-if="errors.business_type">{{ errors.business_type[0] }}</small>
                        </div>
                        <div class="form-group">
                            <label for="">Tahun Berdiri</label>
                            <input type="date" v-model="form.established_year" class="form-control" :class="{'is-invalid': errors.estbalished_year}">
                            <small class="text-danger" v-if="errors.established_year">{{ errors.established_year[0] }}</small>
                        </div>
                        <div class="form-group">
                            <label for="">Status</label>
                            <select v-model="form.status" class="form-control" :class="{'is-invalid':errors.status}">
                                <option value="">--- Pilih ---</option>
                                <option value="active">active</option>
                                <option value="inactive">inactive</option>
                            </select>
                            <small class="text-danger" v-if="errors.status">{{ errors.status[0] }}</small>
                        </div>
                        <div class="form-group">
                            <label for="">Deskripsi</label>
                            <textarea rows="3" v-model="form.description" class="form-control" :class="{'is-invalid': errors.description}" placeholder="Masukkan Deskripsi"></textarea>
                            <small class="text-danger" v-if="errors.description">{{ errors.description[0] }}</small>
                        </div>
                        <div class="d-flex gap-1 mx-3">
                            <RouterLink :to="{name: 'unit-usaha'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                            <button type="submit" class="btn btn-primary" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? 'Proses menyimpan...' : 'Simpan' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>