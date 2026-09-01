<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from '@/utils/swal';
import { detailFamilyCard, updateFamilyCard } from '@/services/FamilyCardService';
import { getCitizenOptions } from '@/services/citizenService';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const form = ref({
    head_of_family_id: "",
    family_card_number: "",
    rt: "",
    rw: "",
    hamlet: "",
    village: "",
    district: "",
    regency: "",
    province: "",
    postal_code: "",
    address: "",
});

const citizens = ref([]);

const fetchCitizen = async () => {
    try {
        const response = await getCitizenOptions();
        
        citizens.value = response.data.data.data ?? [];

    } catch (error) {
        console.log(error);
    }
}

const getData = async () => {
    try {
        const response = await detailFamilyCard(route.params.id);
        console.log(response.data.data);

        const data = response.data.data;

        form.value.head_of_family_id = data.head_of_family?.id ?? "";
        form.value.family_card_number = data.family_card_number;
        form.value.rt = data.rt;
        form.value.rw = data.rw;
        form.value.hamlet = data.hamlet;
        form.value.village = data.village;
        form.value.district = data.district;
        form.value.regency = data.regency;
        form.value.province = data.province;
        form.value.postal_code = data.postal_code;
        form.value.address = data.address;
    } catch (error) {
        console.log(error);
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
        })

        for (let pair of formData.entries()){
            console.log(pair[0], pair[1]);
        }

        formData.append("_method","PUT");

        await updateFamilyCard(route.params.id, formData);
        toast("success","Data kartu keluarga berhasil diupdate");

        router.push({
            name: 'master-data.family-card',
        });
    } catch (error) {
        if(error.response?.status === 422){
            toast("error","Periksa kembali data yang diinput");

            errors.value = error.response.data.errors;
        }

        console.log(error);
    }finally{
        loading.value = false;
    }
}

onMounted( async () => {
    await fetchCitizen();
    await getData();
});


</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header">
                <div class="card-title"><h5>Edit Kartu Keluarga</h5></div>
            </div>
            <div class="card-body">
                <form @submit.prevent="updateData">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Kepala Keluarga</label>
                                <select v-model="form.head_of_family_id" class="form-select" :class="{'is-invalid': errors.head_of_family_id}">
                                    <option value="">--- Select ---</option>
                                    <option v-for="item in citizens" :value="item.id" :key="item.id">{{ item.full_name }}</option>
                                </select>
                                <small class="text-danger" v-if="errors.head_of_family_id">{{ errors.head_of_family_id[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">No.KK</label>
                                <input type="text" v-model="form.family_card_number" class="form-control" :class="{'is-invalid': errors.family_card_number}">
                                <small class="text-danger" v-if="errors.family_card_number">{{ errors.family_card_number[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">RT</label>
                                <input type="text" v-model="form.rt" class="form-control" :class="{'is-invalid': errors.rt}">
                            </div>
                            <div class="form-group">
                                <label for="">RW</label>
                                <input type="text" v-model="form.rw" class="form-control" :class="{'is-invalid': errors.rw}">
                                <small class="text-danger" v-if="errors.rw">{{ errors.rw[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Dusun</label>
                                <input type="text" v-model="form.hamlet" class="form-control" :class="{'is-invalid': errors.hamlet}">
                                <small class="text-danger" v-if="errors.hamlet">{{ errors.hamlet[0] }}</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Desa</label>
                                <input type="text" v-model="form.village" class="form-control" :class="{'is-invalid': errors.village}">
                                <small class="text-danger" v-if="errors.village">{{ errors.village[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Kecamatan</label>
                                <input type="text" v-model="form.district" class="form-control" :class="{'is-invalid': errors.district}">
                                <small class="text-danger" v-if="errors.district">{{ errors.district[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Kabuaten</label>
                                <input type="text" v-model="form.regency" class="form-control" :class="{'is-invalid': errors.regency}">
                                <small class="text-danger" v-if="errors.regency">{{ errors.regency[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Provinsi</label>
                                <input type="text" v-model="form.province" class="form-control" :class="{'is-invalid':errors.province}">
                                <small class="text-danger" v-if="errors.province">{{ errors.province[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Kode Pos</label>
                                <input type="text" v-model="form.postal_code" class="form-control" :class="{'is-invalid': errors.postal_code}">
                                <small class="text-danger" v-if="errors.postal_code">{{ errors.postal_code[0] }}</small>
                            </div>
                        </div>
                        <div class="mx-2">
                            <div class="form-group">
                                <label for="">Alamat</label>
                                <textarea v-model="form.address" class="form-control" rows="3" :class="{'is-invalid': errors.address}"></textarea>
                                <small class="text-danger" v-if="errors.address">{{ errors.address[0] }}</small>
                            </div>
                        </div>
                        <div class="d-flex gap-1 mx-3">
                            <RouterLink :to="{name: 'master-data.family-card'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                            <button class="btn btn-info"><i class="fas fa-paper-plane"></i> {{ loading ? "proses update...": "Update" }}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>