<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from '@/utils/swal';
import { updateBumdesUnit, getBumdesUnit } from '@/services/BumdesUnit';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const form = ref({
    name: '',
    established_year: '',
    business_type: '',
    description: '',
    status: '',
});

const getData = async () => {
    try {
        const response = await getBumdesUnit(route.params.id);
        console.log(response.data);

        const data = response.data.data;

        form.value.name = data.name;
        form.value.business_type = data.business_type;
        form.value.established_year = data.established_year;
        form.value.description = data.description;
        form.value.status = data.status;

    } catch (error) {
        console.log(error);
    }
}

const updateData = async () => {
    loading.value = true;
    errors.value = {};
    message.value = "";

    try {
        const formData = new FormData();

        Object.keys(form.value).forEach((key) => {
            if(form.value[key] !== null && form.value[key] !== ""){
                formData.append(key, form.value[key]);
            }
        });

        for (let pair of formData.entries()){
            console.log(pair[0], pair[1]);
        }

        formData.append("_method","PUT");

        await updateBumdesUnit(route.params.id, formData);
        toast("success","Data unit usaha bumdes berhasil diperbarui");

        router.push({
            name: 'unit-usaha',
        });
    } catch (error) {
        console.log(error);
    }finally{
        loading.value = false;
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
                        <h5 class="fw-bold">Edit Unit Usaha BUMDes</h5>
                    </div>
                </div>
                <div class="card-body">
                    <form @submit.prevent="updateData">
                        <div class="form-group">
                            <label for="">Nama Unit Usaha</label>
                            <input type="text" v-model="form.name" class="form-control" :class="{'is-invalid': errors.name}">
                            <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                        </div>
                        <div class="form-group">
                            <label for="">Type Bisnis</label>
                            <select v-model="form.business_type" class="form-control" :class="{'is-invalid': errors.business_type}">
                                <option value="">--- Pilih ---</option>
                                <option value="Perdagangan">Perdagangan</option>
                                <option value="Pertanian">Pertanian</option>
                                <option value="Perternakan">Perternakan</option>
                                <option value="Perikanan">Perikanan</option>
                                <option value="Pariwisata">Pariwisata</option>
                                <option value="Pengolahan">Pengolahan</option>
                            </select>
                            <small class="text-danger" v-if="errors.business_type">{{ errors.business_type[0] }}</small>
                        </div>
                        <div class="form-group">
                            <label for="">Tahun Berdiri</label>
                            <input type="date" v-model="form.established_year" class="form-control" :class="{'is-invalid': errors.established_year}">
                            <small class="text-danger" v-if="errors.established_year">{{ errors.established_year[0] }}</small>
                        </div>
                        <div class="form-group">
                            <label for="">Status</label>
                            <select v-model="form.status" class="form-control" :class="{'is-invalid':errors.status}">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <small class="text-danger" v-if="errors.status">{{ errors.status[0] }}</small>
                        </div>
                        <div class="form-group">
                            <label for="">Deskripsi</label>
                            <textarea class="form-control" v-model="form.description" rows="3" :class="{'is-invalid': errors.description}"></textarea>
                            <small class="text-danger" v-if="errors.description">{{ errors.description[0] }}</small>
                        </div>
                        <div class="d-flex gap-1 mx-3">
                            <RouterLink :to="{name: 'unit-usaha'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                            <button type="submit" class="btn btn-primary" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? 'Proses update...' : 'Update' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>