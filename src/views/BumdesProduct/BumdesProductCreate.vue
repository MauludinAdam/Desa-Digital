<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from '@/utils/swal';
import { getBumdesUnitOptions } from '@/services/BumdesUnit';
import { createBumdesProduct, generateBarcodeNumber } from '@/services/BumdesProduct';

const router = useRouter();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const bumdesUnit = ref([]);


const fetchBumdesUnit = async () => {
    try {
        const response = await getBumdesUnitOptions();
        
        bumdesUnit.value = response.data.data.data;

    } catch (error) {
        console.log(error);
    }
}

const form = ref({
    bumdes_unit_id: '',
    name: '',
    barcode: '',
    price: '',
    unit: '',
    stock: '',
    status: '',
});

const generateBarcode = async () => {
    try {
        const response = await generateBarcodeNumber();

        form.value.barcode = response.data.data.barcode;
    } catch (error) {
        console.log(error);
    }
}

const saveData = async () => {
    errors.value = {};
    message.value = "";

    if(!form.value.bumdes_unit_id){
        errors.value.bumdes_unit_id = ["Unit usaha harus diisi"];
    }

    if(!form.value.name){
        errors.value.name = ["Nama harus diisi"];
    }

    if(!form.value.barcode){
        errors.value.barcode = ["Barcode harus diisi"];
    }

    if(!form.value.price){
        errors.value.price = ["Harga harus diisi"];
    }

    if(!form.value.unit){
        errors.value.unit = ["Satuan harus diisi"];
    }

    if(!form.value.stock){
        errors.value.stock = ["Stock harus diisi"];
    }

    if(!form.value.status){
        errors.value.status = ['Status harus diisi'];
    }

    if(Object.keys(errors.value).length > 0){
        loading.value = false;
        return;
    }

    loading.value = true;

    try {
        const formData = new FormData();

        Object.keys(form.value).forEach((key) => {
            formData.append(key, form.value[key] ?? '');
        });

        for (let pair of formData.entries()){
            console.log(pair[0], pair[1]);
        }

        await createBumdesProduct(formData);

        toast("success","Data product berhasil ditambahkan");

        router.push({
            name: 'product'
        });
    } catch (error) {
        console.log(error);
    }finally{
        loading.value = false;
    }
}

onMounted(() => {
    fetchBumdesUnit();
    generateBarcode();

});

</script>


<template>
    <div class="conatiner-fluit">
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <h5 class="fw-bold">Tambah Product</h5>
                </div>
            </div>
            <div class="card-body">
                <form @submit.prevent="saveData">
                    <div class="form-group">
                        <label for="">Barcode</label>
                        <input type="text" v-model="form.barcode" class="form-control" :class="{'is-invalid': errors.barcode}" readonly>
                    </div>
                    <div class="form-group">
                        <div class="label">Unit Usaha</div>
                        <select v-model="form.bumdes_unit_id" class="form-control" :class="{'is-invalid': errors.bumdes_unit_id}">
                            <option value="">--- Pilih ---</option>
                            <option v-for="item in bumdesUnit" :value="item.id" :key="item.id">{{ item.name }}</option>
                        </select>
                        <small class="text-danger" v-if="errors.bumdes_unit_id">{{ errors.bumdes_unit_id[0] }}</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="">Nama Prduct</label>
                        <input type="text" v-model="form.name" class="form-control" :class="{'is-invalid': errors.name}" placeholder="Masukkan Nama Product">
                        <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Harga</label>
                        <input type="text" v-model="form.price" class="form-control" :class="{'is-invalid': errors.price}" placeholder="Masukkan Harga Product">
                        <small class="text-danger" v-if="errors.price">{{ errors.price[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Satuan</label>
                        <select v-model="form.unit" class="form-control" :class="{'is-invalid': errors.unit}">
                            <option value="">--- Pilih ---</option>
                            <option value="Dus">Dus</option>
                            <option value="PCS">PCS</option>
                            <option value="Sak">Sak</option>
                            <option value="Kg">Kg</option>
                            <option value="Galon">Galon</option>
                        </select>
                        <small class="text-danger" v-if="errors.price">{{ errors.price[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Stock</label>
                        <input type="text" v-model="form.stock" class="form-control" :class="{'is-invalid': errors.stock}" placeholder="Masukkan Stock">
                        <small class="text-danger" v-if="errors.stock">{{ errors.stock[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Status</label>
                        <select v-model="form.status" class="form-control" :class="{'is-invalid': errors.status}">
                            <option value="">--- Pilih Status ---</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <small class="text-danger" v-if="errors.status">{{ errors.status[0] }}</small>
                    </div>
                    <div class="d-flex align-items-center mx-3 gap-1 mt-3">
                        <RouterLink :to="{name: 'product'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                        <button type="submit" class="btn btn-primary" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? 'Proses menyimpan...': 'Simpan' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>