<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from '@/utils/swal';
import Swal from 'sweetalert2';
import { getUser, updateStatusUser } from '@/services/UserService';
import { getMe } from '@/services/UserService';

const route = useRoute()

const loading = ref(false);
const errors = ref({});

const user = ref([]);
const currentUser = ref(null);

const can = (permission) => {
    return currentUser.value?.permissions?.includes(permission) ?? null;
}


const fetchUser = async () => {
    try {
        const response = await getMe();

        currentUser.value = response.data.data;
    } catch (error) {
        console.log(error);
    }
}

const search = ref('');

// Pagination
const currentPage = ref(1);
const perPage = ref(10);
const lastPage = ref(1);
const totalData = ref(0);

const getData = async () => {
    try {
        loading.value = true;


        const response = await getUser({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value || null,
        })

        console.log(response.data)

        user.value = response.data.data.data;

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


// Modal Perbarui status user
const showModal = ref(false);
const isEdit = ref(false);
const editId = ref(null);

const form = ref({
    status: '',
})

const openModalEditStatus = async (item) => {
    isEdit.value = true;
    editId.value = item.id;

    form.value = {
        status: item.status,
    }

    errors.value = {};

    showModal.value = true;
}

const closeModalStatus = async () => {
    showModal.value = false;

    form.value = {
        status: '',
    }

    editId.value = null;
    isEdit.value = false;
    errors.value = {};
}

const saveStatus = async () => {
    try {
        loading.value = true;
        errors.value = {};

        await updateStatusUser(
            editId.value,
            form.value.status
        )

        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Status user berhasil diperbarui',
            timer: 1500,
            showConfirmButton: false,
        });

        closeModalStatus();

        await getData();
    } catch (error) {
        if(error.response?.status === 422){
            errors.value = error.response.data.errors || {};
            return;
        }

        toast('error', error.response?.data?.message || 'Terjadi kesalahan')
    }finally{
        loading.value = false;
    }
}

onMounted(() => {
    getData();
    fetchUser();
})

</script>

<template>
    <div class="container-fluit">
        <div class="card">
            <div class="card-header d-flex align-items-center justify-content-between">
                <div class="card-title">
                    <h5 class="fw-bold">Manajemen Users</h5>
                </div>
                <div class="card-tools">
                    <RouterLink :to="{ name: 'user-create' }" class="btn text-white" style="background:#2F4F4F;"><i
                            class="fas fa-plus"></i> Tambah
                        User</RouterLink>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="show d-flex align-items-center gap-2">
                        <label for="">Show:</label>
                        <select v-model="perPage" class="form-select">
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                            <option :value="100">100</option>
                        </select>
                        <label for="">Entries</label>
                    </div>
                    <div class="searching d-flex align-items-center gap-2">
                        <label for="">Search:</label>
                        <input type="text" v-model="search" class="form-control" placeholder="Search Here..."
                            style="width: 15rem;">
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th width="5%">No</th>
                                <th>Nama</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th class="text-center">Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="user.length > 0" v-for="(item, index) in user" :key="item.id">
                                <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.email }}</td>
                                <td>{{ item.role?.name ?? '-' }}</td>
                                <td class="text-center">
                                    <span :class="item.status === 'Active' ? 'badge bg-success' : 'badge bg-danger'">{{
                                        item.status }}</span>
                                </td>
                                <td width="10%">
                                    <button v-if="can('user-status-update')" @click="openModalEditStatus(item)" class="btn btn-warning btn-sm mx-2"><i
                                            class="fas fa-pen-square"></i></button>
                                </td>
                            </tr>
                            <tr v-else>
                                <td colspan="6" class="text-center py-4">
                                    <p class="text-muted "><i class="fas fa-folder fa-4x"></i></p>
                                    <p class="text-muted" style="font-size: 1.5rem;">{{ isSearching ? 'Data tidak ditemukan' : 'Belum ada data' }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                    <div class="page">
                        <span>Showing {{ currentPage }} to {{ lastPage }} from {{ totalData }}</span>
                    </div>
                    <div class="pagination">
                        <nav aria-label="pagination">
                            <ul class="pagination">
                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                    <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                                </li>

                                <li class="page-item" v-for="page in lastPage" :key="page"
                                    :class="{ active: currentPage === page }">
                                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
                                </li>

                                <li class="page-item" :class="{ disabled: currentPage === lastPage }">
                                    <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal edit Status -->
    <Transition name="modal">
        <div v-if="showModal" class="modal" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Ubah Status user</h5>
                        <button @click="closeModalStatus" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveStatus">
                            <div class="form-group">
                                <label for="">Status</label>
                                <select v-model="form.status" class="form-control" :class="{'is-invalid': errors.status}">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <small class="text-danger" v-if="errors.status">{{ errors.status[0] }}</small>
                            </div>
                            <div class="modal-footer">
                                <button @click="closeModalStatus" type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                <button type="submit" class="btn btn-secondary" :disabled="loading">{{ loading ? 'Proses update...': 'Update' }}</button>
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
.table-scroll {
    width: 100%;
    overflow: auto;
    white-space: nowrap;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;;
}

.backdrop-enter-active,
.backdrop-leave-active {
    transition: opacity 0.2s ease;;
}

.backdrop-enter-from,
.backdrop-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-dialog,
.modal-leave.active .modal-dialog {
    transition: transform 0.2s ease, opacity 0.2s ease;;
}

.modal-enter.from .modal-dialog,
.modal-leave-to .modal-dialog {
    transform: translateY(-20px);
    opacity: 0;
}
</style>