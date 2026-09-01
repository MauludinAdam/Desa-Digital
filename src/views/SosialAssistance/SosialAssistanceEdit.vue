<script setup>
import { ref, onMounted, setValue } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from '@/utils/swal';
import { updateSosialAssistance, getSosialAssistance } from '@/services/SosialAssistance';
import { getCategorySosialOptions } from '@/services/CategorySosial';

const route = useRoute();
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

const fetchCategories = async () => {
    try {
        const response = await getCategorySosialOptions();

        categories.value = response.data.data.data;
    } catch (error) {
        console.log(error);
    }
}

const getData = async () => {
    try {
        const response = await getSosialAssistance(route.params.id);
        console.log(response.data);

        const data = response.data.data;

        form.value.name = data.name;
        form.value.category_id = data.category_id;
        form.value.amount = data.amount;
        form.value.provider = data.provider;
        form.value.description = data.description;
        form.value.is_available = data.is_available;
    } catch (error) {
        console.log(error)
    }
}

const updateData = async () => {
    loading.value = true;
    errors.value = {};
    message.value = "";

    try {
        const formData = new FormData();

        Object.keys(form.value).forEach((key) => {
            if(key === "is_available"){
                formData.append(key, form.value[key] ? "1" : "0");
            }else if(
                form.value[key] !== null && form.value[key] !== ""
        ) {
            formData.append(key,form.value[key]);
            
        }
    });

        formData.append("_method","PUT");

        for (const [key, value] of formData.entries()){
            console.log(key, value);
        }

        await updateSosialAssistance(route.params.id, formData);
        toast("success","Data bantuan sosial berhasil diperbarui");

        router.push({
            name: 'master-sosial.bantuan-sosial',
        });
    } catch (error) {
        if(error.response?.status === 422){
            toast("error","Periksa kembali data yang diinput");

            errors.value = error.response.data.errors;
        }

        console.log(error)
    }finally{
        loading.value = false;
    }
}

onMounted( async () => {
    await fetchCategories();
    await getData();
})

</script>


<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header">
                <div class="card-title"><h5>Edit Bantuan Sosial</h5></div>
            </div>
            <div class="card-body">
                <form @submit.prevent="updateData">
                    <div class="form-group">
                        <label for="">Nama</label>
                        <input type="text" v-model="form.name" class="form-control" :class="{'is-invalid': errors.name}">
                        <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Kategori</label>
                        <select v-model="form.category_id" class="form-select" :class="{'is-invalid': errors.category_id}">
                            <option v-for="item in categories" :value="item.id" :key="item.id">{{ item.name }}</option>
                        </select>
                        <small class="text-danger" v-if="errors.category_id">{{ errors.category_id[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Jumlah</label>
                        <input type="text" v-model="form.amount" class="form-control" :class="{'is-invalid': errors.amount}">
                        <small class="text-danger" v-if="errors.amount">{{ errors.amount[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Penyedia</label>
                        <input type="text" v-model="form.provider" class="form-control" :class="{'is-invalid': errors.provider}">
                        <small class="text-danger" v-if="errors.provider">{{ errors.provider[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Deskripsi</label>
                        <textarea v-model="form.description" class="form-control" :class="{'is-invalid': errors.description}" rows="2"></textarea>
                        <small class="text-danger" v-if="errors.description">{{ errors.description[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Ketersediaan</label>
                        <select v-model="form.is_available" class="form-select" :class="{'is-invalid': errors.is_available}">
                            <option value="">--- Pilih ---</option>
                            <option value="true">Tersedia</option>
                            <option value="false">Tidak Tersedia</option>
                        </select>
                        <small class="text-danger" v-if="errors.is_available">{{ errors.is_available[0] }}</small>
                    </div>
                    <div class="d-flex gap-1 mx-3 mt-3">
                        <RouterLink :to="{name: 'master-sosial.bantuan-sosial'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                        <button type="submit" class="btn btn-primary" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? 'Proses update': 'Update' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>