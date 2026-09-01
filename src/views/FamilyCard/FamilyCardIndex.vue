<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed, watch } from 'vue';
import { deleteFamilyCard, getFamilyCards } from '@/services/FamilyCardService';
import TableSkeleton from '@/components/skeleton/TableSkeleton.vue';
import Swal from 'sweetalert2';
import { useAuth } from '@/helpers/auth';

const { fetchUser, isAdmin, isHeadman } = useAuth();

const familyCards = ref([]);

const loading = ref(false);
const errorMessage = ref('');

const search = ref('')

// Pagination
const currentPage = ref(1);
const perPage = ref(10);
const totalData = ref(0);
const lastPage = ref(1);

const getData = async () => {
    try {
        loading.value = true
        errorMessage.value = ''

        const response = await getFamilyCards({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value || null,
        });

        console.log(response.data);

        familyCards.value = response.data.data.data;

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
})

// delete data
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
        await deleteFamilyCard(id);

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
            title: "Oooops...",
            text: "Gagal menghapus data.",
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
            <div class="card-header d-flex justify-content-between">
                <div class="card-title"><h5>Data Kartu Keluarga</h5></div>
                <div class="card-tools">
                    <RouterLink v-if="isAdmin" :to="{name: 'master-data.family-card-create' }" class="btn btn-primary"><i class="fas fa-plus"></i> Tambah Data</RouterLink>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex mb-2 justify-content-between">
                    <div class="show d-flex gap-1 align-items-center">
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
                        <input v-model="search" type="text" class="form-control" placeholder="Search Here..." style="width: 14rem;">
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="table table-striped table-bordered table-responsive">
                        <thead>
                            <tr>
                                <th width="5%">No</th>
                                <th>Kepala Keluarga</th>
                                <th>No.KK</th>
                                <th>Dusun</th>
                                <th>RT</th>
                                <th>RW</th>
                                <th class="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="familyCards.length > 0" v-for="(item, index) in familyCards" :key="item.id">
                                <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                                <td>{{ item.head_of_family?.full_name ?? '-' }}</td>
                                <td>{{ item.family_card_number }}</td>
                                <td>{{ item.hamlet }}</td>
                                <td>{{ item.rt }}</td>
                                <td>{{ item.rw }}</td>
                                <td width="18%" class="text-center">
                                    <RouterLink :to="{name: 'master-data.family-card-detail', params: {id:item.id}}" class="btn btn-info btn-sm" data-toggle="tooltip" data-placement="top" title="Detail"><i class="fas fa-eye"></i></RouterLink>
                                    <RouterLink v-if="isAdmin" :to="{name: 'master-data.family-card-edit', params: {id:item.id}}" class="btn btn-warning btn-sm mx-1" data-toggle="tooltip" data-placement="top" title="Edit"><i class="fas fa-pen-square"></i></RouterLink>
                                    <button v-if="isAdmin" @click="deleteData(item.id)" class="btn btn-danger btn-sm" data-toggle="tooltip" data-placement="top" title="Hapus"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr v-else>
                                <td colspan="10" class="text-center text-muted py-4">
                                    <p style="font-size: 3rem;"><i class="fas fa-folder-closed"></i></p>
                                    <p class="mb-5">{{ isSearching ? 'Data tidak ditemuka' : 'Belum ada Data!' }}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex justify-content-between mt-3">
                    <div class="page">
                        <h6>Halaman {{ currentPage }} dari {{ lastPage }}</h6>
                    </div>
                    <div class="pagination">
                        <nav aria-label="navigation page">
                            <ul class="pagination">
                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                        <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                                    </li>
                                    <li v-for="page in lastPage" :key="page" class="page-item" :class="{active: currentPage === page}">
                                        <button class="page-link" @click="changePage(page)">{{ page }}</button>
                                    </li>
                                    <li class="page-item" :class="{disabled: currentPage === lastPage}">
                                        <button class="page-link" @click="changePage(currentPage + 1)" aria-current="page">Next</button>
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
.table-scroll{
    width: 100%;
    overflow-y: auto;
    white-space: nowrap;
}
</style>