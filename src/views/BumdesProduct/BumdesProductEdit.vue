<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from '@/utils/swal';
import { getBumdesUnitOptions } from '@/services/BumdesUnit';
import { getBumdesProduct, updateBumdesProduct } from '@/services/BumdesProduct';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const form = ref({
    bumdes_unit_id: '',
    name: '',
    barcode: '',
    price: '',
    unit: '',
    stock: '',
    status: '',
});

const bumdesUnit = ref([]);

const fetchBumdesUnit = async () => {
    try {
        const response = await getBumdesUnitOptions();

        bumdesUnit.value = response.data.data.data;
    } catch (error) {
        console.log(error);
    }
}

const getData = async () => {
    
    try {
        console.log('ID PRODUCT', route.params.id);

        const response = await getBumdesProduct(route.params.id);

        console.log(response.data);

        const data = response.data.data;

        form.value.bumdes_unit_id = data.bumdes_unit_id;
        form.value.name = data.name;
        form.value.barcode = data.barcode;
        form.value.price = data.price;
        form.value.unit = data.unit;
        form.value.stock = data.stock;
        form.value.status = data.status;
    } catch (error) {
        console.log(error)
    }
}

const updateData = async () => {
    loading.value = true;
    message.value = "";
    errors.value = {};

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

        await updateBumdesProduct(route.params.id, formData);

        toast("success", "Data product berhasil diperbarui");

        router.push({
            name: 'product'
        });
    } catch (error) {
        if(error.response.status === 422){
            toast("error","Periksa kembali data yang diinput");

            errors.value = error.response.data.errors;
        }

        console.log(error);
    }finally{
        loading.value = false;
    }
}

onMounted(() => {
    fetchBumdesUnit();
    getData();
})
</script>

<template>
    <div class="container-fluit">
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <h5 class="fw-bold">Edit Product</h5>
                </div>
            </div>
            <div class="card-body">
                <form @submit.prevent="updateData">
                    <div class="form-group">
                        <label for="">Barcode</label>
                        <input type="text" v-model="form.barcode" class="form-control" :class="{'is-invalid': errors.barcode}" readonly>
                        <small class="text-danger" v-if="errors.barcode">{{ errors.barcode[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Unit Usaha</label>
                        <select v-model="form.bumdes_unit_id" class="form-control" :class="{'is-invalid': errors.bumdes_unit_id}">
                            <option v-for="item in bumdesUnit" :value="item.id">{{ item.name }}</option>
                        </select>
                        <small class="text-danger" v-if="errors.bumdes_unit_id">{{ errors.bumdes_unit_id[0] }}</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="">Nama Product</label>
                        <input type="text" v-model="form.name" class="form-control" :class="{'is-invalid': errors.name}">
                        <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Harga</label>
                        <input type="text" v-model="form.price" class="form-control" :class="{'is-invalid': errors.price}">
                        <small class="text-danger" v-if="errors.price">{{ errors.price[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Satuan</label>
                        <input type="text" v-model="form.unit" class="form-control" :class="{'is-invalid': errors.unit}">
                        <small class="text-danger" v-if="errors.unit">{{ errors.unit[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Stock</label>
                        <input type="text" v-model="form.stock" class="form-control" :class="{'is-invalid': errors.stock}">
                        <small class="text-danger" v-if="errors.stock">{{ errors.stock[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Status</label>
                        <select v-model="form.status" class="form-control" :class="{'is-invalid': errors.status}">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div class="d-flex align-items-center gap-1 mx-3 mt-3">
                        <RouterLink :to="{name: 'product'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> kembali</RouterLink>
                        <button type="submit" class="btn btn-primary" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? 'Proses update...': 'Update' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>