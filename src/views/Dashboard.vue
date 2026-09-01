<script setup>
import { ref,onMounted, computed } from 'vue';
import { getDashboard } from '@/services/Dashboard';
import Swal from 'sweetalert2';
import PopulationChart from '@/components/dashboard/PopulationChart.vue';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, plugins } from 'chart.js';
import { Doughnut, Bar } from 'vue-chartjs';

ChartJS.register(
  ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend
);

const dashboard = ref(null);

const getData = async () => {
  try {
    const response = await getDashboard();

    dashboard.value = response.data.data ?? [];
  } catch (error) {
    console.log('Gagal mengambil data dashboard', error);
  }
}

const loginMessage = localStorage.getItem("loginMessage");

const user = ref(null);
const userData = localStorage.getItem('user')
if(userData){
    user.value = JSON.parse(userData)
}

if (loginMessage) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: "success",
    title: loginMessage,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  localStorage.removeItem("loginMessage");
}

// CHART PENDUDUK

const populationChartData = computed(() => ({
  labels: ['Laki-Laki', 'Perempuan'],

  datasets: [
    {
      data: [
        // Jumlah Male dari Api
        dashboard.value?.gender?.find(item=> item.gender === 'male')?.total ?? 0,

        // Jumlah female dari api
        dashboard.value?.gender?.find(item => item.gender === 'female')?.total ?? 0
      ],
      backgroundColor: ['#0d6efd','#fd7e14'],
      borderWidth: 2
    },
  ],
}));

const populationChartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: 'bottom',
    },
  },
};

// CHART SURAT
const letterChartData = computed(() => ({
  labels: [
    'Pending',
    'Disetujui',
    'Ditolak',
  ],

  datasets: [
    {
      label: 'Jumlah Surat',
      data: [
        dashboard.value?.letter?.pending ?? 0,
        dashboard.value?.letter?.success ?? 0,
        dashboard.value?.letter?.reject ?? 0,
      ],
      backgroundColor: [
          '#ffc107','#198754','#dc3545'
      ],
      borderRadius: 6
    }
  ],
}));

const letterChartOptions = {
  responsive: true,
  maintainAspectRation: false,

  plugins: {
    legend: {
      display: false,
    },
  },
};


// CAHRT USIA
const ageChartData = computed(() => ({
  labels: [
    '0-5',
    '6-17',
    '18-35',
    '36-60',
    '>60',
  ],

  datasets: [
    {
      label: 'Jumlah Penduduk',
      data: [
        dashboard.value?.age?.['0-5'] ?? 0,
        dashboard.value?.age?.['6-17'] ?? 0,
        dashboard.value?.age?.['18-35'] ?? 0,
        dashboard.value?.age?.['36-60'] ?? 0,
        dashboard.value?.age?.['>60'] ?? 0
      ],
      backgroundColor: [
        '#0dcaf0', '#6f42c1','#fd7e14','#20c997','#6c757d'
      ],
      borderRadius: 6,
    },
  ],
}));

const ageChartOptions = {
  responsive: true,
  maintainAspectRation: false,

  plugins: {
    legend: {
      display: false,
    }
  }
};


// CHART PENDIDIKAN
const educationChartData = computed(() => ({
  labels: [
    'SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3','Belum Diisi'
  ],

  datasets: [
    {
      label: 'Jumlah Penduduk',
      data: [
        ...['SD', 'SMP', 'SMA', 'D1', 'D2', 'D3', 'S1', 'S2', 'S3',].map((name) => {
          return dashboard.value?.education?.find((item) => item.education?.name === name)?.total ?? 0
        }),

        dashboard.value?.education?.find((item) => item.education === null)?.total ?? 0
      ],
      backgroundColor: [
        '#0d6efd','#6610f2','#6f42c1','#d63384','#fd7e14','#198754'
      ],
      borderRadius: 6
    },
  ],
}));

const educationChartOptions = {
  responsive: true,
  maintainAspectRation: false,

  plugins: {
    legend: {
      display: false,
    }
  }
};

onMounted(() => {
  getData();
});


</script>


<template>
  <div class="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
    <div class="card py-4 text-white p-4 w-100" style="background: #0F172B">
      <h3 class="fw-bold">Halo {{ user.name }},👋</h3><hr>
      <span><marquee>Selamat Datang Di Sistem Informasi Administrasi Desa Digital Lewogeka</marquee></span>
    </div>
  </div>
  <div class="row">
    <div class="col-sm-6 col-md-3">
      <div class="card card-stats card-round">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-icon">
              <div class="icon-big text-center icon-primary bubble-shadow-small">
                <i class="fas fa-users"></i>
              </div>
            </div>
            <div class="col col-stats ms-3 ms-sm-0">
              <div class="numbers">
                <p class="card-category">Total Penduduk</p>
                <h4 class="card-title">{{ dashboard?.citizen ?? 0 }}</h4>
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
                <i class="fas fa-user-check"></i>
              </div>
            </div>
            <div class="col col-stats ms-3 ms-sm-0">
              <div class="numbers">
                <p class="card-category">Total KK</p>
                <h4 class="card-title">{{ dashboard?.family_card ?? 0 }}</h4>
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
                <p class="card-category">Total Surat</p>
                <h4 class="card-title">{{ dashboard?.letter?.total ?? 0 }}</h4>
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
                <p class="card-category">Terima Bansos</p>
                <h4 class="card-title">{{ dashboard?.sosial_assistance_applicant ?? 0 }}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluit">
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">Statistik Penduduk</h5>
            <small class="text-muted">Jumlah Penduduk Berdasarkan Jenis Kelamin</small>
          </div>
          <div class="card-body">
            <div style="height: 300px;">

              <Doughnut :data="populationChartData" :options="populationChartOptions" />

            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6 mb-6">
        <div class="card border-0 shadow-sm" style="height: 92%;">
          <div class="card-header bg-white border-0">
            <h5 class="fw-bold mb-1">Statistik Surat</h5>
            <small class="text-muted">Status Pengajuan</small>
          </div>
          <div class="card-body">
            <Bar :data="letterChartData" :options="letterChartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row mt-3">

    <div class="col-md-6">
        <div class="card border-0 shadow-sm" style="height: 92%;">
          <div class="card-header bg-white border-0">
            <h5 class="fw-bold mb-1">
              Statistik Usia
            </h5>
            <small class="text-muted">Jumlah Penduduk Berdasarkan kelompok Usia</small>
          </div>
          <div class="card-body">
            <Bar :data="ageChartData" :options="ageChartOptions" />
          </div>
        </div>
    </div>

    <div class="col-md-6">
        <div class="card border-0 shadow-sm" style="height: 92%;">
          <div class="card-header bg-white border-0">
            <h5 class="fw-bold mb-1">Statistik Pendidikan</h5>
            <small class="text-muted">Jumlah Penduduk Berdasarkan Pendidikan</small>
          </div>
          <div class="card-body">
              <Bar :data="educationChartData" :options="educationChartOptions" />
          </div>
        </div>
    </div>
  </div>


</template>