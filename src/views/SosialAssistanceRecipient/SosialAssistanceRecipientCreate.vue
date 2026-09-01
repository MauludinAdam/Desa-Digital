<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { toast } from '@/utils/swal';
import { createSosialAssistanceRecipient } from '@/services/SosialAssitanceRecipient';
import { getSosialAssistanceOptions } from '@/services/SosialAssistance';
import { getCitizenOptions } from '@/services/citizenService';

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const sosialAssistanceRecipient = ref([]);
const citizens = ref([]);
const sosialAssistances = ref([]);

const form = ref({
    citizen_id: '',
    sosial_assistance_id: '',
    bank: '',
    amount: '',
    reason: '',
    account_number: '',
});

const getCitizens = async () => {
    try {
        const response = await getCitizenOptions();

        citizens.value = response.data.data.data ?? [];

        console.log(citizens.value);
    } catch (error) {
        console.log(error);
    }
}

const getSosialAssistances = async () => {
    try {
        const response = await getSosialAssistanceOptions();

        sosialAssistances.value = response.data.data.data ?? [];

        console.log(sosialAssistances.value);
    } catch (error) {
        console.log(error);
    }
}

const saveData = async () => {
    loading.value = true;
    errors.value = {};
    message.value = "";

    if(!form.value.citizen_id){
        errors.value.citizen_id = ["Penerima bantuan harus diisi"];
    }

    if(!form.value.sosial_assistance_id){
        errors.value.sosial_assistance_id = ["Bantuan sosial harus diisi"];
    }

    if(!form.value.amount){
        errors.value.amount = ["Jumlah harus diisi"];
    }

    if(!form.value.bank){
        errors.value.bank = ["Nama bank harus diisi"];
    }

    if(!form.value.reason){
        errors.value.reason = ["Alasan penerima bantuan harus diisi"];
    }

    if(!form.value.account_number){
        errors.value.account_number = ["No. Rekening harus diisi"];
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

        await createSosialAssistanceRecipient(formData);
        toast("success","Data penerima bansos berhasil ditambahkan.");

        router.push({
            name: 'master-sosial.penerima-bansos',
        });
    } catch (error) {
        if(error.response?.status === 422){
            errors.value = error.response?.data.errors || {};
        }
    }finally{
        loading.value = false;
    }
}

onMounted(() => {
    getCitizens();
    getSosialAssistances();
});

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header">
                <div class="card-title"><h5>Tambah Data Penerima Bansos</h5></div>
            </div>
            <div class="card-body">
                <form @submit.prevent="saveData">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Penerima Bansos</label>
                                <select v-model="form.citizen_id" class="form-control" :class="{'is-invalid': errors.citizen_id}">
                                    <option value="">--- Pilih ---</option>
                                    <option v-for="item in citizens" :key="item.id" :value="item.id">{{ item.full_name }}</option>
                                </select>
                                <small class="text-danger" v-if="errors.citizen_id">{{ errors.citizen_id[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Nama Bansos</label>
                                <select v-model="form.sosial_assistance_id" class="form-control" :class="{'is-invalid': errors.sosial_assistance_id}">
                                    <option value="">--- Pilih ---</option>
                                    <option v-for="item in sosialAssistances" :value="item.id" :key="item.id">{{ item.name }}</option>
                                </select>
                                <small class="text-danger" v-if="errors.sosial_assistance_id">{{ errors.sosial_assistance_id[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Nama Bank</label>
                                <select v-model="form.bank" class="form-control" :class="{'is-invalid': errors.bank}">
                                    <option value="">--- Pilih ---</option>
                                    <option value="bri">BRI</option>
                                    <option value="bni">BNI</option>
                                    <option value="mandiri">MANDIRI</option>
                                    <option value="bca">BCA</option>
                                </select>
                                <small class="text-danger" v-if="errors.bank">{{ errors.bank[0] }}</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Jumlah</label>
                                <input type="text" v-model="form.amount" class="form-control" :class="{'is-invalid': errors.amount}" placeholder="Masukkan Jumlah">
                                <small class="text-danger" v-if="errors.amount">{{ errors.amount[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">No. Rekening</label>
                                <input type="text" v-model="form.account_number" class="form-control" :class="{'is-invalid': errors.account_number}" placeholder="Masukkan No.Rekening">
                                <small class="text-danger" v-if="errors.account_number">{{ errors.account_number[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Alasan</label>
                                <input type="text" v-model="form.reason" class="form-control" :class="{'is-invalid': errors.reason}" placeholder="Masukkan Alasan penerima bantuan">
                                <small class="text-danger" v-if="errors.reason">{{ errors.reason[0] }}</small>
                            </div>
                        </div>
                        <div class="d-flex gap-1 mx-3 mt-3">
                            <RouterLink :to="{name: 'master-sosial.penerima-bansos'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                            <button class="btn btn-primary" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? 'Proses menyimpan...': 'Simpan' }}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>