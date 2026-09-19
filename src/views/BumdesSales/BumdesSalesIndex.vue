<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import { deleteBumdesSales, getBumdesSaleses } from '@/services/BumdesSales';
import { useAuth } from '@/helpers/auth';
import { formatRupiah } from '@/utils/FormatRupiah';

const { isHeadman, isOperator } = useAuth();

const sales = ref([]);

const loading = ref(false);
const errors = ref({});

const search = ref('');

// pagination
const currentPage = ref(1);
const perPage = ref(10);
const lastPage = ref(1);
const totalData = ref(0);

const getData = async () => {
    try {
        loading.value = true;
        errors.value = {};

        const response = await getBumdesSaleses({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value || null,
        });

        console.log(response.data);

        sales.value = response.data.data.data;

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

// script searching
let timeout = null;
const debounceSaerch = () => {
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
    debounceSaerch();
});

watch(perPage, () => {
    currentPage.value = 1;
    getData();
});

const deleteData = async (id) => {
    const result = await Swal.fire({
        title: "Apakah Anda Yakin ?",
        text: "Data yang dihapus tidak dapat dikembalikan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
    });

    if(!result.isConfirmed) return;

    try {
        await deleteBumdesSales(id);

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Data berhasil dihapus",
            showConfirmButton: false,
            timer: 3000,
        });

        getData();
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ooooopss...",
            text: "Gagal menghapus data",
        });

        console.log(error);
    }
}

onMounted(() => {
    getData();
})


</script>


<template>
    <div class="container-fluit">
        <div class="card">
            <div class="card-header d-flex align-item-center justify-content-between">
                <div class="card-title">
                    <h5 class="fw-bold">Data Transaksi</h5>
                </div>
                <!-- <div class="card-tools">
                    <RouterLink :to="{name: 'sales-create'}" class="btn text-white" style="background: #2F4F4F;"><i class="fas fa-plus"></i> Tambah
                        Data</RouterLink>
                </div> -->
            </div>
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="show d-flex gap-2 align-items-center">
                        <label for="">Show:</label>
                        <select v-model="perPage" class="form-select">
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
                <div class="table-scroll">
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th width="5%">No</th>
                                <th>No.Invoice</th>
                                <th>Nama Customer</th>
                                <th>Tgl Penjualan</th>
                                <th>Metode Pay</th>
                                <th>Jumlah Total</th>
                                <th>Status</th>
                                <th v-if="isOperator">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="sales.length > 0" v-for="(item, index) in sales" :key="item.id">
                                <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                                <td>{{ item.invoice_number }}</td>
                                <td>{{ item.customer_name }}</td>
                                <td>{{ item.sale_date }}</td>
                                <td class="text-center">{{ item.payment_method }}</td>
                                <td>Rp.{{ formatRupiah(item.total_amount) }}</td>
                                <td>
                                    <span :class="item.status === 'paid' ? 'badge bg-success' : 'badge bg-danger'">{{ item.status }}</span>    
                                </td>
                                <td v-if="isOperator" width="18%">
                                    <RouterLink :to="{name: 'sales-detail', params: {id: item.id}}" class="btn btn-info btn-sm mx-1"><i class="fas fa-eye"></i></RouterLink>
                                    <button @click="deleteData(item.id)" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr v-else>
                                <td colspan="9" class="text-center py-4">
                                    <p style="font-size: 3rem;"><i class="fas fa-folder"></i></p>
                                    <p class="text-center">{{ isSearching ? 'Data tidak ditemuka' : 'Data belum ada!' }}
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex align-items-center justify-content-between mt-3">
                    <div class="page">
                        <span>Showing {{ currentPage }} for {{ lastPage }} to {{ totalData }}</span>
                    </div>
                    <div class="pagination">
                        <nav aria-label="navigation">
                            <ul class="pagination">
                                <li class="page-item" :class="{disabled: currentPage === 1}">
                                    <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
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
</template>

<style scoped>
.table-scroll {
    width: 100%;
    overflow: auto;
    white-space: nowrap;
}
</style>