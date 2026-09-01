<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { creaetOccupation, deleteOccupation, getOccupations, updateOccupation } from '@/services/OccupationService';
import { toast } from '@/utils/swal';
import Swal from 'sweetalert2';

const route = useRoute();

const occupations = ref([]);

const loading = ref(false);
const errors = ref({})
const message = ref("");

const search = ref('');

// Paginations
const currentPage = ref(1);
const perPage = ref(10);
const lastPage = ref(1);
const totalData = ref(0);

const getData = async () => {
    try {
        loading.value = true;
        errors.value = {};
        message.value = "";

        const response = await getOccupations({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value || null,
        });

        console.log(response.data);

        occupations.value = response.data.data.data ?? [];

        currentPage.value = response.data.data.meta.current_page;
        lastPage.value = response.data.data.meta.last_page;
        totalData.value = response.data.data.meta.total;
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false;
    }
}

const changePage = (page) => {
    if (page < 1 || page > lastPage.value) {
        return;
    }

    currentPage.value = page;

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


// modal Tambah && edit data
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);

const form = ref({
    name: '',
});

const openModal = async () => {
    isEdit.value = false;
    editId.value = null;

    form.value = {
        name: '',
    }

    errors.value = {};

    showModal.value = true;
}

const openEditModal = async (item) => {
    isEdit.value = true;
    editId.value = item.id;
    loading.value = false;

    form.value = {
        name: item.name
    }

    errors.value = {};

    showModal.value = true;
}

const closeModal = async () => {
    showModal.value = false;

    isEdit.value = false;
    editId.value = null;

    form.value = {
        name: '',
    }

    errors.value = {};
}

const saveData = async () => {
    message.value = "";
    errors.value = {};

    // Validasi
    if (!form.value.name) {
        errors.value.name = ["Nama harus diisi"];
    }

    if (Object.keys(errors.value).length > 0) {
        return;
    }

    try {
        loading.value = true;

        const editing = isEdit.value;

        const formData = new FormData();

        formData.append('name', form.value.name);

        if (editing) {
            formData.append("_method", "PUT");

            await updateOccupation(editId.value, formData);
        } else {
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }

            await creaetOccupation(formData);
        }

        closeModal();

        await getData();
        toast("success", editing ? "Data pekerjaan berhasil diperebarui" : "Data pekerjaan berhasil ditambahkan!");
    } catch (error) {
        console.log(error)

        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {};
            return;
        }

        toast("error", error.response?.data?.message || "Gagal menambahkan data pekerjaan");
    } finally {
        loading.value = false;
    }
}

// delete Data
const deleteData = async (id) => {
    const result = await Swal.fire({
        title: 'Apakah Anda Yakin',
        text: 'Data yang sudah dihapus tidak dapat dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
    });

    if (!result.isConfirmed) return;

    try {
        await deleteOccupation(id);

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
            text: 'Gagal menghapus Data',
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
            <div class="card-header d-flex align-items-center justify-content-between">
                <div class="card-title">
                    <h5>Data Pekerjaan</h5>
                </div>
                <div class="crad-tools">
                    <button @click="openModal" class="btn btn-primary"><i class="fas fa-plus"></i> Tambah Data</button>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="show d-flex align-items-center gap-1">
                        <label for="">Show:</label>
                        <select v-model="perPage" class="form-select" style="width: 5rem;">
                            <option value="">10</option>
                            <option value="">25</option>
                            <option value="">50</option>
                            <option value="">100</option>
                        </select>
                        <label for="">Entries</label>
                    </div>
                    <div class="searching">
                        <input type="text" v-model="search" class="form-control" placeholder="Search Here..."
                            style="width: 15rem;">
                    </div>
                </div>
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th width="5%">No</th>
                            <th>Nama</th>
                            <th width="20%">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="occupations.length > 0" v-for="(item, index) in occupations" :key="item.id">
                            <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                            <td>{{ item.name }}</td>
                            <td>
                                <button @click="openEditModal(item)" class="btn btn-warning btn-sm mx-1"><i
                                        class="fas fa-pen-square"></i></button>
                                <button @click="deleteData(item.id)" class="btn btn-danger btn-sm"><i
                                        class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="d-flex align-items-center justify-content-between mt-3">
                    <div class="page">
                        <span>Halaman {{ currentPage }} dari {{ lastPage }}</span>
                    </div>
                    <div class="pagination">
                        <nav aria-label="navigation">
                            <ul class="pagination">
                                <li class="page-item" :class="{disabled: currentPage === 1}">
                                    <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                                </li>
                                
                                <li class="page-item" v-for="page in lastPage" :class="{active: currentPage === page}">
                                    <button class="page-link">{{ page }}</button>
                                </li>

                                <li class="page-item" :class="{disabled: currentPage == lastPage}">
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
                        <h5 class="modal-title">{{ isEdit ? 'Edit Data Pekerjaan' : 'Tambah Data Pekerjaan' }}</h5>
                        <button @click="closeModal" type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveData">
                            <div class="form-group">
                                <label for="">Nama</label>
                                <input type="text" v-model="form.name" class="form-control"
                                    :class="{ 'is-invalid': errors.name }" placeholder="Masukkan Nama Pekerjaan">
                                <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                            </div>
                            <div class="modal-footer">
                                <button @click="closeModal" type="button" class="btn btn-secondary"
                                    data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary" :disabled="loading">{{ loading ? 'Proses menyimpan': isEdit ? 'Update': 'Simpan' }}</button>
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