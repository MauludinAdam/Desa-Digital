<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { toast } from '@/utils/swal';
import Swal from 'sweetalert2';
import { getCitizenOptions } from '@/services/citizenService';
import { getLetterType, getLetterTypeOptions } from '@/services/LetterType';
import { createLetter, getLetters, updateLetter } from '@/services/LetterService';

const letters = ref([]);

const citizens = ref([]);
const letterTypes = ref([]);

const loading = ref(false);
const errors = ref({});
const message = ref("");

const search = ref('');

const getStatusClass = (status) => {
    switch (status) {
        case "approved":
            return "bg-success";
        case "pending":
            return "bg-warning";
        case "rejected":
            return "bg-danger";
        default:
            return "bg-secodary";
    }
}

const getStatusText = (status) => {
    switch (status) {
        case "approved":
            return "approved";
        case "pending":
            return "pending";
        case "rejected":
            return "rejected";
        default:
            return "-";
    }
}

// pagination
const currentPage = ref(1);
const perPage = ref(10);
const lastPage = ref(1);
const totalData = ref(0);

const getData = async () => {
    try {
        loading.vue = true;
        errors.value = {};
        message.value = '';

        const response = await getLetters({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value || null,
        });

        console.log(response.data);

        letters.value = response.data.data.data;

        currentPage.value = response.data.data.meta.current_page;
        lastPage.value = response.data.data.meta.last_page;
        totalData.value = response.data.data.meta.total;

    } catch (error) {
        console.log(error)
    }finally{
        loading.value = false;
    }
}

const changePage = (page) => {
    if(page < 1 || page > lastPage.value){
        return;
    }

    currentPage.value - page;

    getData();
}

let timeout = null;
const debounceSearch = () => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        currentPage.value = 1;
        getData();
    }, 500);
}

const isSearching = computed(() => {
    return search.value !== "";
});

watch(search, () => {
    debounceSearch();
});

watch(perPage, () => {
    currentPage.value = 1;
    getData();
});

// Modal tambah dan edit data
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);

const getCitizens = async () => {
    try {
        const response = await getCitizenOptions();

        citizens.value = response.data.data.data ?? [];

        console.log(citizens.value);
    } catch (error) {
        console.log(error);
    }
}

const getLetterTypes = async () => {
    try {
        const response = await getLetterTypeOptions();

        letterTypes.value = response.data.data.data ?? [];

        console.log(letterTypes.value);
    } catch (error) {
        console.log(error);
    }
}

const form = ref({
    citizen_id: "",
    letter_type_id: "",
    purpose: "",
});

const openLetter = async () => {
    isEdit.value = false;
    editId.value = null;
    form.value = {
        citizen_id: '',
        letter_type_id: '',
        purpose: '',
    }

    errors.value = {};

    showModal.value = true;
}

const saveData = async () => {
    message.value = "";
    errors.value = {};

    // validation
    if(!form.value.citizen_id){
        errors.value.citizen_id = ["Pemohon harus diisi"];
    }

    if(!form.value.letter_type_id){
        errors.value.letter_type_id = ["Jenis surat harus diisi"];
    }

    if(!form.value.purpose){
        errors.value.purpose = ["Tujuan harus diisi"];
    }

    if(Object.keys(errors.value).length > 0) {
        return;
    }

    try {
        loading.value = true;
        const editing = isEdit.value;

        const payload = {
            citizen_id: form.value.citizen_id,
            letter_type_id: form.value.letter_type_id,
            purpose: form.value.purpose,
        }

        if(editing){
            await updateLetter(editId.value, payload);
        }else{
            await createLetter(payload);
        }

        closeLetterModal();

        await getData();

        toast("success", editing ? "Data surat berhasil diperbarui" : "Data surat berhasil ditambahkan");
    } catch (error) {
        console.log(error);

        if(error.response?.status === 422){
            errors.value = error.response.data.errors || {};
            return;
        }

        toast("error", error.response?.data?.message || "Gagal menambahkan data surat");
    }finally{
        loading.value = false;
    }
}

const openEditLetter = (item) => {
    isEdit.value = true;
    editId.value = item.id;

    form.value = {
        citizen_id: item.citizen?.id ?? '',
        letter_type_id: item.letter_type_id,
        purpose: item.purpose,
    };

    errors.value = {};

    showModal.value = true;
}

const closeLetterModal = () => {
    showModal.value = false;

    isEdit.value = false;
    editId.value = null;

    form.value = {
        citizen_id: '',
        letter_type_id: '',
        purpose: '',
    };

    errors.value = {};
}

onMounted(() => {
    getData();
    getCitizens();
    getLetterTypes();
});

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header d-flex justify-content-between">
                <div class="card-title"><h5>Data Lampiran Surat</h5></div>
                <div class="card-tools">
                    <button v-if="isAdmin" @click="openLetter" class="btn btn-primary"><i class="fas fa-plus"></i> Tambah Data</button>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex mb-2 justify-content-between">
                    <div class="show gap-1 d-flex align-items-center">
                        <label for="">Show:</label>
                        <select v-model="perPage" class="form-select">
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                            <option :value="100">100</option>
                        </select>
                        <label for="">Entries</label>
                    </div>
                    <div class="searching">
                        <input type="text" v-model="search" class="form-control" placeholder="Search Here.." style="width: 15rem;">
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th width="5%">No</th>
                                <th>No.Surat</th>
                                <th>Jenis Surat</th>
                                <th>Pemohon</th>
                                <th>Tujuan</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="letters.length > 0" v-for="(item, index) in letters" :key="item.id">
                                <td class="text-center">{{ (currentPage - 1) * perPage + index + 1 }}</td>
                                <td>{{ item.letter_number }}</td>
                                <td>{{ item.letter_type?.name }}</td>
                                <td>{{ item.citizen?.full_name }}</td>
                                <td>{{ item.purpose }}</td>
                                <td>
                                    <span class="badge" :class="getStatusClass(item.status)">
                                        {{ getStatusText(item.status) }}
                                    </span>
                                </td>
                                <td>
                                    <RouterLink :to="{name: 'master-surat.surat-detail', params: {id:item.id}}" class="btn btn-info btn-sm"><i class="fas fa-eye"></i></RouterLink>
                                    <button v-if="isAdmin" @click="openEditLetter(item)" class="btn btn-warning btn-sm mx-1"><i class="fas fa-pen-square"></i></button>
                                    <button v-if="isAdmin" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr v-else>
                                <td colspan="7" class="text-center">
                                    <i class="fas fa-folder-closed"></i> 
                                    {{ isSearching ? 'Data tidak ditemukan!' : 'Belum ada data!' }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex mt-3 justify-content-between align-items-center">
                    <div class="page">
                        <span>Halaman {{ currentPage }} dari {{ lastPage }}</span>
                    </div>
                    <div class="pagination">
                        <div class="nav">
                            <nav aria-label="...">
                                <ul class="pagination">
                                    <li class="page-item" :class="{disabled: currentPage === 1}">
                                    <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                                    </li>

                                    <li v-for="page in lastPage" class="page-item" :key="page" :class="{active: currentPage === page}">
                                        <button class="page-link">{{ page }}</button>
                                    </li>
                
                                    <li class="page-item" :class="{disabled: currentPage === lastPage}">
                                    <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- modal tambah dan edit data -->
     <Transition name="modal">
        <div v-if="showModal" class="modal" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ isEdit ? 'Edit Surat' : 'Tambah Surat' }}</h5>
                    <button @click="closeLetterModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="saveData">
                        <div class="form-group">
                            <label for="">Jenis Surat</label>
                            <select v-model="form.letter_type_id" class="form-select" :class="{'is-invalid': errors.letter_type_id}">
                                <option value="">--- Pilih ---</option>
                                <option v-for="item in letterTypes" :value="item.id" :key="item.id">{{ item.name }}</option>
                            </select>
                            <small class="text-danger" v-if="errors.letter_type_id">{{ errors.letter_type_id[0] }}</small>
                        </div>
                        <div class="form-group">
                            <label for="">Pemohon</label>
                            <select v-model="form.citizen_id" class="form-select" :class="{'is-invalid': errors.citizen_id}">
                                <option value="">--- Pilih ---</option>
                                <option v-for="item in citizens" :value="item.id" :key="item.id">{{ item.full_name }}</option>
                            </select>
                            <small class="text-danger" v-if="errors.citizen_id">{{ errors.citizen_id[0] }}</small>
                        </div>
                        <div class="form-group">
                            <label for="">Tujuan</label>
                            <input type="text" v-model="form.purpose" class="form-control" :class="{'is-invalid': errors.purpose}" placeholder="Masukkan Tujuan">
                            <small class="text-danger" v-if="errors.purpose">{{ errors.purpose[0] }}</small>
                        </div>                    
                        <div class="modal-footer">
                            <button @click="closeLetterModal" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" :disabled="loading">{{ loading ? 'Proses menyimpan...' : isEdit ? 'Update' : 'Simpan' }}</button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
     </Transition>

     <Transition name="backdrop">
        <div v-if="showModal" class="modal-backdrop fade show"></div>
     </Transition>

</template>

<style scoped>
    .table-scroll{
        width: 100%;
        overflow-y: auto;
        white-space: nowrap;
    }

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.backdrop-enter-active,
.backdrop-leave-active {
    transition: opacity 0.2s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
    opacity: 0;
}

.modal-enter.active .modal-dialog,
.modal-leave.active .modal-dialog {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .modal-dialog,
.modal-leave-to .modal-dialog {
    transform:  translateY(-20px);
    opacity: 0;
}
</style>