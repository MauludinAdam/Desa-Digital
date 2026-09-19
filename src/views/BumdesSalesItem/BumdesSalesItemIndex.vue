<script setup>
import { ref, onMounted, computed, onUnmounted, nextTick, watch } from 'vue';
import { generateInvoiceBumdesSales } from '@/services/BumdesSales';
import { findProductByBarcode, getBumdesProducts } from '@/services/BumdesProduct';
import { formatRupiah } from '@/utils/FormatRupiah';
import { terbilang } from '@/utils/Terbilang';
import Swal from 'sweetalert2';
import { createBumdesSales } from '@/services/BumdesSales';
import { formatInputRupiah, getRupiahValue } from '@/utils/InputRupiah';


const saleDate = ref(new Date().toISOString().split('T')[0])

const invoiceNumber = ref('');

const getInvoiceNumber = async () => {
    try {
        const response = await generateInvoiceBumdesSales();

        invoiceNumber.value = response.data.data.invoice_number
    } catch (error) {
        console.log(error);
    }
}

const user = ref('');

const userData = localStorage.getItem('user')
if (userData) {
    user.value = JSON.parse(userData)
}

const currentTime = ref('');
const updateTime = () => {
    const now = new Date()

    currentTime.value = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

let timeInterval


const productBarcode = ref('');

const selectedProduct = ref({
    id: '',
    barcode: '',
    name: '',
    price: 0,
    unit: '',
    stock: '',
});

const quantityInput = ref(null)

const customerName = ref('');

const quantity = ref(null);

const cart = ref([]);

const showProductModal = ref(false);
const products = ref([]);
const loading = ref(false);

const search = ref('');

// pagination produk starts
const currentPage = ref(1);
const perPage = ref(10);
const latsPage = ref(1);
const totalData = ref(0);

const getData = async () => {
    try {
        const response = await getBumdesProducts({
            page: currentPage.value,
            row_per_page: perPage.value,
            search: search.value,
        });

        console.log(response.data);

        products.value = response.data.data.data;

        currentPage.value = response.data.data.meta.current_page;
        latsPage.value = response.data.data.meta.last_page;
        totalData.value = response.data.data.meta.total;
    } catch (error) {
        console.log(error);
    }
}

const changePage = (page) => {
    if (page < 1 || page > latsPage.value) {
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

// pagination produk ends

const openProductSearch = async () => {
    showProductModal.value = true;
    loading.value = true

    try {

        const response = await getBumdesProducts();

        products.value = response.data.data.data;
    } catch (error) {
        console.log(error)

        Swal.fire({
            icon: "error",
            title: "Ooooopps....",
            text: 'Gagal mengambil data product',
        });
    } finally {
        loading.value = false;
    }
}

// Pilih product 
const selectProduct = (product) => {

    productBarcode.value = product.barcode

    showProductModal.value = false;
}

const closeProductModal = () => {
    showProductModal.value = false;
}

// pencarian berdasarkan barcode
const searchProduct = async () => {
    console.log('Barcode:', productBarcode.value)

    if (!productBarcode.value) {
        return
    }

    try {
        const response = await findProductByBarcode(productBarcode.value)

        console.log(response.data)

        const product = response.data.data;

        selectedProduct.value = {
            id: product.id,
            barcode: product.barcode,
            name: product.name,
            price: product.price,
            unit: product.unit,
            stock: product.stock,
        }

        quantity.value = 1

        quantityInput.value?.focus();

    } catch (error) {
        console.log(error)

        if (error.response?.status === 404) {

            Swal.fire({
                icon: 'error',
                title: 'Ooooppss....',
                text: 'Produk tidak ditemukan!.',
            });
        }
    }
}

const addToCart = () => {
    if (!selectedProduct.value.id) {

        Swal.fire({
            icon: 'error',
            title: 'Ooooopss...',
            text: 'Silahkan scan barcode atau cari produk terlebih dahulu!.'
        });

        return
    }

    const qty = Number(quantity.value)

    if (!qty || qty < 1) {
        Swal.fire({
            icon: 'warning',
            title: 'Quantity tidak valid',
            text: 'Jumlah product minimal 1.'
        })
        return
    }

    const stock = Number(selectedProduct.value.stock)

    if (stock <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Stock Habis',
            text: `Stock product ${selectedProduct.value.name} sudah habis.`,
        });
        return;
    }

    const existingItem = cart.value.find(item => item.bumdes_product_id === selectedProduct.value.id);

    if (existingItem) {

        const currentQty = Number(existingItem.quantity)
        const newQuantity = currentQty + qty

        if (newQuantity > stock) {
            Swal.fire({
                icon: 'warning',
                title: 'Stock tidak cukup',
                text: `Stock ${selectedProduct.value.name} hanya tersedia ${stock}.`
            });

            return;
        }

        existingItem.quantity = newQuantity

        existingItem.subtotal = Number(existingItem.price) * newQuantity
    } else {
        if(qty > stock){
            Swal.fire({
                icon: 'warning',
                title: 'Stok Tidak Cukup',
                text: `Stock ${selectedProduct.value.name} hanya tersedia ${stock}.`
            });

            return;

        }

        cart.value.push({
            bumdes_product_id: selectedProduct.value.id,
            barcode: selectedProduct.value.barcode,
            name: selectedProduct.value.name,
            price: selectedProduct.value.price,
            unit: selectedProduct.value.unit,
            quantity: qty,
            subtotal: Number(selectedProduct.value.price) * qty
        });
    }

    resetProduct()
}

const removeFormCart = (index) => {
    cart.value.splice(index, 1)
}


const resetProduct = () => {
    productBarcode.value = ''

    selectedProduct.value = {
        id: '',
        name: '',
        barcode: '',
        price: '',
        unit: '',
        stock: '',
    }

    quantity.value = null
}

const grandTotal = computed(() => {
    return cart.value.reduce((total, item) => {
        return total + Number(item.subtotal || 0)
    }, 0)
});


//  pembayaran
const showPaymentModal = ref(false);
const paymentMethod = ref('cash');
const paidAmount = ref(0);

const changeAmount = computed(() => {
    const paid = Number(paidAmount.value || 0)
    const total = Number(grandTotal.value || 0)

    return Math.max(paid - total, 0);
});

// function open modal
const openPaymentModal = () => {
    if (cart.value.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oooopss...',
            text: 'Keranjang masih kosong'
        });

        return
    }

    paidAmount.value = 0
    paymentMethod.value = 'cash'

    showPaymentModal.value = true
}

const closePaymentModal = () => {
    showPaymentModal.value = false
}


const receipt = ref({
    invoice_number: '',
    sale_date: '',
    customer_name: '',
    payment_method: '',
    total_amount: 0,
    paid_amount: 0,
    change_amount: 0,
    items: [],
})

// Proses Pembayaran
const processPayment = async () => {
    const total = Number(grandTotal.value)
    const paid = Number(paidAmount.value)

    if (cart.value.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Ooooopss....',
            text: 'Keranjang masih kosong'
        })

        return
    }

    if (paid < total) {
        Swal.fire({
            icon: 'error',
            title: 'Oooooopss....',
            text: 'Uang pembayaran kurang'
        })

        return
    }

    loading.value = true;

    try {
        const payload = {
            invoice_number: invoiceNumber.value,
            sale_date: saleDate.value,
            customer_name: customerName.value,
            total_amount: total,
            payment_method: paymentMethod.value,
            status: 'paid',

            items: cart.value.map(item => ({
                bumdes_product_id: item.bumdes_product_id,
                quantity: item.quantity,
                price: Number(item.price),
                subtotal: Number(item.subtotal)
            })),
        }

        console.log(payload)

        const response = await createBumdesSales(payload)

        console.log(response.data)

        const data = response.data.data

        receipt.value = {
            invoice_number: data.invoice_number,
            sale_date: data.sale_date,
            customer_name: data.customer_name,
            payment_method: data.payment_method,
            total_amount: Number(data.total_amount),
            paid_amount: paid,
            change_amount: paid - total,
            items: data.items || cart.value
        }

        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Transaksi berhasil disimpan.',
        })

        showPaymentModal.value = false

        await getInvoiceNumber()

        cart.value = []
        paidAmount.value = 0
        customerName.value = ''
        paymentMethod.value = ''

        resetProduct()

    } catch (error) {

        if (error.response?.data?.message) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: 'Transaksi gagal disimpan'
            });
        }
    } finally {
        loading.value = false;
    }
}

// fungsi print struk
const printReceipt = () => {
    const data = receipt.value

    console.log('DATA RECEIPT:', data)

    const receiptWindow = window.open(
        '',
        '_blank',
        'width=400,height=600'
    )

    if (!receiptWindow) {
        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Popup print diblokir browser'
        })

        return
    }

    const items = data.items || []

    const itemsHtml = items.map(item => `
        <div class="item">
            <div class="item-name">
                ${item.name || '-'}
            </div>

            <div class="item-detail">
                ${item.quantity} x 
                Rp ${Number(item.price || 0).toLocaleString('id-ID')}
                <span>Rp ${Number(item.subtotal || 0).toLocaleString('id-ID')}</span>    
            </div>
        </div>
    `).join('')

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${data.invoice_number || 'Struk'}</title>

            <style>
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 10px;
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    color: #000;
                    background: #fff;
                }

                .receipt {
                    width: 80mm;
                    margin: 0 auto;
                }

                .text-center {
                    text-align: center;
                }

                .bold {
                    font-weight: bold;
                }
                
                .space-name {
                    margin-bottom: 8px
                }

                hr {
                    border: 0;
                    border-top: 1px dashed #000;
                    margin: 8px 0;
                }

                .row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 4px;
                }

                .item {
                    margin-bottom: 7px;
                }

                .item-name {
                    font-weight: bold;
                }

                .item-detail {
                    display: flex;
                    justify-content: space-between;
                }

                @media print {
                    body {
                        padding: 0;
                    }

                    .receipt {
                        width: 80mm;
                    }
                }
            </style>
        </head>

        <body>

            <div class="receipt">

                <div class="text-center">
                    <div class="bold space-name">BUMDes</div>
                    <div>Desa Digital Lewogeka</div>
                </div>

                <hr>


                <div class="row">
                    Invoice : ${data.invoice_number || '-'}
                </div>

                <div class="row">
                    Tanggal : ${data.sale_date || '-'}
                </div>

                <div class="row">
                    Customer : ${data.customer_name || '-'}
                </div>

                <hr>

                ${itemsHtml}

                <hr>

                <div class="row bold">
                    <span>Total</span>
                    <span>
                        Rp ${Number(data.total_amount || 0).toLocaleString('id-ID')}
                    </span>
                </div>

                <div class="row">
                    <span>Dibayar</span>
                    <span>
                        Rp ${Number(data.paid_amount || 0).toLocaleString('id-ID')}
                    </span>
                </div>

                <div class="row">
                    <span>Kembalian</span>
                    <span>
                        Rp ${Number(data.change_amount || 0).toLocaleString('id-ID')}
                    </span>
                </div>

                <div class="row">
                    <span>Metode Pembayaran</span>
                    <span>
                        ${data.payment_method || '-'}
                    </span>
                </div>

                <hr>

                <div class="text-center">
                    ------ Terima kasih atas kunjungan Anda -------
                </div>

            </div>

        </body>
        </html>
    `

    receiptWindow.document.open()
    receiptWindow.document.write(html)
    receiptWindow.document.close()

    receiptWindow.onload = () => {
        receiptWindow.focus()
        receiptWindow.print()
    }
}

onMounted(() => {
    getInvoiceNumber();
    getData();

    updateTime();
    timeInterval = setInterval(updateTime, 1000)
});

onUnmounted(() => {
    clearInterval(timeInterval)
})

</script>

<template>
    <div class="container-fluit">
        <div class="d-flex align-items-center justify-content-between">
            <h4 class="text-danger fw-bold py-3">POINT OF SALES / KASIR</h4>

        </div>
        <div class="row">
            <div class="col-md-8">
                <div class="card p-3">
                    <div class="d-flex">
                        <div class="form-group">
                            <label for="">No. Invoice</label>
                            <input type="text" v-model="invoiceNumber"
                                class="form-control-plaintext text-danger fw-bold" readonly>
                        </div>
                        <div class="form-group">
                            <label for="">Tanggal</label>
                            <input type="date" v-model="saleDate" class="form-control-plaintext text-danger fw-bold"
                                readonly>
                        </div>

                        <div class="form-group">
                            <label for="">Nama Kasir</label>
                            <input type="text" v-model="user.name" class="form-control-plaintext fw-bold text-danger"
                                readonly>
                        </div>
                        <div class="text-end d-flex mt-4">
                            <h2 class="text-danger fw-bold">{{ currentTime }}</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card text-success h-75 p-3 d-flex align-items-center justify-content-center">
                    <h2 class="fw-bold bg-dark p-3 text-end" style="width: 100%;">{{ formatRupiah(grandTotal) }}</h2>
                </div>
            </div>
        </div>
        <div class="card p-3">
            <div class="container-fluit">
                <div class="d-flex col-lg-12 col-md-12 col-sm-12">
                    <div class="form group">
                        <div class="d-flex">
                            <input type="text" v-model="productBarcode" @keyup.enter="searchProduct"
                                class="form-control mt-3" placeholder="Scan / Masukkan Code/Barcode">
                            <button @click="openProductSearch"
                                class="btn btn-primary btn-sm border-0 text-white mt-3"><i
                                    class="fas fa-search"></i></button>
                        </div>
                    </div>
                    <div class="form-group mt-1">
                        <input type="text" v-model="selectedProduct.name" class="form-control" placeholder="Nama Product" readonly>
                    </div>
                    <div class="form-group mt-1">
                        <input type="text" class="form-control" :value="formatRupiah(selectedProduct.price)" placeholder="Harga" readonly>
                    </div>
                    <div class="form-group mt-1">
                        <input type="text" v-model="selectedProduct.unit" class="form-control" placeholder="Satuan" readonly>
                    </div>
                    <div class="form-group mt-1">
                        <input type="number" ref="quantityInput" v-model.number="quantity" min="1" max="selectedProduct.stock"
                            class="form-control text-center">
                    </div>
                </div>
                <div class="d-flex gap-1 justify-content-end">
                    <button @click="addToCart" class="btn btn-primary"><i class="fas fa-shopping-cart"></i>
                        Tambah</button>
                    <button @click="resetProduct" class="btn btn-secondary"><i class="fas fa-refresh"></i> Refresh</button>
                </div>
            </div>
        </div>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Barcode</th>
                    <th>Nama Product</th>
                    <th>Harga Jual</th>
                    <th>Satuan</th>
                    <th>Qty</th>
                    <th>Total Harga</th>
                    <th>#</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in cart" :key="index">
                    <td>{{ item.barcode }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ formatRupiah(item.price) }}</td>
                    <td>{{ item.unit }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ formatRupiah(item.subtotal) }}</td>
                    <td>
                        <button @click="removeFormCart(index)" class="btn btn-danger bt-sm">X</button>
                    </td>
                </tr>
                <tr v-if="cart.length === 0">
                    <td colspan="7" class="text-center">
                        <p class="py-1 text-muted" style="font-size: 1.1rem;">Belum ada pesanan!</p>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="card p-3">
            <div class="col-lg-12">
                <h4 class="text-warning text-center bg-dark p-3">{{ terbilang(grandTotal) ? terbilang(grandTotal) :
                    'Nol' }} Rupiah</h4>
            </div>
            <div class="d-flex gap-2 justify-content-end">
                <button @click="printReceipt" class="btn btn-danger" :disabled="!receipt.invoice_number"><i
                        class="fas fa-print"></i> Cetak Struk</button>
                <button @click="openPaymentModal" class="btn btn-success fw-bold"><i
                        class="fas fa-dollar-sign"></i>Pembayaran</button>
            </div>
        </div>
    </div>

    <!-- Modal list Product -->
    <Transition name="modal">
        <div v-if="showProductModal" class="modal" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Data Product</h5>
                        <button type="button" @click="closeProductModal" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
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
                            <div class="searching d-flex align-items-center gap-2">
                                <label for="">Search:</label>
                                <input type="text" v-model="search" class="form-control" placeholder="Search Here..."
                                    style="width: 15rem;">
                            </div>
                        </div>
                        <table class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th width="5%">No</th>
                                    <th>Barcode</th>
                                    <th>Nama product</th>
                                    <th>Harga Jual</th>
                                    <th>Stok</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="products.length > 0" v-for="(product, index) in products" :key="product.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ product.barcode }}</td>
                                    <td>{{ product.name }}</td>
                                    <td>{{ formatRupiah(product.price) }}</td>
                                    <td>{{ product.stock }}</td>
                                    <td>
                                        <button @click="selectProduct(product)"
                                            class="btn btn-success btn-sm">Pilih</button>
                                    </td>
                                </tr>
                                <tr v-else>
                                    <td colspan="6" class="text-center py-3">
                                        <p class="text-center" style="font-size: 2.5rem;"><i class="fas fa-folde"></i></p>
                                        <p class="text-center text-muted">{{ isSearching ? 'Data tidak ditemukan' : 'Data masih kosong' }}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="page-showing">
                                <span>Showing {{ currentPage }} to {{ latsPage }} of {{ totalData }}</span>
                            </div>
                            <div class="pagination">
                                <nav aria-label="navigation">
                                    <ul class="pagination">
                                        <li class="page-item" :class="{disabled: currentPage === 1}">
                                            <button class="page-link" @click="changePage(currentPage - 1)">Previous</button>
                                        </li>
                                        
                                        <li class="page-item" v-for="page in latsPage" :key="page" :class="{active: currentPage === page}">
                                            <button class="page-link">{{ page }}</button>
                                        </li>
                                        <li class="page-item" :class="{disabled: currentPage === latsPage}">
                                            <button class="page-link" @click="changePage(currentPage + 1)">Next</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button @click="closeProductModal" type="button" class="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button>

                    </div>
                </div>
            </div>
        </div>
    </Transition>

    <Transition name="backdrop">
        <div v-if="showProductModal" class="modal-backdrop fade show"></div>
    </Transition>

    <!-- Modal Show Payment -->
    <Transition name="modal">
        <div v-if="showPaymentModal" class="modal" tabindex="-1" style="display: block; background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Pembayaran</h5>
                        <button @click="closePaymentModal" type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="">Total Belanja</label>
                            <input type="text" class="form-control text-danger fw-bold mt-1"
                                :value="formatRupiah(grandTotal)" readonly>
                        </div>
                        <div class="mb-3">
                            <label for="">Metode Pembayaran</label>
                            <select v-model="paymentMethod" class="form-control mt-1">
                                <option value="">--- Pilih ---</option>
                                <option value="cash">Cash</option>
                                <option value="transfer">Transfer</option>
                                <option value="qris">Qris</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="mb-2">Nama Customer</label>
                            <input type="text" v-model="customerName" class="form-control mb-2"
                                placeholder="Masukkan Nama Customer">
                        </div>
                        <div class="mb-3 row">
                            <label class="col-sm-3 col-form-label">Uang Dibayar</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control-lg text-end w-100"
                                    :value="formatInputRupiah(paidAmount)"
                                    @input="paidAmount = getRupiahValue($event.target.value)"
                                    placeholder="Masukkan Jumlah Uang">
                            </div>
                        </div>
                        <div class="mb-3 row">
                            <label class="col-sm-3 col-form-label">Kembalian</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control-lg text-end w-100"
                                    :value="formatRupiah(changeAmount)" readonly>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button @click="closePaymentModal" type="button" class="btn btn-danger"
                            data-bs-dismiss="modal">Close</button>
                        <button type="button" @click="processPayment" class="btn btn-success" :disabled="loading"><span
                                v-if="loading" class="spinner-border spinner-border-sm me-1"></span> <i v-else
                                class="fas fa-check m1"></i> {{ loading ? 'Memproses...' : 'Bayar' }}</button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>


</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.backdrop-enter-from,
.backdrop-leave-active {
    transition: opacity 0.2s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
    opacity: 0;
}

.modal-enter.active .modal-dialog,
.modal-leave.active .modal-dialog {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .modal-dialog,
.modal-leave-to .modal-dialog {
    transform: translateY(-20px);
    opacity: 0;
}


/* Media print struk */
@media print {
    body * {
        visibility: hidden;
    }

    #receipt-print,
    #receipt-print,
    * {
        visibility: visible;
    }

    #receipt-print {
        position: absolute;
        left: 0;
        top: 0;
        width: 80em;
    }
}
</style>