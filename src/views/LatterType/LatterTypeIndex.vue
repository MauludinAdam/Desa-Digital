<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Swal from 'sweetalert2';
import { createLetterType, deleteLetterType, getLetterType, updateLetterType } from '@/services/LetterType';
import { toast } from '@/utils/swal';

import { useAuth } from '@/helpers/auth';

const { user, isAdmin, isHeadman } = useAuth();

const letterType = ref([]);

const loading = ref(false);
const errors = ref({});
const message = ref("");

const search = ref('');

// pagination
const currentPage = ref(1);
const perPage = ref(10);
const totalData = ref(0);
const lastPage = ref(1);

const getData = async () => {
    try {
        loading.value = true;
        errors.value = '';

        const response = await getLetterType({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value || null,
        });

        console.log(response.data);

        letterType.value = response.data.data.data;

        currentPage.value = response.data.data.meta.current_page;
        lastPage.value = response.data.data.meta.last_page;
        totalData.value = response.data.data.meta.total;

    } catch (error) {
        console.log(error);
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

// modal tambah type surat
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);

const form = ref({
    name: '',
    code: '',
    description: '',
});

const openLetter = async () => {
    isEdit.value = false;
    editId.value = null;
    form.value = {
        code: '',
        name: '',
        description: '',
    }

    errors.value = {};

    showModal.value = true;
}

const saveData = async () => {
    message.value = "";
    errors.value = {};

    // validasin
    if(!form.value.name){
        errors.value.name = ["Nama harus diisi"];
    }

    if(!form.value.code) {
        errors.value.code = ["Kode harus diisi"];
    }

    if(!form.value.description){
        errors.value.description = ["Deskripsi harus diisi"];
    }

    if(Object.keys(errors.value).length > 0) {
        return;
    }

    try {
        loading.value = true;
        const editing = isEdit.value;

        const payload = {
            name: form.value.name,
            code: form.value.code,
            description: form.value.description,
        }

        if(editing){
            await updateLetterType(editId.value, payload);
        }else{

            await createLetterType(payload);
        }


        closeLetterModal();

        await getData();

        toast("success", editing ? "Type surat berhasil diperbarui" : 'Type surat berhasil ditambahkan');
        
    } catch (error) {
        console.log(error);

        if(error.response?.status === 422){
            errors.value = error.response.data.errors || {};
            return;
        }

        toast("error", error.response?.data?.message || "Gagal menambhakan type data");
    }finally{
        loading.value = false;
    }
}

const openEditModal = (item) => {
    isEdit.value = true;
    editId.value = item.id;

    form.value = {
        name: item.name,
        code: item.code,
        description: item.description,
    };

    errors.value = {};

    showModal.value = true;
}

const closeLetterModal = () => {
    showModal.value = false;

    isEdit.value = false;
    editId.value = null;

    form.value = {
        name: '',
        code: '',
        description: '',
    };

    errors.value = {};
}

// delete data
const deleteData = async (id) => {
    const result = await Swal.fire({
        title: "Apakah Anda Yakin ?",
        text: "Data yang dihapus tidak dapat dikembalikan!.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",                      
    });

    if(!result.isConfirmed) return;

    try {
        await deleteLetterType(id);

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Data berhasil dihapus",
            showConfirmButton:false,
            timer: 3000,
        });

        getData();
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ooooops",
            text: "Gagal mengahapus data."
        });

        console.log(error);
    }

}

onMounted(() => {
    getData();
});

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header d-flex justify-content-between">
                <div class="card-title"><h5>Data Type Surat</h5></div>
                <div class="card-tools">
                    <button v-if="isAdmin" @click="openLetter" class="btn btn-primary"><i class="fas fa-plus"></i> Tambah Data</button>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                    <div class="d-flex gap-1 align-items-center">
                        <label for="">Show:</label>
                        <select v-model="perPage" class="form-select" style="width: 5rem;">
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                            <option :value="100">100</option>
                            <label for="">Entries</label>
                        </select>
                    </div>
                    <div class="searching">
                        <input type="text" v-model="search" class="form-control" placeholder="Search Here..." style="width: 15rem;">
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="table table-striped table-bordered table-responsive">
                        <thead>
                            <tr>
                                <th width="5%">No</th>
                                <th class="text-center">Kode</th>
                                <th>Nama</th>
                                <th>Deskripsi</th>
                                <th v-if="isAdmin">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="letterType.length > 0" 
                                v-for="(item, index) in letterType" :key="item.id">
                                <td>{{ (currentPage - 1) * index + index + 1 }}</td>
                                <td class="text-center">{{ item.code }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.description }}</td>
                                <td class=" d-flex gap-1" v-if="isAdmin">
                                    <button @click="openEditModal(item)" class="btn btn-warning btn-sm"><i class="fas fa-pen-square"></i></button>
                                    <button @click="deleteData(item.id)" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr v-else>
                                <td colspan="7" class="text-center py-4">
                                    <p class="text-center"><i class="fas fa-folder"></i></p>
                                    <p class="text-center">{{ isSearching ? 'Data tidak ditemukan': 'Data belum ada!.' }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex justify-content-between">
                    <div class="page">
                        <span>Halaman {{ currentPage }} dari {{ lastPage }}</span>
                    </div>
                    <div class="pagination">
                        <nav aria-label="navigation page">
                            <ul class="pagination">
                                <li class="page-item" :class="{disabled: currentPage === 1}">
                                <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                                </li>
                                <li class="page-item" v-for="page in lastPage" :key="page" :class="{active: currentPage === page}">
                                    <button class="page-link" >{{ page }}</button>
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

    <!-- modal tambah dan edit letter type -->
<Transition name="modal">
<div v-if="showModal" class="modal" tabindex="-1" style="display: block;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ isEdit ? 'Edit Type surat': 'Tambah Type Surat' }}</h5>
        <button type="button" @click="closeLetterModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="saveData">
            <div class="form-group">
                <label for="">Kode</label>
                <input type="text" v-model="form.code" class="form-control" :class="{'is-invalid':errors.code}" placeholder="Masukkan Kode">
                <small class="text-danger" v-if="errors.code">{{ errors.code[0] }}</small>
            </div>
            <div class="form-group">
                <label for="">Nama</label>
                <input type="text" v-model="form.name" class="form-control" :class="{'is-invalid': errors.name}" placeholder="Masukkan Nama">
                <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
            </div>
            <div class="form-group">
                <label for="">Deskripsi</label>
                <textarea class="form-control" v-model="form.description" :class="{'is-invalid': errors.description}" placeholder="Masukkan Deskripis"></textarea>
                <small class="text-danger" v-if="errors.description">{{ errors.description[0] }}</small>
            </div>
            <div class="modal-footer">
              <button type="button" @click="closeLetterModal" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary" :disabled="loading">{{ loading ? 'Prosen menyimpan..' : isEdit ? 'Update': 'Simpan' }}</button>
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

.table-scroll{
    width: 100%;
    overflow-y: auto;
    white-space: nowrap;
}

</style>