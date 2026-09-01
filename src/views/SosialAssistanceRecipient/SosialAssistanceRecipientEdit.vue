<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { detailSosialAssistanceRecipient, updateSosialAssistanceRecipient } from '@/services/SosialAssitanceRecipient';
import { getCitizenOptions } from '@/services/citizenService';
import { getSosialAssistanceOptions } from '@/services/SosialAssistance';
import { toast } from '@/utils/swal';

const router = useRouter();
const route = useRoute();

const citizens = ref([]);
const sosialAssistances = ref([]);

const loading = ref(false);
const errors = ref({});
const message = ref("");

const form = ref({
    citizen_id: '',
    sosial_assistance_id: '',
    bank: '',
    amount: '',
    account_number: '',
    reason: '',
});

const fetchCitizen = async () => {
    try {
        const response = await getCitizenOptions();

        citizens.value = response.data.data.data ?? [];
    } catch (error) {
        console.log(error);
    }
}

const fetchSosialAssistance = async () => {
    try {
        const response = await getSosialAssistanceOptions();

        sosialAssistances.value = response.data.data.data ?? [];
    } catch (error) {
        console.log(error);
    }
}

const getData = async () => {
    try {
        const response = await detailSosialAssistanceRecipient(route.params.id);
        console.log(response.data);

        const data = response.data.data;

        form.value.citizen_id = data.citizen_id;
        form.value.sosial_assistance_id = data.sosial_assistance_id;
        form.value.bank = data.bank;
        form.value.amount = data.amount;
        form.value.account_number = data.account_number;
        form.value.reason = data.reason;
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

        await updateSosialAssistanceRecipient(route.params.id, formData);
        toast("success","Data penerima bansos berhasil diperbarui");

        router.push({
            name: 'master-sosial.penerima-bansos',
        });
    } catch (error) {
        console.log(error);
    }finally{
        loading.value = false;
    }

}

onMounted(() => {
    fetchCitizen();
    fetchSosialAssistance();
    getData();
})
</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header">
                <div class="card-title"><h5>Edit Penerima Bansos</h5></div>
            </div>
            <div class="card-body">
                <form @submit.prevent="updateData">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Peneriman</label>
                                <select v-model="form.citizen_id" class="form-control" :class="{'is-invalid': errors.citizen_id}">
                                    <option v-for="item in citizens" :key="item.id" :value="item.id">{{ item.full_name }}</option>
                                </select>
                                <small class="text-danger" v-if="errors.citizen_id">{{ errors.citizen_id[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Bantuan Sosial</label>
                                <select v-model="form.sosial_assistance_id" class="form-control" :class="{'is-invalid': errors.sosial_assistance_id}">
                                    <option v-for="item in sosialAssistances" :key="item.id" :value="item.id">{{ item.name }}</option>
                                </select>
                                <small class="text-danger" v-if="errors.sosial_assistance_id">{{ errors.sosial_assistance_id[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Nama Bank</label>
                                <select v-model="form.bank" class="form-control" :class="{'is-invalid': errors.bank}">
                                    <option value="">--- Pilih ---</option>
                                    <option value="bri">BRI</option>
                                    <option value="mandiri">Mandiri</option>
                                    <option value="bni">BNI</option>
                                    <option value="bca">BCA</option>
                                </select>
                                <small class="text-danger" v-if="errors.bank">{{ errors.bank[0] }}</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Jumlah</label>
                                <input v-model="form.amount" type="text" class="form-control" :class="{'is-invalid': errors.amount}">
                                <small class="text-danger" v-if="errors.amount">{{ errors.amount[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">No.Rek</label>
                                <input v-model="form.account_number" type="text" class="form-control" :class="{'is-invalid': errors.account_number}">
                                <small class="text-danger" v-if="errors.account_number">{{ errors.account_number[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Alasan</label>
                                <input v-model="form.reason" type="text" class="form-control" :class="{'is-invalid':errors.reason}">
                                <small class="text-danger" v-if="errors.reason">{{ errors.reason[0] }}</small>
                            </div>
                        </div>
                        <div class="d-flex gap-1 mt-3 mx-3">
                            <RouterLink :to="{name: 'master-sosial.penerima-bansos'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                            <button type="submit" class="btn btn-primary" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? 'Proses update...': 'Update' }}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>