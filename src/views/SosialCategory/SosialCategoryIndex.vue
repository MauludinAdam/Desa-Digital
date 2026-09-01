<script setup>
import { createCategorySosial, deleteCategorySosial, getCategorySosial, updateCategorySosial } from '@/services/CategorySosial';
import { toast } from '@/utils/swal';
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuth } from '@/helpers/auth';

const { fetchUser, isAdmin, isHeadman } = useAuth();

const route = useRoute();

const categorySosials = ref([]);

const loading = ref(false);
const errors = ref({});
const message = ref("");

const search = ref('');

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

        const response = await getCategorySosial({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value || null,
        });

        console.log(response.data);

        categorySosials.value = response.data.data.data;

        currentPage.value = response.data.data.meta.current_page;
        lastPage.value = response.data.data.meta.last_page;
        totalData.value = response.data.data.meta.total;

    } catch (error) {
        console.log(error);
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
const debaounceSearch = () => {
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
    debaounceSearch();
});

watch(perPage, () => {
    currentPage.value = 1;
    getData();
});


// Modal Tambah % Edit Data
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);

const form = ref({
    name: '',
    description: '',
});

const openModal = async () => {
    isEdit.value = false;
    editId.value = null;
    loading.value = false;
    form.value = {
        name: '',
        description: '',
    }

    errors.value = {};

    showModal.value = true;
}

const openEditModal = (item) => {
    isEdit.value = true;
    editId.value = item.id;
    loading.value = false;

    form.value = {
        name: item.name,
        description: item.description
    };

    errors.value = {};

    showModal.value = true;
}

const saveData = async () => {

    message.value = "";
    errors.value = {};

    if (!form.value.name) {
        errors.value.name = ["Nama harus diisi"];
    }

    if (!form.value.description) {
        errors.value.description = ["Deskripsi harus diisi"];
    }

    if (Object.keys(errors.value).length > 0) {
        return;
    }

    try {
        loading.value = true;
        const editing = isEdit.value;

        const formData = new FormData();

        formData.append('name', form.value.name);
        formData.append('description', form.value.description);

        if (editing) {
            formData.append("_method", "PUT");

            await updateCategorySosial(editId.value, formData);
        } else {
            for (const [key, value] of formData.entries()) {
                console.log(key, value);
            }

            await createCategorySosial(formData);
        }

        closeModel();

        await getData();
        toast("success", editing ? "Data kategori berhasil diperbarui." : "Data kategori berhasil ditambahkan");
    } catch (error) {
        console.log(error);

        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {};
            return;
        }

        toast("error", error.response?.data?.message || "Gagal menambahkan kategori sosial");
    } finally {
        loading.value = false;
    }
}

const closeModel = () => {
    showModal.value = false;

    isEdit.value = false;
    editId.value = null;

    form.value = {
        name: '',
        description: '',
    };

    errors.value = {};

}


const deleteData = async (id) => {
    const result = await Swal.fire({
        title: "Apakah Anda Yakin ?",
        text: "Data yang sudah dihapus tidak dapat dikembalikan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
        await deleteCategorySosial(id);
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
            icon: "error",
            title: "Oooops....",
            text: "Gagal menghapus data",
        });

        console.log(error);
    }
}


onMounted(() => {
    getData();
    fetchUser();
});

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header d-flex justify-content-between">
                <div class="card-title">
                    <h5>Data Category Sosial</h5>
                </div>
                <div class="card-tools">
                    <button @click="openModal" class="btn btn-primary"><i class="fas fa-plus"></i> Tambah Data</button>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                    <div class="show d-flex align-items-center gap-1">
                        <label for="">Show:</label>
                        <select v-model="perPage" class="form-select" style="width: 5rem;">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
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
                            <th>Deskripsi</th>
                            <th v-if="isAdmin">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="categorySosials.length > 0" v-for="(item, index) in categorySosials" :key="item.id">
                            <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.description }}</td>
                            <td width="18%" class="text-center" v-if="isAdmin">
                                <button @click="openEditModal(item)" class="btn btn-warning btn-sm mx-1"><i
                                        class="fas fa-pen-square"></i></button>
                                <button @click="deleteData(item.id)" class="btn btn-danger btn-sm"><i
                                        class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr v-else>
                            <td colspan="7" class="text-center">
                                <i class="fa-solid fa-folder-closed fa-3x text-muted mt-5"></i><br>
                                {{ isSearching ? 'Data tidak ditemuka!' : 'Belum ada data' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="d-flex align-items-center justify-content-between mt-2">
                    <div class="page d-flex">
                        <span>Halaman {{ currentPage }} dari {{ lastPage }}</span>
                    </div>
                    <div class="pagination">
                        <nav aria-label="pagination">
                            <ul class="pagination">
                                <li class="page-item" :class="{disabled: currentPage === 1}">
                                    <button @click="changePage(currentPage - 1)" class="page-link">Previous</button>
                                </li>
        
                                <li class="page-item" v-for="page in lastPage" :key="page" :class="{active: currentPage === page}">
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

    <!-- Modal Tambah & Edit Data -->
    <Transition name="modal">
        <div v-if="showModal" class="modal" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ isEdit ? 'Edit Category Sosial' : 'Tambah Category Sosial' }}</h5>
                        <button @click="closeModel" type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveData">
                            <div class="form-group">
                                <label for="">Nama</label>
                                <input type="text" v-model="form.name" class="form-control"
                                    :class="{ 'is-invalid': errors.name }" placeholder="Masukkan Nama Kategory">
                                <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                            </div>
                            <div class="form-group">
                                <label for="">Deskripsi</label>
                                <textarea class="form-control" rows="2" v-model="form.description"
                                    :class="{ 'is-invalid': errors.description }"
                                    placeholder="Masukkan Deskripsi Kategory"></textarea>
                                <small class="text-danger" v-if="errors.description">{{ errors.description[0] }}</small>
                            </div>
                            <div class="modal-footer">
                                <button @click="closeModel" type="button" class="btn btn-secondary"
                                    data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-primary" :disabled="loading">{{ loading ?
                                    'Proses menyimpan...' : isEdit ? 'Update': 'Simpan' }}</button>
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