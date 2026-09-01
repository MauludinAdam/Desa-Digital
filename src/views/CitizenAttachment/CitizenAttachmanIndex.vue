<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { createCitizenAttachman, deleteCitizenAttachman, getCitizenAttachmans, updateCitizenAttachman } from '@/services/DocumentCitizen';
import { toast } from '@/utils/swal';
import { getCitizenOptions } from '@/services/citizenService';
import { useAuth } from '@/helpers/auth';

const { fetchUser, isAdmin, isHeadman } = useAuth();

const route = useRoute();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const citizenAttachmans = ref([]);

const search = ref('');

const citizens = ref([]);

const getcitizens = async () => {
    try {
        const response = await getCitizenOptions();

        citizens.value = response.data.data.data ?? [];

        console.log(citizens.value);
    } catch (error) {
        console.log(error)
    }
}



// Pagination
const currentPage = ref(1);
const perPage = ref(10);
const lastPage = ref(1);
const totalData = ref(0);

const getData = async () => {
    try {
        loading.value = true;
        errors.value = {};
        message.value = '';

        const response = await getCitizenAttachmans({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value || null,
        });

        console.log(response.data);

        citizenAttachmans.value = response.data.data.data;

        currentPage.value = response.data.data.meta.current_page;
        lastPage.value = response.data.data.meta.last_page;
        totalData.value = response.data.data.total;
    } catch (error) {
        console.log(error)
    }finally{
        loading.value = false;
    }
}

const changePage = (page) => {
    if(page < 1 || page > lastPage.value){
        return
    }

    currentPage.value = page;

    getData();
}

// script searching
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

// modal tambah & edit data
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);

const form = ref({
    citizen_id: '',
    file: null,
    document_type: '',
});

const oldFile = ref(null);

const handleChange = (event) => {
    const file = event.target.files[0] ?? null;
    
    if(!file){
        form.value.file = null;
        return;
    }
    form.value.file = file;
    delete errors.value.file;
}

const openCitizenAttach = async () => {
    isEdit.value = false;
    editId.value = null;
    form.value = {
        citizen_id: '',
        file: null,
        document_type: '',
    }

    oldFile.value = null;
    errors.value = {};

    showModal.value = true;
} 

const closeCitizenAttachModal = () => {
    showModal.value = false;

    isEdit.value = false;
    editId.value = null;

    form.value = {
        citizen_id: '',
        file: null,
        document_type: '',
    };

    oldFile.value = null;
    errors.value = {};
}

const saveData = async () => {

    message.value = "";
    errors.value = {};

    // Validation
    if(!form.value.citizen_id){
        errors.value.citizen_id = ["Penduduk harus diisi"];
    }

    if(!form.value.document_type){
        errors.value.document_type = ["Dokumen harus diisi"];
    }

    if(Object.keys(errors.value).length > 0){
        return;
    }

    try {
        loading.value = true;
        
        const editing = isEdit.value;

        const formData = new FormData();

        formData.append('citizen_id', form.value.citizen_id);
        formData.append('document_type', form.value.document_type);
        
        if(form.value.file){
            formData.append('file', form.value.file);
        }

        if(editing){
            formData.append("_method", "PUT");

            await updateCitizenAttachman(editId.value, formData);
        }else{

            for (const [key, value] of formData.entries()){
                console.log(key, value);
            }

            await createCitizenAttachman(formData);
        }

        closeCitizenAttachModal();

        await getData();

        toast("success", editing ? "Dokumen penduduk berhasil diperbarui": "Dokumen berhasil ditambahkan");
    } catch (error) {
        console.log(error)

        if(error.response?.status === 422){
            errors.value = error.response.data.errors || {};
            return;
        }

        toast("error", error.response?.data?.message || "Gagal menambahkan dokumen");
    }finally{
        loading.value = false;
    }
}

const getFileName = (fileUrl) => {
    if(!fileUrl){
        return '-';
    }

    return fileUrl.split('/').pop();
}

const openEditCitizenAttachModal = (item) => {
    isEdit.value = true;
    editId.value = item.id,

    form.value = {
        citizen_id: item.citizen_id,
        file: null,
        document_type: item.document_type,
    }

    oldFile.value = item.file;

    errors.value = {};

    showModal.value = true;
}

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
        await deleteCitizenAttachman(id);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Data berhasil dihapus',
            showConfirmButton: false,
            timer: 3000,
        });

        getData();
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oooops...',
            text: 'Gagal menghapus data',
        });

        console.log(error);
    }
}

onMounted(() => {
    getData();
    getcitizens();
    fetchUser();
})


</script>


<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header d-flex  justify-content-between">
                <div class="card-title"><h5>Data Dokumen Penduduk</h5></div>
                <div class="card-tools">
                    <button v-if="isAdmin" @click="openCitizenAttach" class="btn btn-primary"><i class="fas fa-plus"></i> Tambah Data</button>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                    <div class="showPage d-flex align-items-center gap-1">
                        <label for="">Show:</label>
                        <select v-model="perPage" class="form-select" style="width: 5rem;">
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                            <option :value="100">100</option>
                        </select>
                        <label for="">Entries</label>
                    </div>
                    <div class="searching">
                        <input type="text" v-model="search" class="form-control" placeholder="Search Here..." style="width: 15rem;">
                    </div>
                </div>
                <table class="table table-striped table-borderless">
                    <thead>
                        <tr>
                            <th width="5%">No</th>
                            <th>Nama</th>
                            <th>Dokumen</th>
                            <th class="text-center">File</th>
                            <th v-if="isAdmin">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="citizenAttachmans.length > 0"
                            v-for="(item, index) in citizenAttachmans" :key="item.id">
                            <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                            <td>{{ item.citizen?.full_name }}</td>
                            <td class="text-center"><i class="fas fa-file-pdf"></i> {{ item.document_type }}</td>
                            <td class="text-center"><a :href="item.file" target="_blank" class="text-decoration-underline">{{ getFileName(item.file) }}</a>
                            </td>
                            <td class="d-flex gap-2" v-if="isAdmin">
                                <button @click="openEditCitizenAttachModal(item)" class="btn btn-warning btn-sm"><i class="fas fa-pen-square"></i></button>
                                <button @click="deleteData(item.id)" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between mt-2">
                    <div class="page">
                        <span>Halaman {{ currentPage }} dari {{ lastPage }}</span>
                    </div>
                    <div class="pagination">
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

    <!-- Modal tambah & edit data -->
<Transition name="modal">
 <div v-if="showModal" class="modal" tabindex="-1" style="display: block;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ isEdit ? 'Edit Dokumen' : 'Tambah Dokumen' }}</h5>
        <button @click="closeCitizenAttachModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="saveData">
            <div class="form-group">
                <label for="">Nama</label>
                <select v-model="form.citizen_id" class="form-select" :class="{'is-invalid': errors.citizen_id}">
                    <option value="">--- Pilih ---</option>
                    <option v-for="item in citizens" :value="item.id" :key="item.id">{{ item.full_name }}</option>
                </select>
                <small class="text-danger" v-if="errors.citizen_id">{{ errors.citizen_id[0] }}</small>
            </div>
            <div class="form-group">
                <label for="">Type Dokumen</label>
                <input type="text" v-model="form.document_type" class="form-control" :class="{'is-invalid': errors.document_type}" placeholder="Masukkan Type Dokumen">                
                <small class="text-danger" v-if="errors.document_type">{{ errors.document_type[0] }}</small>
            </div>
            <div class="form-group">
                <label for="">File</label>
                <input type="file" @change="handleChange" class="form-control" :class="{'is-invalid': errors.file}" accept=".pdf,.jpg,.jpeg,.png">
                <div v-if="isEdit && oldFile" class="mt-2">
                    <small class="text-muted"></small>
                    <a :href="oldFile" target="_blank" class="text-decoration-underline">{{ getFileName(oldFile) }}</a>
                </div>
                <small class="text-danger" v-if="errors.file">{{ errors.file[0] }}</small>
            </div>
            <div class="modal-footer">
              <button @click="closeCitizenAttachModal" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Batal</button>
              <button type="submit" class="btn btn-primary" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? 'Proses menyimpan...': isEdit ? 'Update' : 'Simpan' }}</button>
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