<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';
import { getSosialAssistanceRecipients, deleteSosialAssistanceRecipient } from '@/services/SosialAssitanceRecipient';
import { useAuth } from '@/helpers/auth';

const { fetchUser, isAdmin, isHeadman } = useAuth();

const route = useRoute();

const sosialAssistanceRecipients = ref([]);

const loading = ref(false);
const errors = ref({});
const message = ref("");

const search = ref('');

// pagination 
const currentPage = ref(1);
const lastPage = ref(1);
const perPage = ref(10);
const totalData = ref(0);

const getData = async () => {
    try {
        loading.value = true;
        errors.value = {};
        message.value = "";

        const response = await getSosialAssistanceRecipients({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value,
        })

        console.log(response.data);

        sosialAssistanceRecipients.value = response.data.data.data;

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

// Delete Data
const deleteData = async (id) => {
    const result = await Swal.fire({
        title: "Apakah Anda Yakin ?",
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
    });

    if(!result.isConfirmed) return;

    try {
        await deleteSosialAssistanceRecipient(id);

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
            text: 'Gagal menghapus data.',
        });

        console.log(error);
    }
}

onMounted(() => {
    getData();
    fetchUser();
})

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <div class="card-title">
                    <h5>Data Penerima Bansos</h5>
                </div>
                <div class="card-tools">
                    <RouterLink v-if="isAdmin" :to="{ name: 'master-sosial.penerima-bansos-create' }" class="btn btn-primary"><i
                            class="fas fa-plus"></i> Tambah Data</RouterLink>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="show d-flex align-items-center gap-1">
                        <label for="">Show:</label>
                        <select v-model="perPage" class="form-select text-center" style="width: 5rem;">
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                            <option :value="100">100</option>
                        </select>
                        <label for="">Entries</label>
                    </div>
                    <div class="searching">
                        <input type="text" v-model="search" class="form-control" placeholder="Search Here..."
                            style="width: 14rem;">
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th width="5%">No</th>
                                <th>Penerima</th>
                                <th>Bantuan Sosial</th>
                                <th>Jumlah</th>
                                <th>Status Pengajuan</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="sosialAssistanceRecipients.length > 0"
                                v-for="(item, index) in sosialAssistanceRecipients" :key="item.id">
                                <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                                <td>{{ item.citizen?.full_name }}</td>
                                <td class="text-center">{{ item.sosialAssistance?.name }}</td>
                                <td>Rp.{{ item.amount }}</td>
                                <td class="text-center"><span
                                        :class="item.status === 'pending' ? 'badge bg-warning' : item.status === 'rejected' ? 'badge bg-danger' : 'badge bg-success'">{{
                                        item.status }}</span></td>
                                <td class="text-center"><span
                                        :class="item.payout_status === 'pending' ? 'badge bg-warning' : item.payout_status === 'processing' ? 'badge bg-info' : item.payout_status === 'success' ? 'badge bg-success' : 'badge bg-danger'">{{
                                        item.payout_status }}</span></td>
                                <td>
                                    <RouterLink :to="{name: 'master-sosial.penerima-bansos-detail', params: {id: item.id}}" class="btn btn-info btn-sm mx-1" data-toggle="tooltip"
                                        data-placement="top" title="Detail">Detail</RouterLink>
                                    <RouterLink v-if="isAdmin" :to="{name: 'master-sosial.penerima-bansos-edit', params: {id: item.id}}" class="btn btn-warning btn-sm mx-1" data-toggle="tooltip"
                                        data-placement="top" title="Edit">Edit</RouterLink>
                                    <button v-if="isAdmin" @click="deleteData(item.id)" class="btn btn-danger btn-sm" data-toggle="tooltip" data-placement="top"
                                        title="Hapus">Hapus</button>
                                </td>
                            </tr>
                            <tr v-else>
                                <td colspan="7" class="text-center text-muted py-4">
                                    <p style="font-size: 3rem;"><i class="fas fa-folder"></i></p>
                                    <p class="mb-5">{{ isSearching ? 'Data tidak ditemuka': 'Belum ada data!' }}</p>
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
                                <li class="page-item" :class="{ disabled: currentPage === 1}">
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