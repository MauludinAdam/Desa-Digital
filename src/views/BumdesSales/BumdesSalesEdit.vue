<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from '@/utils/swal';
import { getBumdesSales, updateBumdesSalse } from '@/services/BumdesSales';
import { getBumdesUnitOptions } from '@/services/BumdesUnit';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const form = ref({
    invoice_number: '',
    bumdes_unit_id: '',
    sale_date: '',
    customer_name: '',
    total_amount: '',
    payment_method: '',
    status: '',
});


const bumdesUnit = ref({});

const fetchBumdesUnit = async () => {
    try {
        const response = await getBumdesUnitOptions();

        bumdesUnit.value = response.data.data.data ?? []; 
    } catch (error) {
        console.log(error)
    }
}

const getData = async () => {
    try {
        const response = await getBumdesSales(route.params.id);

        console.log(response.data);

        const data = response.data.data;

        form.value.invoice_number = data.invoice_number;
        form.value.bumdes_unit_id = data.bumdes_unit_id;
        form.value.sale_date = data.sale_date;
        form.value.customer_name = data.customer_name;
        form.value.total_amount = data.total_amount;
        form.value.payment_method = data.payment_method;
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

        await updateBumdesSalse(route.params.id, formData);
        toast("success","Data sales berhasil diperbarui");

        router.push({
            name: 'sales',
        });
    } catch (error) {
        if(error.response.status === 422){
            toast("error","Periksa kembali data yang diinput");

            errors.value = error.response.data.errors;
        }

        console.log(error)
    }finally{{
        loading.value = false;
    }}
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
                    <h5 class="fw-bold">Edit Sales</h5>
                </div>
            </div>
            <div class="card-body">
                <form @submit.prevent="updateData">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">No.Invoice</label>
                                <input type="text" v-model="form.invoice_number" class="form-control" :class="{'is-invalid': errors.invoice_number}" readonly>
                                <small class="text-danger" v-if="errors.invoice_number">{{ errors.invoice_number[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Unit Usaha</label>
                                <select v-model="form.bumdes_unit_id" class="form-control" :class="{'is-invalid': errors.bumdes_unit_id}">
                                    <option v-for="item in bumdesUnit" :value="item.id" :key="item.id">{{ item.name }}</option>
                                </select>
                                <small class="text-danger" v-if="errors.bumdes_unit_id">{{ errors.bumdes_unit_id[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Tgl Penjualan</label>
                                <input type="date" v-model="form.sale_date" class="form-control" :class="{'is-invalid': errors.sale_date}">
                                <small class="text-danger" v-if="errors.sale_date">{{ errors.sale_date[0] }}</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Nama Customer</label>
                                <input type="text" v-model="form.customer_name" class="form-control" :class="{'is-invalid': errors.customer_name}">
                                <small class="text-danger" v-if="errors.customer_name">{{ errors.customer_name[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Total Pembayaran</label>
                                <input type="text" v-model="form.total_amount" class="form-control" :class="{'is-invalid': errors.total_amount}">
                                <small class="text-danger" v-if="errors.total_amount">{{ errors.total_amount[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Metode Pembayaran</label>
                                <select v-model="form.payment_method" class="form-control" :class="{'is-invalid': errors.payment_method}">
                                    <option value="cash">Cash</option>
                                    <option value="transfer">Transfer</option>
                                    <option value="qris">Qris</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="">Status Pembayaran</label>
                        <select v-model="form.status" class="form-control" :class="{'is-invalid': errors.status}">
                            <option value="paid">Paid</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div class="d-flex gap-1 mx-3">
                        <RouterLink :to="{name: 'sales'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                        <button type="submit" class="btn btn-primary" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? 'Proses update...': 'Update' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>