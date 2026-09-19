<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { getDashboardBumdes } from '@/services/DashboardBumdes';
import { formatRupiah } from '@/utils/FormatRupiah';
import Chart from 'chart.js/auto';
// import { Doughnut } from 'vue-chartjs';

const loading = ref(true)

const salesChartData = ref([])
const paymentMethods = ref([])

// Canvas
const salesChartCanvas = ref(null)
const paymentChartCanvas = ref(null)

// Chart Instance
let salesChart = null
let paymentChart = null

const statistics = ref({
    total_sales: 0,
    total_transakctions: 0,
    total_product: 0,
    average_transaction: 0,
    products_sold: 0,
    low_stoct: 0,
    out_of_stoct: 0
})

const loadDashboard = async () => {
    try {
        const response = await getDashboardBumdes()

        const data = response.data.data
        
        console.log(data)

        statistics.value = data.statistics
        paymentMethods.value = data.payment_methods
        salesChartData.value = data.sales_chart

        loading.value = false

        await nextTick()

        createPaymentChart()
        createSalesChart()

    } catch (error) {
        console.log(error);
    }finally{
        loading.value = false
    }
}

// Line Chart
const createSalesChart = () => {
  if(!salesChartCanvas.value){
    return
  }

  // Hapus chart lama
  if(salesChart){
    salesChart.destroy();
  }

  salesChart = new Chart(
    salesChartCanvas.value, 
    {
      type: 'line',
      data: {
        labels:salesChartData.value.map(
          item => item.label
        ),
        datasets: [
          {
            label: 'Penjualan',
            data: salesChartData.value.map(
              item => Number(item.total),
            ),
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },

          tooltip: {
            callbacks: {
              label: function (context) {
                return 'Rp ' + new Intl.NumberFormat('id-ID').format(context.raw)
              }
            }
          }
        },

        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value){
                return 'Rp ' + new Intl.NumberFormat('id-ID').format(value)
              }
            }
          }
        }
      }
    }
  )
}


// Doughnut Chart
const createPaymentChart = () => {
    if(!paymentChartCanvas.value) {
      return
    }

    if(paymentChart){
        paymentChart.destroy()
    }

    paymentChart = new Chart(paymentChartCanvas.value, {
        type: 'doughnut',
        data: {
            labels: paymentMethods.value.map(
                item => formatPaymentMethod(
                  item.payment_method
                )
            ),
            datasets: [
                {
                    data: paymentMethods.value.map(
                        item => Number(item.total)
                    ),
                    borderWidth: 2
                }
            ]
        },
        options : {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20
                    }
                },

                tooltip: {
                  callbacks: {
                    label: function (context){
                      return context.label + ':' + context.raw + ' transaksi'
                    }
                  }
                }
            }
        }
    })
}

// Format Payment 
const formatPaymentMethod = (method) => {
  if(!method){
    return '-'
  }

  return method.charAt(0).toUpperCase() + method.slice(1)
}

// LIFECYCLE
onMounted(() => {
  loadDashboard()
})

onBeforeUnmount(() => {
  if(salesChart) {
    salesChart.destroy()
  }

  if (paymentChart){
    paymentChart.destroy()
  }
})

</script>

<template>
<div class="container-fluit">

    <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-secondary"></div>
        <p class="mt-2 text-muted">
            Memuat dashboard...
        </p>
    </div>

    <div v-else>
        <div class="row">
          <div class="col-sm-6 col-md-3">
            <div class="card card-stats card-round">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-icon">
                    <div class="icon-big text-center icon-primary bubble-shadow-small">
                      <i class="fas fa-shop"></i>
                    </div>
                  </div>
                  <div class="col col-stats ms-3 ms-sm-0">
                    <div class="numbers">
                      <p class="card-category">Total Penjualan</p>
                      <h4 class="card-title">{{ formatRupiah(total_sales) }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-3">
            <div class="card card-stats card-round">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-icon">
                    <div class="icon-big text-center icon-info bubble-shadow-small">
                      <i class="fa-solid fa-money-bill-trend-up"></i>
                    </div>
                  </div>
                  <div class="col col-stats ms-3 ms-sm-0">
                    <div class="numbers">
                      <p class="card-category">Total Transaksi</p>
                      <h4 class="card-title">{{ statistics.total_transakctions ? statistics.total_transakctions : 0 }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-3">
            <div class="card card-stats card-round">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-icon">
                    <div class="icon-big text-center icon-success bubble-shadow-small">
                      <i class="fas fa-luggage-cart"></i>
                    </div>
                  </div>
                  <div class="col col-stats ms-3 ms-sm-0">
                    <div class="numbers">
                      <p class="card-category">Total Product</p>
                      <h4 class="card-title">{{ statistics.total_product  }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-3">
            <div class="card card-stats card-round">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-icon">
                    <div class="icon-big text-center icon-secondary bubble-shadow-small">
                      <i class="fas fa-box"></i>
                    </div>
                  </div>
                  <div class="col col-stats ms-3 ms-sm-0">
                    <div class="numbers">
                      <p class="card-category">Rata-Rata Transaksi</p>
                      <h4 class="card-title">{{ formatRupiah(statistics.average_transaction) }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-6 col-md-4">
            <div class="card card-stats card-round">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-icon">
                    <div class="icon-big text-center icon-black bubble-shadow-small">
                      <i class="fa-brands fa-product-hunt"></i>
                    </div>
                  </div>
                  <div class="col col-stats ms-3 ms-sm-0">
                    <div class="numbers">
                      <p class="card-category">Product Terjual</p>
                      <h4 class="card-title">{{ statistics.products_sold }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-4">
            <div class="card card-stats card-round">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-icon">
                    <div class="icon-big text-center icon-warning bubble-shadow-small">
                      <i class="fa-solid fa-money-bill-trend-up"></i>
                    </div>
                  </div>
                  <div class="col col-stats ms-3 ms-sm-0">
                    <div class="numbers">
                      <p class="card-category">Stok Menipis</p>
                      <h4 class="card-title">{{ statistics.low_stoct }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-4">
            <div class="card card-stats card-round">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-icon">
                    <div class="icon-big text-center icon-danger bubble-shadow-small">
                      <i class="fas fa-luggage-cart"></i>
                    </div>
                  </div>
                  <div class="col col-stats ms-3 ms-sm-0">
                    <div class="numbers">
                      <p class="card-category">Stok Habis</p>
                      <h4 class="card-title">{{ statistics.out_of_stoct ? statistics.out_of_stoct : 0  }}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-6">
        <div class="card card-rounded">
            <div class="card-header">
                <div class="card-head-row">
                    <div class="card-title">Metode Pembayaran</div>
                </div>
            </div>
            <div class="card-body">
                <div style="height: 300px;">
                    <canvas ref="paymentChartCanvas"></canvas>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-6">
        <div class="card card-rounded">
            <div class="card-header">
                <div class="card-head-row">

                    <div class="card-title">
                        Penjualan Minggu ini 
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div style="height: 300px;">
                    <canvas ref="salesChartCanvas"></canvas>
                </div>
            </div>
        </div>
    </div>
</div>

</template>