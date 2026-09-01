<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { createCitizen } from '@/services/citizenService';
import { getReligionOption } from '@/services/ReligionService';
import { getEducationOptions } from '@/services/EducationService';
import { getFamilyCardOptions } from '@/services/FamilyCardService';
import { toast } from '@/utils/swal';
import { getOccupationOptions } from '@/services/OccupationService';

const router = useRouter();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const occupations = ref([]);
const educations = ref([]);
const religions = ref([]);

const fetchFamilyCards = async () => {
    try {
        const response = await getFamilyCardOptions();

        familyCards.value = response.data.data.data;
    } catch (error) {
        console.log(error)
    }
}

const fetchOccupations = async () => {
    try {
        const response = await getOccupationOptions();

        occupations.value = response.data.data.data;
    } catch (error) {
        console.log(error);
    }
}

const fetchReligions = async () => {
    try {
        const response = await getReligionOption();

        religions.value = response.data.data.data;
    } catch (error) {
        console.log(error);
    }
}

const fetchEducations = async () => {
    try {
        const response = await getEducationOptions();

        educations.value = response.data.data.data;
    } catch (error) {
        console.log(error);
    }
}

const form = ref ({
    full_name: "",
    nik: "",
    gender: "",
    place_of_birth: "",
    date_of_birth: "",
    phone_number: "",
    occupation_id: "",
    religion_id: "",
    education_id: "",
    marital_status: "",
    blood_type: "",
    email: "",
    nationality: "",
    status: "",
});



const saveData = async () => {
    errors.value = {};
    message.value = "";

    // Data Penduduk
    if(!form.value.full_name){
        errors.value.full_name = ["Nama lengkap harus diisi"];
    }

    if(!form.value.nik){
        errors.value.nik = ["NIK harus diisi"];
    }

    if(!form.value.gender){
        errors.value.gender = ["jenis kelamin harus diisi"];
    }

    if(!form.value.place_of_birth){
        errors.value.place_of_birth = ["Tempat lahir harus diisi"];
    }

    if(!form.value.date_of_birth){
        errors.value.date_of_birth = ["Tanggal lahir harus diisi"];
    }

    if(!form.value.phone_number){
        errors.value.phone_number = ["No.Telp harus diisi"];
    }

    if(!form.value.occupation_id){
        errors.value.occupation_id = ["Pekerjaan harus diisi"];
    }

    if(!form.value.religion_id){
        errors.value.religion_id = ["Agama harus diisi"];
    }

    if(!form.value.education_id){
        errors.value.education_id = ["Pendidikan harus diisi"];
    }

    if(!form.value.marital_status){
        errors.value.marital_status = ["Status perkawinan harus diisi"];
    }

    if(!form.value.blood_type){
        errors.value.blood_type = ["Golongan darah harus diisi"];
    }

    if(!form.value.email){
        errors.value.email = ["Email harus diisi"];
    }

    if(!form.value.nationality){
        errors.value.nationality = ["Kewarganegaraan harus diisi"];
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
            formData.append(key, form.value[key] ?? '');
        });

        for (let pair of formData.entries()){
            console.log(pair[0], pair[1]);
        }

        await createCitizen(formData);
        toast("success","Data penduduk berhasil ditambahkan!");

        router.push({
            name: 'master-data.citizen',
        });
    } catch (error) {
        console.log("RESPONSE:", error.response?.data);

        if(error.response?.status === 422){
            errors.value = error.response.data.errors;

        // console.log("ERRORS VALUE:", errors.value);
        // console.log("NIK ERROR:", errors.value.nik);
        }
    }finally{
        loading.value = false;
    }
};

onMounted(() => {
    fetchFamilyCards();
    fetchOccupations();
    fetchReligions();
    fetchEducations();
});

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header">
                <div class="card-title"><h5>Create Data Penduduk</h5></div>
            </div>
            <div class="card-body">
                <form @submit.prevent="saveData">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="">Nama Lengkap</label>
                                <input type="text" v-model="form.full_name" class="form-control" :class="{'is-invalid': errors.full_name}" placeholder="Masukan Nama Lengkap">
                                <small class="text-danger" v-if="errors.full_name">{{ errors.full_name[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">NIK</label>
                                <input type="text" v-model="form.nik" class="form-control" :class="{'is-invalid': errors.nik}" placeholder="Masukkan NIK">
                                <small class="text-danger" v-if="errors.nik">{{ errors.nik[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Golongan Darah</label>
                                <select v-model="form.blood_type" class="form-select" :class="{'is-invalid': errors.blood_type}">
                                    <option value="">--- Select ---</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="AB">AB</option>
                                    <option value="O">O</option>
                                </select>
                                <small class="text-danger" v-if="errors.blood_type">{{ errors.blood_type[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Email</label>
                                <input type="email" v-model="form.email" class="form-control" :class="{'is-invalid': errors.email}" placeholder="Masukkan Email">
                                <small class="text-danger" v-if="errors.email">{{ errors.email[0] }}</small>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="">Jenis Kelamin</label>
                                <select v-model="form.gender" class="form-select" :class="{'is-invalid': errors.gender}">
                                    <option value="">--- Pilih jenis Kelamin ---</option>
                                    <option value="male">Laki-Laki</option>
                                    <option value="female">Perempuan</option>
                                </select>
                                <small class="text-danger" v-if="errors.gender">{{ errors.gender[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Tempat Lahir</label>
                                <input type="text" v-model="form.place_of_birth" class="form-control" :class="{'is-invalid': errors.place_of_birth}" placeholder="Masukan Tempat Lahir">
                                <small class="text-danger" v-if="errors.place_of_birth">{{ errors.place_of_birth[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Tanggal Lahir</label>
                                <input type="date" v-model="form.date_of_birth" class="form-control" :class="{'is-invalid': errors.date_of_birth}">
                                <small class="text-danger" v-if="errors.date_of_birth">{{ errors.date_of_birth[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Status Perkawinan</label>
                                <select v-model="form.marital_status" class="form-select" :class="{'is-invalid': errors.marital_status}">
                                    <option value="">--- Pilih Status---</option>
                                    <option value="single">Lajang</option>
                                    <option value="married">Menikah</option>
                                    <option value="widower">Duda</option>
                                    <option value="widow">Janda</option>
                                </select>
                                <small class="text-danger" v-if="errors.marital_status">{{ errors.marital_status[0] }}</small>
                            </div>
                            
                        </div>
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="">No.Telp</label>
                                <input type="text" v-model="form.phone_number" class="form-control" :class="{'is-invalid': errors.phone_number}" placeholder="Masukkan No.Telp">
                                <small class="text-danger" v-if="errors.phone_number">{{ errors.phone_number[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Pekerjaan</label>
                                <select v-model="form.occupation_id" class="form-select" :class="{'is-invalid': errors.occupation_id}">
                                    <option value="">--- Pilih pekerjaan ---</option>
                                    <option v-for="item in occupations" :value="item.id" :key="item.id">{{ item.name }}</option>
                                </select>
                                <small class="text-danger" v-if="errors.occupation_id">{{ errors.occupation_id[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Agama</label>
                                <select v-model="form.religion_id" class="form-select" :class="{'is-invalid': errors.religion_id}">
                                    <option value="">--- Pilih Agama ---</option>
                                    <option v-for="item in religions" :value="item.id" :key="item.id">{{ item.name }}</option>
                                </select>
                                <small class="text-danger" v-if="errors.religion_id">{{ errors.religion_id[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Pendidikan</label>
                                <select v-model="form.education_id" class="form-select" :class="{'is-invalid':errors.education_id}">
                                    <option value="">--- Pilih Pendidikan ---</option>
                                    <option v-for="item in educations" :value="item.id" :key="item.id">{{ item.name }}</option>
                                </select>
                                <small class="text-danger" v-if="errors.education_id">{{ errors.education_id[0] }}</small>
                            </div>
                            
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                <label for="">Warga Negara</label>
                                <select v-model="form.nationality" class="form-select" :class="{'is-invalid': errors.nationality}">
                                    <option value="">--- Pilih Warga Negara ---</option>
                                    <option value="wni">WNI</option>
                                    <option value="wna">WNA</option>
                                </select>
                                <small class="text-danger" v-if="errors.nationality">{{ errors.nationality[0] }}</small>
                            </div>
                        </div>
                        <div class="col-md-6">
                                <div class="form-group">
                                <label for="">Status</label>
                                <select v-model="form.status" class="form-select" :class="{'is-invalid': errors.status}">
                                    <option value="">--- Select ---</option>
                                    <option value="active">Active</option>
                                    <option value="moved">Moved</option>
                                    <option value="deceased">Deceased</option>
                                </select>
                                <small class="text-danger" v-if="errors.status">{{ errors.status[0] }}</small>
                            </div>
                            </div>
                        </div>
                        <div class="d-flex gap-1 mt-3 mx-2">
                            <RouterLink :to="{name: 'master-data.citizen'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                            <button @click="saveData" type="submit" class="btn btn-info" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? "Proses menyimpan..." : "Simpan" }}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>