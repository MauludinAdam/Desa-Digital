<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Swal from 'sweetalert2';
import { deleteBumdesProduct, getBumdesProducts } from '@/services/BumdesProduct';
import { useAuth } from '@/helpers/auth';

const { isHeadman, isOperator } = useAuth();

const loading = ref(false);
const errors = ref({});
const message = ref("");

const product = ref([]);

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
        message.value = "";

        const response = await getBumdesProducts({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value || null,
        });

        console.log(response.data);

        product.value = response.data.data.data;

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

// script searching
let timeout = null;
const debounceSearch = () => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
        currentPage.value = 1;
        getData();
    }, 500)
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

const deleteData = async (id) => {
    const result = await Swal.fire({
        title: "Apakah Anda Yakin ?",
        text: 'Data yang dihapus tidak dapat dikembalikan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya. Hapus',
        cancelButtonText: 'Batal',
    });

    if (!result.isConfirmed) return;

    try {
        await deleteBumdesProduct(id);

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Data berhasil dihapus',
            showConfirmButton: false,
            timer: 3000
        });

        getData();

    } catch (error) {
        console.log(error)
        Swal.fire({
            icon: 'error',
            title: 'Ooooopsss...',
            text: 'Gagal menghapus data',
        });

        console.log(error);
    }
}

onMounted(() => {
    getData();
})

</script>


<template>
    <div class="conatiner-fluit">
        <div class="card">
            <div class="card-header d-flex align-items-center justify-content-between">
                <div class="card-title">
                    <h5 class="fw-bold">Data Product</h5>
                </div>
                <div class="card-tools">
                    <RouterLink :to="{ name: 'product-create' }" class="btn text-white" style="background: #2F4F4F;"><i
                            class="fas fa-plus"></i> Tambah Data</RouterLink>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between mb-2">
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
                                <th>Unit Usaha</th>
                                <th>Nama</th>
                                <th>Barcode</th>
                                <th>Harga</th>
                                <th>Satuan</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th v-if="isOperator">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="product.length > 0" v-for="(item, index) in product" :key="item.id">
                                <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                                <td>{{ item.bumdesUnit?.name }}</td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.barcode }}</td>
                                <td>Rp.{{ item.price }}</td>
                                <td>{{ item.unit }}</td>
                                <td class="text-center">
                                    <span
                                        :class="item.stock === 0 || item.stock < 10 ? 'text-danger' : 'text-success'">{{
                                        item.stock }}</span>
                                    <small v-if="item.stock === 0" class="text-danger d-block">Stok Habis</small>
                                    <small v-else-if="item.stock < 10" class="text-danger d-block">Stok Mau
                                        Habis</small>
                                </td>
                                <td>{{ item.status }}</td>
                                <td v-if="isOperator" width="18%">
                                    <RouterLink :to="{ name: 'product-edit', params: { id: item.id } }"
                                        class="btn btn-warning btn-sm mx-1"><i class="fas fa-pen-square"></i>
                                    </RouterLink>
                                    <button @click="deleteData(item.id)" class="btn btn-danger btn-sm"><i
                                            class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr v-else>
                                <td colspan="9" class="text-center py-4">
                                    <p style="font-size: 3rem;"><i class="fas fa-folder text-muted"></i></p>
                                    <p class="text-center text-muted">{{ isSearching ? 'Data tidak ditemukan' : 'Data product belum ada!' }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                    <div class="page">
                        <span>Halaman {{ currentPage }} dari {{ lastPage }}</span>
                    </div>
                    <div class="pagination">
                        <nav aria-label="...">
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
    overflow: hidden;
    white-space: nowrap;
}
</style>