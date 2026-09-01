<script setup>
import { useRoute } from 'vue-router';
import Header from './Header.vue';
import { useAuth } from '@/helpers/auth';
import { onMounted } from 'vue';

const { fetchUser, isAdmin, isHeadman } = useAuth();

const route = useRoute();

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
                <li class="nav-item">
                    <RouterLink :to="{name: 'dashboard'}" :class="{active: route.name?.startsWith('dashboard')}">
                     <i class="fas fa-home"></i>
                   <span class="sub-item">Dashboard</span>
                    </RouterLink>
               </li>
              <li class="nav-item" :class="{active:route.name?.startsWith('master-data')}">
                <a data-bs-toggle="collapse" href="#masterData" :aria-expended="route.name?.startsWith('master-data')">
                  <i class="fas fa-layer-group"></i>
                  <p>Master Penduduk</p>
                  <span class="caret"></span>
                </a>
                <div class="collapse" id="masterData" :class="{show: route.name?.startsWith('master-data')}">
                  <ul class="nav nav-collapse">
                    <li :class="{active: route.name === 'master-data.citizen' || route.name?.startsWith('master-data.citizen-')}">
                      <RouterLink :to="{name: 'master-data.citizen'}">
                        <span class="sub-item">Data Penduduk</span>
                      </RouterLink>
                    </li>
                    <li :class="{active: route.name === 'master-data.family-card' || route.name?.startsWith('master-data.family-card-')}">
                      <RouterLink :to="{name: 'master-data.family-card'}">
                        <span class="sub-item">Kartu Keluarga</span>
                      </RouterLink>
                    </li>
                    <li :class="{active: route.name === 'master-data.document-penduduk' || route.name?.startsWith('master-data.document-penduduk-')}">
                      <RouterLink :to="{name: 'master-data.document-penduduk'}">
                        <span class="sub-item">Dokument Penduduk</span>
                      </RouterLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li class="nav-item" :class="{active:route.name?.startsWith('master-surat')}">
                <a data-bs-toggle="collapse" href="#masterSurat" :aria-expended="route.name?.startsWith('master-surat')">
                  <i class="fas fa-layer-group"></i>
                  <p>Master Surat</p>
                  <span class="caret"></span>
                </a>
                <div class="collapse" id="masterSurat" :class="{show: route.name?.startsWith('master-surat')}">
                  <ul class="nav nav-collapse">
                    <li :class="{active: route.name === 'master-surat.type-surat' || route.name?.startsWith('master-surat.type-surat-')}">
                      <RouterLink :to="{name: 'master-surat.type-surat'}">
                        <span class="sub-item">Type Surat</span>
                      </RouterLink>
                    </li>
                    <li :class="{active: route.name === 'master-surat.surat' || route.name?.startsWith('master-surat.surat')}">
                      <RouterLink :to="{name: 'master-surat.surat'}">
                        <span class="sub-item">Surat</span>
                      </RouterLink>
                    </li>
                    
                  </ul>
                </div>
              </li>
              <li class="nav-item" :class="{active:route.name?.startsWith('master-sosial')}">
                <a data-bs-toggle="collapse" href="#masterSosial" :aria-expended="route.name?.startsWith('master-sosial')">
                  <i class="fas fa-layer-group"></i>
                  <p>Master Sosial</p>
                  <span class="caret"></span>
                </a>
                <div class="collapse" id="masterSosial" :class="{show: route.name?.startsWith('master-sosial')}">
                  <ul class="nav nav-collapse">
                    <li v-if="isAdmin" :class="{active: route.name === 'master-sosial.sosial-category' || route.name?.startsWith('master-sosial.sosial-category-')}">
                      <RouterLink :to="{name: 'master-sosial.sosial-category'}">
                        <span class="sub-item">Kategori Sosial</span>
                      </RouterLink>
                    </li>
                    <li :class="{active: route.name === 'master-sosial.bantuan-sosial' || route.name?.startsWith('master-sosial.bantuan-sosial-')}">
                      <RouterLink :to="{name: 'master-sosial.bantuan-sosial'}">
                        <span class="sub-item">Bantuan Sosial</span>
                      </RouterLink>
                    </li>
                    <li :class="{active: route.name === 'master-sosial.penerima-bansos' || route.name?.startsWith('master-sosial.penerima-bansos-')}">
                      <RouterLink :to="{name: 'master-sosial.penerima-bansos'}">
                        <span class="sub-item">Penerima Bansos</span>
                      </RouterLink>
                    </li>
                    
                  </ul>
                </div>
              </li>
              <li class="nav-item">
                <RouterLink v-if="isAdmin" :to="{name: 'pendidikan'}" :class="{active: route.name?.startsWith('pendidikan')}">
                     <i class="fas fa-graduation-cap"></i>
                   <span class="sub-item">Data Pendidikan</span>
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink v-if="isAdmin" :to="{name: 'pekerjaan'}" :class="{active: route.name?.startsWith('pekerjaan')}">
                     <i class="fas fa-user-clock"></i>
                   <span class="sub-item">Data Pekerjaan</span>
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink :to="{name: 'profile'}" :class="{active: route.name?.startsWith('profile')}">
                     <i class="fas fa-gears"></i>
                   <span class="sub-item">Pengaturan</span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
</template>