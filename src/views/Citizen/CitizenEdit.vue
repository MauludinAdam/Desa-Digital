<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "@/utils/swal";
import { detailCitizen, updateCitizen } from "@/services/citizenService";
import { getFamilyCardOptions } from "@/services/FamilyCardService";
import { getOccupationOptions } from "@/services/OccupationService";
import { getEducationOptions } from "@/services/EducationService";
import { getReligionOption } from "@/services/ReligionService";

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const message = ref("");
const errors = ref({});

const familyCards = ref([]);
const educations = ref([]);
const occupations = ref([]);
const religions = ref("");

const form = ref({
    family_card_id: "",
    full_name: "",
    phone_number: "",
    occupation_id: "",
    education_id: "",
    religion_id: "",
    blood_type: "",
    marital_status: "",
    email: "",
    status: "",
});

const getData = async () => {
    try {
        const response = await detailCitizen(route.params.id);
        console.log(response.data.data);
        const data = response.data.data;

        religions.value = data.religion?.name;

        form.value.full_name = data.full_name;
        form.value.nik = data.nik;
        form.value.phone_number = data.phone_number;
        form.value.gender = data.gender;
        form.value.place_of_birth = data.place_of_birth;
        form.value.date_of_birth = data.date_of_birth;
        form.value.occupation_id = data.occupation.id;
        form.value.religion_id = data.religion.id;
        form.value.education_id = data.education.id;
        form.value.blood_type = data.blood_type;
        form.value.nationality = data.nationality;
        form.value.marital_status = data.marital_status;
        form.value.phone_number = data.phone_number;
        form.value.email = data.email;
        form.value.status = data.status;
    } catch (error) {
        console.log(error);
    }
};

const fetchFamilyCard = async () => {
    try {
        const response = await getFamilyCardOptions();
        console.log(response.data.data);
        familyCards.value = response.data.data.data;

        console.log(familyCards.data);
    } catch (error) {
        console.log(error);
    }
};

const fetchOccupation = async () => {
    try {
        const response = await getOccupationOptions(route.params.id);
        occupations.value = response.data.data.data;
    } catch (error) {
        console.log(error);
    }
};

const fetchEducation = async () => {
    try {
        const response = await getEducationOptions();
        educations.value = response.data.data.data;
    } catch (error) {
        console.log(error);
    }
};

const fetchReligion = async () => {
    try {
        const response = await getReligionOption(route.params.id);

        religions.value = response.data.data;
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
            if(form.value[key] !== null && form.value[key] !== "") {
                formData.append(key, form.value[key]);
            }
        });

        for(let pair of formData.entries()){
            console.log(pair[0], pair[1]);
        }

        formData.append("_method", "PUT");

        await updateCitizen(route.params.id, formData);

        toast("success","Data Penduduk berhasil diperbaruin");

        router.push({
            name: 'master-data.citizen',
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
};

onMounted(() => {
    fetchEducation();
    fetchFamilyCard();
    fetchOccupation();
    fetchReligion();
    getData();
});

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header">
                <div class="card-title"><h5>Edit Penduduk</h5></div>
            </div>
            <div class="card-body">
                <form @submit.prevent="updateData">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="">Nama Lengkap</label>
                                <input type="text" v-model="form.full_name" class="form-control" :class="{'is-invalid': errors.full_name}">
                                <small class="text-danger" v-if="errors.full_name">{{ errors.full_name[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">NIK</label>
                                <input type="text" v-model="form.nik" class="form-control" readonly>
                            </div>
                            <div class="form-group">
                                <label for="">jenis Kelamin</label>
                               <input type="text" class="form-control" :value="form.gender ? 'Laki-Laki' : 'perempuan'" readonly>
                            </div>
                           <div class="form-group">
                                <label for="">Email</label>
                                <input type="email" v-model="form.email" class="form-control" :class="{'is-invalid': errors.email}">
                                <small class="text-danger" v-if="errors.email">{{ errors.email[0] }}</small>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="form-group">
                                <label for="">Tempat Lahir</label>
                                <input type="text" v-model="form.place_of_birth" class="form-control" :class="{'is-invalid': errors.place_of_birth}">
                                <small class="text-danger" v-if="errors.place_of_birth">{{ errors.place_of_birth[0] }}</small>
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
                                <label for="">Tanggal Lahir</label>
                                <input type="date" v-model="form.date_of_birth" class="form-control" :class="{'is-invalid':errors.date_of_birth}">
                                <small class="text-danger" v-if="errors.date_of_birth">{{ errors.date_of_birth[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Status Kawin</label>
                                <select v-model="form.marital_status" class="form-select" :class="{'is-invalid': errors.marital_status}">
                                    <option value="">--- Select ---</option>
                                    <option value="single">Lajang</option>
                                    <option value="married">Menikah</option>
                                    <option value="widower">Duda</option>
                                    <option value="widow">Janda</option>
                                </select>
                                <small class="text-danger" v-if="errors.marital_status">{{ errors.marital_status[0] }}</small>
                            </div>
                            
                        </div>
                        <div class="col-lg-4">
                            <div class="form-group">
                                <label for="">No.Tel</label>
                                <input type="text" v-model="form.phone_number" class="form-control" :class="{'is-invalid': errors.phone_number}">
                                <small class="text-danger" v-if="errors.phone_number">{{ errors.phone_number[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Pekerjaan</label>
                                <select v-model="form.occupation_id" class="form-select" :class="{'is-invalid': errors.occupation}">
                                    <option value="">--- Select ---</option>
                                    <option v-for="item in occupations" :value="item.id" :key="item.id">{{ item.name }}</option>
                                </select>
                                <small class="text-danger" v-if="errors.occupation">{{ errors.occupation[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Agama</label>
                                <input type="text" :value="religions" class="form-control" readonly>
                            </div>
                            <div class="form-group">
                                <label for="">Pendidikan</label>
                                <select v-model="form.education_id" class="form-select" :class="{'is-invalid': errors.education_id}">
                                    <option value="">--- Pilih Pendidikan ---</option>
                                    <option v-for="item in educations" :value="item.id" :key="item.id">{{ item.name }}</option>
                                </select>
                                <small class="text-danger" v-if="errors.education_id">{{ errors.education_id[0] }}</small>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                        <label for="">Status</label>
                                        <select v-model="form.status" class="form-select" :class="{'is-invalid': errors.status}">
                                            <option value="">--- Pilih Status ---</option>
                                            <option value="active">Active</option>
                                            <option value="moved">Moved</option>
                                            <option value="deceased">Deceased</option>
                                        </select>
                                        <small class="text-danger" v-if="errors.status">{{ errors.status[0] }}</small>
                                    </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                <label for="">Warga Negara</label>
                                <input type="text" v-model="form.nationality" class="form-control" readonly>
                            </div>
                            </div>
                        </div>
                        <div class="d-flex gap-1 mx-3">
                            <RouterLink :to="{name: 'master-data.citizen'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                            <button @click="updateData" type="submit" class="btn btn-info"><i class="fas fa-paper-plane"></i>{{ loading ? "Proses update...": "Update" }}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>