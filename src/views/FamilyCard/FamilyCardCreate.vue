<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { createFamilycard } from '@/services/FamilyCardService';
import { getHeadOfFamilyOptions } from '@/services/citizenService';
import { toast } from '@/utils/swal';

const router = useRouter();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const citizens = ref([]);

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

const getCitizens = async () => {
    try {
        const response = await getHeadOfFamilyOptions();

        citizens.value = response.data.data ?? [];

        console.log(citizens.value);
    } catch (error) {
        console.log(error);
    }
}

const saveData = async () => {
    loading.value = true;
    errors.value = {};
    message.value = "";

    if(!form.value.head_of_family_id){
        errors.value.head_of_family_id = ["Kepala keluarga harus diisi"];
    }

    if(!form.value.family_card_number){
        errors.value.family_card_number = ["No.KK harus diisi"];
    }

    if(!form.value.rt){
        errors.value.rt = ["RT harus diisi"];
    }

    if(!form.value.rw){
        errors.value.rw = ["RW harus diisi"];
    }

    if(!form.value.hamlet){
        errors.value.hamlet = ["Dusun harus diisi"];
    }

    if(!form.value.village){
        errors.value.village = ["Desa harus diisi"];
    }

    if(!form.value.district){
        errors.value.district = ["Kecamatan harus diisi"];
    }

    if(!form.value.regency){
        errors.value.regency = ["Kabupaten harus diisi"];
    }

    if(!form.value.province){
        errors.value.province = ["Provinsi harus diisi"];
    }

    if(!form.value.postal_code){
        errors.value.postal_code = ["Kode pos harus diisi"];
    }

    if(!form.value.address){
        errors.value.address = ['Alamat harus diisi'];
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

        await createFamilycard(formData);
        toast("success","Data kartu keluarga berhasil ditambahkan");

        router.push({
            name: 'master-data.family-card',
        });
    } catch (error) {
        if(error.response?.status === 422){
            errors.value = error.response?.data?.errors || {};
        }
    }finally{
        loading.value = false;
    }
}

onMounted(() => {
    getCitizens();
});

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header">
                <div class="card-title"><h5>Tambah Kartu Keluarga</h5></div>
            </div>
            <div class="card-body">
                <form @submit.prevent="saveData">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for=""> Kepala Keluarga</label>
                                <select v-model="form.head_of_family_id" id="head_of_family_id" class="form-select" :class="{'is-invalid': errors.head_of_family_id}">
                                    <option value="">--- Pilih ---</option>
                                    <option v-for="item in citizens" :value="item.id" :key="item.id">{{ item.full_name }}</option>
                                </select>
                                <small class="text-danger" v-if="errors.head_of_family_id">{{ errors.head_of_family_id[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">No.KK</label>
                                <input type="text" v-model="form.family_card_number" class="form-control" :class="{'is-invalid': errors.family_card_number}" placeholder="Masukkan KK">
                                <small class="text-danger" v-if="errors.family_card_number">{{ errors.family_card_number[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">RT</label>
                                <input type="text" v-model="form.rt" class="form-control" :class="{'is-invalid': errors.rt}" placeholder="Masukkan RT">
                                <small class="text-danger" v-if="errors.rt">{{ errors.rt[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">RW</label>
                                <input type="text" v-model="form.rw" class="form-control" :class="{'is-invalid': errors.rw}" placeholder="Masukkan RW">
                                <small class="text-danger" v-if="errors.rw">{{ errors.rw[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Dusun</label>
                                <input type="text" v-model="form.hamlet" class="form-control" :class="{'is-invalid': errors.hamlet}" placeholder="Masukkan Dusun">
                                <small class="text-danger" v-if="errors.hamlet">{{ errors.hamlet[0] }}</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="">Desa</label>
                                <input type="text" v-model="form.village" class="form-control" :class="{'is-invalid': errors.village}" placeholder="Masukkan Desa">
                                <small class="text-danger" v-if="errors.village">{{ errors.village[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Kecamatan</label>
                                <input type="text" v-model="form.district" class="form-control" :class="{'is-invalid': errors.district}" placeholder="Masukkan Kecamatan">
                                <small class="text-danger" v-if="errors.district">{{ errors.district[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Kabupaten</label>
                                <input type="text" v-model="form.regency" class="form-control" :class="{'is-invalid':errors.regency}" placeholder="Masukkan Kabupaten">
                                <small class="text-danger" v-if="errors.regency">{{ errors.regency[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Provinsi</label>
                                <input type="text" v-model="form.province" class="form-control" :class="{'is-invalid': errors.province}" placeholder="Masukkna Provinsi">
                                <small class="text-danger" v-if="errors.province">{{ errors.province[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Kode Pos</label>
                                <input type="text" v-model="form.postal_code" class="form-control" :class="{'is-invalid': errors.postal_code}" placeholder="Masukkan Kode Pos">
                                <small class="text-danger" v-if="errors.postal_code">{{ errors.postal_code[0] }}</small>
                            </div>
                        </div>
                        <div class="form-group p-4">
                            <label for="">Alamat Lengkap</label>
                            <textarea v-model="form.address" class="form-control" :class="{'is-invalid': errors.address}" rows="4" placeholder="Masukkan Alamat Lengkap"></textarea>
                            <small class="text-danger" v-if="errors.address">{{ errors.address[0] }}</small>
                        </div>
                        <div class="d-flex gap-1 mx-2">
                            <RouterLink :to="{name: 'master-data.family-card'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                            <button type="submit" class="btn btn-info"><i class="fas fa-paper-plane"></i> {{ loading ? 'Proses menyimpan...': 'Simpan' }}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>