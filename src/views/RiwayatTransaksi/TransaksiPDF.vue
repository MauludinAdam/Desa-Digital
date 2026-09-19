<script setup>
import { formatRupiah } from '@/utils/FormatRupiah';
import { ref, computed, onMounted } from 'vue';
import { getBumdesSaleses } from '@/services/BumdesSales';
import logoDesa from '@/assets/images/logo.png';

const loading = ref(false)

const sales = ref([])

const user = ref(null);
const userData = localStorage.getItem('user')
if(userData){
    user.value = JSON.parse(userData)
}

const getData = async () => {
    try {
        loading.value = true;

        const response = await getBumdesSaleses();

        console.log(response.data);

        sales.value = response.data.data.data;
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false;
    }
}

// FORMAT DATE
const formatDate = (date) => {
    if (!date) {
        return '-';
    }

    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

const printArea = ref(null)
defineExpose({
    printArea,
    getData
})

onMounted(() => {
    getData();
})


</script>

<template>
    <div class="bg-white card" ref="printArea" id="print-area">
        <div class="print-header d-flex text-center align-items-center justify-content-center mt-4">
            <div class="image-logo">
                <img :src="logoDesa" alt="" width="130">
            </div>
            <div class="title">
                <h2 class="mb-1">BUMDes Desa Digital Lewogeka</h2>
                <h4>Laporan Transaksi Penjualan</h4>
            </div>
        </div>

        <hr>
        <table class="table table-bordered p-4">
            <thead>
                <tr>
                    <th width="5%">No</th>
                    <th>No. Invoice</th>
                    <th>Tanggal</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Pembayaran</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in sales" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.invoice_number }}</td>
                    <td>{{ item.sale_date }}</td>
                    <td>{{ item.customer_name }}</td>
                    <td>{{ formatRupiah(item.total_amount) }}</td>
                    <td class="text-center">{{ item.payment_method }}</td>
                    <td class="text-center">{{ item.status }}</td>
                </tr>
            </tbody>
        </table>

        <div class="print-footer text-end p-5">
            <div class="mx-3">Di cek Pada : {{ new Date().toLocaleDateString('id-ID') }}</div>
            <div class="mx-4 mt-1">Petugas BUMDes</div>
            <br><br>
            <div class="mx-5">{{ user.name }}</div>
            <div>----------------------------</div>
        </div>

    </div>
    
</template>

<style scoped>
#print-area table{
    width: 100%;
    border-collapse: collapse;
}

#print-area table th,
#print-area table td {
    border: 1px solid #000 !important;
}
</style>