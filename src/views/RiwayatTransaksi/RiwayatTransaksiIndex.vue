<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { deleteBumdesSales, exportBumdesSales, getBumdesSaleses } from '@/services/BumdesSales';
import { formatRupiah } from '@/utils/FormatRupiah';
import Swal from 'sweetalert2';
import html2pdf from 'html2pdf.js';
import TransaksiPDF from './TransaksiPDF.vue';

const sales = ref([]);
const loading = ref(false);

const search = ref('');

const startDate = ref('')
const endDate = ref('')

const filters = ref({
    startDate: '',
    endDate: '',
})

// pagination
const currentPage = ref(1)
const perPage = ref(10)
const lastPage = ref(1)
const totalData = ref(0);


const getData = async () => {
    try {
        loading.value = true;

        const response = await getBumdesSaleses({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value || null,
            start_date: startDate.value,
            end_date: endDate.value
        });

        console.log(response.data);

        sales.value = response.data.data.data;

        currentPage.value = response.data.data.meta.current_page;
        lastPage.value = response.data.data.meta.last_page;
        totalData.value = response.data.data.meta.total;
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

const chagePage = (page) => {
    if (page < 1 || page > lastPage.value) {
        return
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
})

watch(perPage, () => {
    currentPage.value = 1;
    getData();
});

const deleteData = async (id) => {
    const result = await Swal.fire({
        title: 'Apakah Anda Yakin?',
        text: 'Data yang sudah dihapus tidak dapat dikembalikan!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
    });

    if(!result.isConfirmed) return;

    try {
        await deleteBumdesSales(id);
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
            title: 'Oooppss...',
            text: 'Gagal menghapus data',
        });

        console.log(error);
    }
}

// Print Transaksi PDF
const transaksiPdf = ref(null);

const printTransaksi = async () => {

    const element = transaksiPdf.value?.printArea

    if(!element){
        console.log("Area PDF belum tersedia")
        return;
    }

    if(!transaksiPdf.value.printArea){
        console.log('Data laporan transaksi pdf belum tersedia');
        return;
    }

    const options = {
        margin: 0,
        filename: 'Laporan Transaksi.pdf',
        image: {
            type: 'jpeg',
            quality: 0.98
        },

        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            scrollX: 0,
        },

        jsPDF: {
            unit: 'mm',
            format: 'A3',
            orientation: 'portrait'
        }
    };

    try {
        await html2pdf()
        .set(options)
        .from(element)
        .save();

        console.log('PDF berhasil dibuat')
    } catch (error) {
        console.log(error)
    }
}


// Exprot Excel
const exportExcel= async () => {
    try {
        const response = await exportBumdesSales()

        const blob = new Blob(
            [response.data],
            {
                type: 'application/vnd.openxmlformats.officedocument.spreadsheetml.sheet'
            }
        )

        const url = window.URL.createObjectURL(blob)

        const link= document.createElement('a')
        link.href = url
        link.setAttribute('download','Laporan Transaksi BUMDes.xlsx')

        document.body.appendChild(link)
        link.click()

        link.remove()
        window.URL.revokeObjectURL(url)

        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Laporan transaksi berhasil di export',
            timer: 1500,
            showConfirmButton: false
        })
    } catch (error) {
        console.log(error)

        Swal.fire({
            icon: 'error',
            title: 'Oooopps...',
            text: 'Gagal mengexport laporan transaksi'
        })
    }
}


onMounted(() => {
    getData();
})

</script>


<template>
    <div class="container-fluit">
        <div class="card">
            <div class="card-header d-flex align-items-center justify-content-between">
                <div class="card-title">
                    <h5 class="fw-bold">Data Riwayat Transaksi</h5>
                </div>
                <div class="card-tools d-flex gap-2">
                    <button @click="printTransaksi" class="btn btn-outline-danger"><i class="fas fa-file-pdf"></i>Download PDf</button>
                    <button @click="exportExcel" class="btn btn-outline-success"><i class="fas fa-file-excel"></i> Export Excel</button>
                </div>
            </div>
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <div class="show d-flex align-items-center gap-1">
                        <label for="">Show:</label>
                        <select v-model="perPage" class="form-select">
                            <option :value="10">10</option>
                            <option :value="25">25</option>
                            <option :value="50">50</option>
                            <option :value="100">100</option>
                        </select>
                        <label for="">Entries</label>
                    </div>
                    <div class="search-date d-flex">
                        <div class="start-date d-flex align-items-center gap-2 mx-4">
                            <label for="">Mulai</label>
                            <input type="date" v-model="startDate" class="form-control">
                        </div>
                        <div class="end-date d-flex align-items-center gap-2">
                            <label for="">Akhir</label>
                            <input type="date" v-model="endDate" class="form-control">
                            <button @click="getData" class="btn btn-secondary btn-sm"><i class="fas fa-search"></i></button>
                        </div>
                    </div>
                    <div class="searching d-flex align-items-center gap-2">
                        <label for="">Search</label>
                        <input type="text" v-model="search" class="form-control" placeholder="Search Here...">
                    </div>
                </div>
                <div class="table-scroll">
                    <table class="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th width="5%">No</th>
                                <th>No. Invoice</th>
                                <th>Tanggal</th>
                                <th>Nama Customer</th>
                                <th>Total</th>
                                <th>Pembayaran</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="sales.length === 0">
                                <td colspan="8" class="text-center py-4" style="font-size: 3rem;">
                                    <p class="text-muted"><i class="fas fa-folder fa-3x"></i></p>
                                    <p class="text-muted">Data Riwayat Transaksi Kosong</p>
                                </td>
                            </tr>
                            <tr v-for="(item, index) in sales" :key="item.id">
                                <td>{{ (currentPage - 1) * perPage + index + 1 }}</td>
                                <td>{{ item.invoice_number }}</td>
                                <td>{{ item.sale_date }}</td>
                                <td>{{ item.customer_name }}</td>
                                <td>{{ formatRupiah(item.total_amount) }}</td>
                                <td class="text-center">{{ item.payment_method }}</td>
                                <td class="text-center">{{ item.status }}</td>
                                <td>
                                    <button @click="deleteData(item.id)" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-flex align-items-center justify-content-between">
                    <div class="page">
                        <span>Showing {{ currentPage }} from {{ lastPage }} to {{ totalData }}</span>
                    </div>
                    <div class="pagination">
                        <nav aria-label="navigation">
                            <ul class="pagination">
                                <li class="page-item" :class="{disabled: currentPage === 1}">
                                    <button class="page-link" @click="chagePage(currentPage - 1)">Previous</button>
                                </li>
                                
                                <li class="page-item" v-for="page in lastPage" :key="page" :class="{active: currentPage === page}">
                                    <button class="page-link">{{ page }}</button>
                                </li>

                                <li class="page-item" :class="{disabled: currentPage === lastPage}">
                                    <button class="page-link" @click="chagePage(currentPage + 1)">Next</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div style="position: fixed; left: -99999px; top: 0; width: 210mm;">
        <TransaksiPDF ref="transaksiPdf" />
    </div>
</template>

<style scoped>
.table-scroll {
    width: 100%;
    overflow: auto;
    white-space: nowrap;
}
</style>