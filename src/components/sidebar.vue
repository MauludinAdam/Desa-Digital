<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
// import { useAuth } from '@/helpers/auth';
import { getMe } from '@/services/UserService.js';
import Header from './Header.vue';

const route = useRoute();

const user = ref(null);

const can = (permission) => {
  return user.value?.permissions?.includes(permission) ?? false;
};

const fetchUser = async () => {
  try {
    const response = await getMe();

    // console.log(response.data.data?.permissions);

    user.value = response.data.data;
  } catch (error) {
    console.log(error)
  }
}

const isAdmin = computed(() => {
  return user.value?.role?.name === 'Admin';
})

const isHeadman = computed(() => {
  return user.value?.role?.name === 'Kepala Desa';
})

const isOperator = computed(() => {
  return user.value?.role?.name === 'Operator';
})

onMounted(() => {
  fetchUser();
})

</script>

<template>
    <div class="sidebar" data-background-color="dark">
        <div class="sidebar-logo">
          <!-- Logo Header -->
          <Header/>
          <!-- End Logo Header -->
        </div>
        <div class="sidebar-wrapper scrollbar scrollbar-inner">
          <div class="sidebar-content">
            <ul class="nav nav-secondary">
                <li v-if="can('dashboard-desa-menu')" class="nav-item">
                    <RouterLink :to="{name: 'dashboard-desa'}" :class="{active: route.name?.startsWith('dashboard-desa')}">
                     <i class="fas fa-home"></i>
                   <span class="sub-item">Dashboard <strong v-if="isHeadman">Desa</strong></span>
                    </RouterLink>
               </li>
              <li v-if="can('citizen-menu') || 
                        can('family-card-menu') || 
                        can('citizen-document-menu')
                        " 
                        class="nav-item" :class="{active:route.name?.startsWith('master-data')}">
                <a data-bs-toggle="collapse" href="#masterData" :aria-expanded="route.name?.startsWith('master-data')">
                  <i class="fas fa-layer-group"></i>
                  <p>Master Penduduk</p>
                  <span class="caret"></span>
                </a>
                <div class="collapse" id="masterData" :class="{show: route.name?.startsWith('master-data')}">
                  <ul class="nav nav-collapse">
                    <li v-if="can('citizen-menu')" :class="{active: route.name === 'master-data.citizen' || route.name?.startsWith('master-data.citizen-')}">
                      <RouterLink :to="{name: 'master-data.citizen'}">
                        <span class="sub-item">Data Penduduk</span>
                      </RouterLink>
                    </li>
                    <li v-if="can('family-card-menu')" :class="{active: route.name === 'master-data.family-card' || route.name?.startsWith('master-data.family-card-')}">
                      <RouterLink :to="{name: 'master-data.family-card'}">
                        <span class="sub-item">Kartu Keluarga</span>
                      </RouterLink>
                    </li>
                    <li v-if="can('citizen-document-menu')" :class="{active: route.name === 'master-data.document-penduduk' || route.name?.startsWith('master-data.document-penduduk-')}">
                      <RouterLink :to="{name: 'master-data.document-penduduk'}">
                        <span class="sub-item">Dokument Penduduk</span>
                      </RouterLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li v-if="can('letter-menu') || 
                        can('letter-attachment-menu') || 
                        can('letter-type-menu')
                        " 
                        class="nav-item" :class="{active:route.name?.startsWith('master-surat')}">
                <a data-bs-toggle="collapse" href="#masterSurat" :aria-expanded="route.name?.startsWith('master-surat')">
                  <i class="fas fa-layer-group"></i>
                  <p>Master Surat</p>
                  <span class="caret"></span>
                </a>
                <div class="collapse" id="masterSurat" :class="{show: route.name?.startsWith('master-surat')}">
                  <ul class="nav nav-collapse">
                    <li v-if="can('letter-type-menu')" :class="{active: route.name === 'master-surat.type-surat' || route.name?.startsWith('master-surat.type-surat-')}">
                      <RouterLink :to="{name: 'master-surat.type-surat'}">
                        <span class="sub-item">Type Surat</span>
                      </RouterLink>
                    </li>
                    <li v-if="can('letter-menu')" :class="{active: route.name === 'master-surat.surat' || route.name?.startsWith('master-surat.surat')}">
                      <RouterLink :to="{name: 'master-surat.surat'}">
                        <span class="sub-item">Surat</span>
                      </RouterLink>
                    </li>
                    
                  </ul>
                </div>
              </li>
              <li v-if="can('sosial-assistance-menu') || 
                        can('sosial-assistance-applicant-menu') || 
                        can('sosial-assistance-category-menu')
                        " 
                        class="nav-item" :class="{active:route.name?.startsWith('master-sosial')}">
                <a data-bs-toggle="collapse" href="#masterSosial" :aria-expanded="route.name?.startsWith('master-sosial')">
                  <i class="fas fa-layer-group"></i>
                  <p>Master Sosial</p>
                  <span class="caret"></span>
                </a>
                <div class="collapse" id="masterSosial" :class="{show: route.name?.startsWith('master-sosial')}">
                  <ul class="nav nav-collapse">
                    <li v-if="can('sosial-assistance-category-menu')" :class="{active: route.name === 'master-sosial.sosial-category' || route.name?.startsWith('master-sosial.sosial-category-')}">
                      <RouterLink :to="{name: 'master-sosial.sosial-category'}">
                        <span class="sub-item">Kategori Sosial</span>
                      </RouterLink>
                    </li>
                    <li v-if="can('sosial-assistance-menu')" :class="{active: route.name === 'master-sosial.bantuan-sosial' || route.name?.startsWith('master-sosial.bantuan-sosial-')}">
                      <RouterLink :to="{name: 'master-sosial.bantuan-sosial'}">
                        <span class="sub-item">Bantuan Sosial</span>
                      </RouterLink>
                    </li>
                    <li v-if="can('sosial-assistance-applicant-menu')" :class="{active: route.name === 'master-sosial.penerima-bansos' || route.name?.startsWith('master-sosial.penerima-bansos-')}">
                      <RouterLink :to="{name: 'master-sosial.penerima-bansos'}">
                        <span class="sub-item">Penerima Bansos</span>
                      </RouterLink>
                    </li>
                    
                  </ul>
                </div>
              </li>
              <li v-if="can('education-menu')"  class="nav-item">
                <RouterLink :to="{name: 'pendidikan'}" :class="{active: route.name?.startsWith('pendidikan')}">
                     <i class="fas fa-graduation-cap"></i>
                   <span class="sub-item">Data Pendidikan</span>
                </RouterLink>
              </li>
              <li v-if="can('occupation-menu')" class="nav-item">
                <RouterLink :to="{name: 'pekerjaan'}" :class="{active: route.name?.startsWith('pekerjaan')}">
                     <i class="fas fa-user-clock"></i>
                   <span class="sub-item">Data Pekerjaan</span>
                </RouterLink>
              </li>
              <li v-if="can('profile-village-menu')" class="nav-item">
                <RouterLink :to="{name: 'profile'}" :class="{active: route.name?.startsWith('profile')}">
                     <i class="fas fa-gears"></i>
                   <span class="sub-item">Profile</span>
                </RouterLink>
              </li>
              <li v-if="can('user-menu')" class="nav-item">
                <RouterLink :to="{name: 'user'}" :class="{active: route.name?.startsWith('user')}">
                     <i class="fas fa-users"></i>
                   <span class="sub-item">User</span>
                </RouterLink>
              </li>
              
              <!-- fitur BUMDes -->
              <li v-if="can('bumdes-menu')" class="nav-item mt-3" style="color: #666;">
                <span v-if="isHeadman" class="text-center mx-4">BUMDes</span>
              </li>
              <li v-if="can('dashboard-bumdes-menu')" class="nav-item">
                   <RouterLink :to="{name: 'dashboard-bumdes'}" :class="{active: route.name?.startsWith('dashboard-bumdes')}">
                    <i class="fas fa-home"></i>
                  <span class="sub-item">Dashboard <strong v-if="isHeadman">Bumdes</strong></span>
                   </RouterLink>
              </li>
              <li v-if="can('bumdes-profile-menu')" class="nav-item">
                <RouterLink :to="{name: 'bumdes'}" :class="{active: route.name?.startsWith('bumdes')}">
                     <i class="fas fa-sliders"></i>
                   <span class="sub-item">Profile Bumdes</span>
                </RouterLink>
              </li>
              <li v-if="can('bumdes-unit-menu')" class="nav-item">
                <RouterLink :to="{name: 'unit-usaha'}" :class="{active: route.name?.startsWith('unit-usaha')}">
                     <i class="fas fa-building"></i>
                   <span class="sub-item">Unit Usaha</span>
                </RouterLink>
              </li>
              <li v-if="can('bumdes-product-menu')" class="nav-item">
                <RouterLink :to="{name: 'product'}" :class="{active: route.name?.startsWith('product')}">
                     <i class="fas fa-box"></i>
                   <span class="sub-item">Data Product</span>
                </RouterLink>
              </li>
              <li v-if="can('bumdes-sales-item-menu')" class="nav-item">
                <RouterLink :to="{name: 'sales-item'}" :class="{active: route.name?.startsWith('sales-item')}">
                     <i class="fas fa-cart-plus"></i>
                   <span class="sub-item">POS / Kasir</span>
                </RouterLink>
              </li>
              <li v-if="can('bumdes-sales-menu')" class="nav-item">
                <RouterLink :to="{name: 'sales'}" :class="{active: route.name?.startsWith('sales')}">
                     <i class="fas fa-shop"></i>
                   <span class="sub-item">Data Transaksi</span>
                </RouterLink>
              </li>
              <li v-if="can('bumdes-report-menu')" class="nav-item">
                <RouterLink :to="{name: 'riwayat-transaksi'}" :class="{active: route.name?.startsWith('riwayat-transaksi')}">
                     <i class="fas fa-cart-plus"></i>
                   <span class="sub-item">Riwayat Penjualan</span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
</template>