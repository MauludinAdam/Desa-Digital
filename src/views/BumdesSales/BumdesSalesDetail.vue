<script setup>
import { getBumdesSales } from '@/services/BumdesSales';
import { formatRupiah } from '@/utils/FormatRupiah';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const loading = ref(false);


const sales = ref({
    invoice_number: '',
    sale_date: '',
    customer_name: '',
    payment_method: '',
    status: '',
    total_amount: 0,

    bumdesSalesItem: [],
});


const getData = async () => {
    try {
        loading.value = true;
        const response = await getBumdesSales(route.params.id);
        
        const data = response.data.data;

        sales.value = data;

        
    } catch (error) {
     console.log(error)

    }finally{
        loading.value = false;
    }
}

onMounted(() => {
    getData();
});

</script>


<template>
    <div class="container-fluit">
        <div class="card">
            <div class="card-header d-flex align-items-center justify-content-between">
                <div class="card-title"><h5 class="fw-bold"> Detail Transaksi</h5></div>
                <div class="card-tools">
                    <RouterLink :to="{name: 'sales'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                </div>
            </div>
            <div class="card-body">
                <!-- Loading -->
                 <div v-if="loading" class="text-center py-4">
                    <div class="spinner-border spinner-border-sm text-primary"></div>
                    <p class="mt-2 mb-0">
                        Memuat detail transaksi...
                    </p>
                 </div>
                 <div v-else>
                     <table class="table">
                         <tbody>
                             <tr>
                                 <th width="19%">No. Invoice</th>
                                 <td width="7%">:</td>
                                 <td width="100%">{{ sales.invoice_number }}</td>
                             </tr>
                             <tr>
                                 <th>Tanggal</th>
                                 <td>:</td>
                                 <td>{{ sales.sale_date }}</td>
                             </tr>
                             <tr>
                                 <th>Nama Customer</th>
                                 <td>:</td>
                                 <td>{{ sales.customer_name }}</td>
                             </tr>
                             <tr>
                                 <th>Metode Pembayaran</th>
                                 <td>:</td>
                                 <td>{{ sales.payment_method }}</td>
                             </tr>
                         </tbody>
                     </table>
                     <table class="table table-striped table-bordered">
                         <thead>
                             <tr>
                                 <th width="5%">No</th>
                                 <th>Nama Product</th>
                                 <th>Qty</th>
                                 <th>Harga</th>
                                 <th class="text-end">Subtotal</th>
                             </tr>
                         </thead>
                         <tbody>
                            <tr v-if="sales.bumdesSalesItem.length === 0">
                                <td colspan="5" class="py-5">
                                    <p class="text-center text-muted fs-1"><i class="fas fa-folder"></i></p>
                                    <p class="text-center text-muted fs-5">Data transaksi kosong</p>
                                </td>
                             </tr>
                             <tr
                                v-for="(item, index) in sales.bumdesSalesItem" :key="item.id">
                                 <td>{{ index + 1 }}</td>
                                 <td>{{ item.bumdesProduct?.name ||'-' }}</td>
                                 <td>{{ item.quantity }}</td>
                                 <td>{{ formatRupiah(item.price) }}</td>
                                 <td class="text-end">{{ formatRupiah(item.subtotal) }}</td>
                             </tr>
                         </tbody>
                         <tfoot>
                             <tr>
                                 <td colspan="4" class="text-end fw-bold fs-4"> Total</td>
                                 <td class="text-end fw-semibold text-primary fs-4">{{ formatRupiah(sales.total_amount) }}</td>
                             </tr>
                         </tfoot>
                     </table>
                 </div>
            </div>
        </div>
    </div>
</template>