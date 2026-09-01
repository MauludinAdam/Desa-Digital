<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { deleteCitizen, getCitizens } from '@/services/citizenService';
import TableSkeleton from '@/components/skeleton/TableSkeleton.vue';
import Swal from 'sweetalert2';
import { useAuth } from '@/helpers/auth';

const { fetchUser, isAdmin, isHeadman } = useAuth();


 const citizens = ref([])

 const loading = ref(false)
 const errorMessage = ref('')

 const search = ref('')

//  pagination
const currentPage = ref(1);
const perPage = ref(10);
const totalData = ref(0);
const lastPage = ref(1);

 const getData = async () => {
    try {
        loading.value = true
        errorMessage.value = ''

        const response = await getCitizens({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value || null,
        });

        console.log(response.data);

        citizens.value = response.data.data.data;

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
    if(page < 1 || page > lastPage.value) {
        return;
    }

    currentPage.value = page;

    getData();
 }

//  script search
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

//  delete data
 const deleteData = async (id) => {
    const result = await Swal.fire({
        title: "Apakah Anda Yakin ?",
        text: "Data yang dihapus tidak dapat dikembalikan!.",
        icon: "warning",
        showCancelButton: "true",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
    });

    if(!result.isConfirmed) return;

    try {
        await deleteCitizen(id);

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
    fetchUser()
 });


</script>


<template>
    <div class="container">
        <div class="col-lg-12 col-md-12 col-sm-4">
            <div class="card">
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <div class="card-header d-flex justify-content-between">
                        <div class="card-title"><h4>Data Penduduk</h4></div>
                        <div class="card-tools">
                            <RouterLink v-if="isAdmin" :to="{name: 'master-data.citizen-create'}" class="btn btn-primary"><i class="fas fa-plus"></i> Tambah Data</RouterLink>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <div class="d-flex justify-content-between mb-2">
                            <div class="show d-flex gap-1 align-items-center">
                                <label for="">Show:</label>
                                <select v-model="perPage" name="" class="form-select" style="width: 5rem;">
                                    <option :value="10">10</option>
                                    <option :value="25">25</option>
                                    <option :value="50">50</option>
                                    <option :value="100">100</option>
                                </select>
                                <label for="">Entries</label>
                            </div>
                            <div class="searching">
                                <input type="text" v-model="search" class="form-control" placeholder="Search Here..." style="width: 14rem;">
                            </div>
                        </div>
                    </div>
                    <div class="table-scroll">
                        <table class="table table-responsive table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th width="5%">No</th>
                                    <th>Nama</th>
                                    <th>No.Telp</th>
                                    <th class="text-center">jenis Kelamin</th>
                                    <th>Email</th>
                                    <th class="text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="citizens.length > 0"
                                    v-for="(item, index) in citizens" :key="item.id">
                                    <td>{{ (currentPage - 1)  * perPage + index + 1}}</td>
                                    <td>{{ item.full_name }}</td>
                                    <td>{{ item.phone_number }}</td>
                                    <td class="text-center">{{ item.gender ? 'laki-laki' : 'perempun' }}</td>
                                    <td>{{ item.email }}</td>
                                    <td width="18%" class="text-center">
                                        <RouterLink :to="{name: 'master-data.citizen-detail', params: {id: item.id},}" class="btn btn-info btn-sm mx-1" data-toggle="tooltip" data-placement="top" title="Detail"><i class="fas fa-eye"></i></RouterLink>
                                        <RouterLink v-if="isAdmin" :to="{name: 'master-data.citizen-edit', params: {id: item.id}}" class="btn btn-warning btn-sm" data-toggle="tooltip" data-placement="top" title="Edit"><i class="fas fa-pen-square"></i></RouterLink>
                                        <button v-if="isAdmin" @click="deleteData(item.id)" class="btn btn-danger btn-sm mx-1" data-toggle="tooltip" data-placement="top" title="Hapus"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                                <tr v-else>
                                    <td colspan="10" class="text-center text-muted py-4">
                                        <p style="font-size: 3rem;"><i class="fas fa-folder-closed"></i>
                                        </p>
                                        <p class="mb-5">{{ isSearching ? 'Data tidak ditemukan' : 'Data penduduk belum ada' }}</p>
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
    </div>
</template>
<style scoped>
.table-scroll{
    width: 100%;
    overflow-y: auto;
    white-space: nowrap;
}
</style>