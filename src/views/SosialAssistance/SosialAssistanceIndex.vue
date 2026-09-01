<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { deleteSosialAssistance, getSosialAssistances } from '@/services/SosialAssistance';
import { getCategorySosialOptions } from '@/services/CategorySosial';
import Swal from 'sweetalert2';
import { useAuth } from '@/helpers/auth';

const { fetchUser, isAdmin, isHeadman } = useAuth();

const route = useRoute();

const sosialAssistances = ref([]);

const categories = ref([]);

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
        loading.value = true
        errors.value = {};
        message.value = '';

        const response = await getSosialAssistances({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value || null,
        });

        console.log(response.data);

        sosialAssistances.value = response.data.data.data;

        currentPage.value = response.data.data.meta.current_page;
        lastPage.value = response.data.data.meta.last_page;
        totalData.value = response.data.data.meta.total;

    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

const getCategories = async () => {
    try {
        const response = await getCategorySosialOptions();

        categories.value = response.data.data.data ?? [];

        console.log(categories.value);
    } catch (error) {
        console.log(error)
    }
}

const changePage = (page) => {
    if (page < 1 || page > lastPage.value) {
        return;
    }

    currentPage.value = page;
    getData();
}

// script search
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

// Delete Data
const deleteData = async (id) => {
    const result = await Swal.fire({
        title: "Apakah ANda Yakin ?",
        text: "Data yang dihapus tidak dapat dikembalikan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
        await deleteSosialAssistance(id);

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
            title: 'Ooooops...',
            text: 'Gagal menghapus data.',
        });

        console.log(error);
    }
}

onMounted(() => {
    getData();
    getCategories();
    fetchUser();
})

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div class="card-title">
                    <h5>Data Bantuan Sosial</h5>
                </div>
                <div class="card-tools">
                    <RouterLink v-if="isAdmin" :to="{ name: 'master-sosial.bantuan-sosial-create' }" class="btn btn-primary"><i
                            class="fas fa-plus"></i> Tambah Data</RouterLink>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                    <div class="show d-flex align-items-center gap-1">
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
                                <th>Kategori</th>
                                <th>Jumlah</th>
                                <th>Penyedia</th>
                                <th>Deskripsi</th>
                                <th>Status</th>
                                <th v-if="isAdmin">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="sosialAssistances.length > 0" v-for="(item, index) in sosialAssistances"
                                :key="item.id">
                                <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.sosial_assistance_categories?.name }}</td>
                                <td>Rp.{{ item.amount }}</td>
                                <td>{{ item.provider }}</td>
                                <td>{{ item.description }}</td>
                                <td><span
                                        :class="item.is_available ? 'badge  bg-success text-white' : 'badge bg-danger text-white'">{{
                                            item.is_available ? 'Tersedia':'Tidak Tersedia' }}</span></td>
                                <td width="18%" v-if="isAdmin">
                                    <RouterLink :to="{ name: 'master-sosial.bantuan-sosial-edit', params: { id: item.id } }"
                                        class="btn btn-warning btn-sm mx-1"><i class="fas fa-pen-square"></i>
                                    </RouterLink>
                                    <button @click="deleteData(item.id)" class="btn btn-danger btn-sm"><i
                                            class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                    <div class="page">
                        <span>Halaman {{ currentPage }} dari {{ lastPage }}</span>
                    </div>
                    <div class="pagination">
                        <nav aria-label="pagination">
                            <ul class="pagination">
                                <li class="page-item" :class="{disabled: currentPage === 1}">
                                    <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                                </li>

                                <li class="page-item" v-for="page in lastPage" :key="page" :class="{active: currentPage === page}">
                                    <button class="page-link" @click="changePage(page)">{{ page }}</button>
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
</template>

<style scoped>
.table-scroll {
    width: 100%;
    overflow: auto;
    white-space: nowrap;
}
</style>