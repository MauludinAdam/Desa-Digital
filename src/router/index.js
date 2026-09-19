import { createRouter, createWebHistory } from 'vue-router'

import Template from '@/layouts/Template.vue'
import CitizenIndex from '@/views/Citizen/CitizenIndex.vue';
import FamilyCardIndex from '@/views/FamilyCard/FamilyCardIndex.vue';
import Login from '@/views/auth/Login.vue';
import CitizenCreate from '@/views/Citizen/CitizenCreate.vue';
import CitizenDetail from '@/views/Citizen/CitizenDetail.vue';
import CitizenEdit from '@/views/Citizen/CitizenEdit.vue';
import FamilyCardCreate from '@/views/FamilyCard/FamilyCardCreate.vue';
import FamilyCardDetail from '@/views/FamilyCard/FamilyCardDetail.vue';
import FamilyCardEdit from '@/views/FamilyCard/FamilyCardEdit.vue';
import LatterTypeIndex from '@/views/LatterType/LatterTypeIndex.vue';
import LetterIndex from '@/views/Letter/LetterIndex.vue';
import LetterDetail from '@/views/Letter/LetterDetail.vue';
import LetterTemplate from '@/views/Letter/LetterTemplate.vue';
import CitizenAttachmanIndex from '@/views/CitizenAttachment/CitizenAttachmanIndex.vue';
import SosialCategoryIndex from '@/views/SosialCategory/SosialCategoryIndex.vue';
import SosialAssistanceIndex from '@/views/SosialAssistance/SosialAssistanceIndex.vue';
import SosialAssistanceCreate from '@/views/SosialAssistance/SosialAssistanceCreate.vue';
import SosialAssistanceEdit from '@/views/SosialAssistance/SosialAssistanceEdit.vue';
import SosialAssistanceRecipientIndex from '@/views/SosialAssistanceRecipient/SosialAssistanceRecipientIndex.vue';
import SosialAssistanceRecipientCreate from '@/views/SosialAssistanceRecipient/SosialAssistanceRecipientCreate.vue';
import SosialAssistanceRecipientEdit from '@/views/SosialAssistanceRecipient/SosialAssistanceRecipientEdit.vue';
import SosialAssistanceRecipientDetail from '@/views/SosialAssistanceRecipient/SosialAssistanceRecipientDetail.vue';
import Education from '@/views/Education/Education.vue';
import Occupations from '@/views/Occupations/Occupations.vue';
import Profile from '@/views/ProfileVillage/Profile.vue';
import ProfileVillageEdit from '@/views/ProfileVillage/ProfileVillageEdit.vue';
import ProfileUser from '@/views/ProfileUser/ProfileUser.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';
import ResetPassword from '@/views/auth/ResetPassword.vue';
import BumdesIndex from '@/views/Bumdes/BumdesIndex.vue';
import EditBumdes from '@/views/Bumdes/EditBumdes.vue';
import BumdesUnitIndex from '@/views/BumdesUnit/BumdesUnitIndex.vue';
import BumdesUnitCreate from '@/views/BumdesUnit/BumdesUnitCreate.vue';
import BumdesUnitEdit from '@/views/BumdesUnit/BumdesUnitEdit.vue';
import BumdesSalesIndex from '@/views/BumdesSales/BumdesSalesIndex.vue';
import BumdesSalesItemIndex from '@/views/BumdesSalesItem/BumdesSalesItemIndex.vue';
import BumdesProductIndex from '@/views/BumdesProduct/BumdesProductIndex.vue';
import BumdesProductCreate from '@/views/BumdesProduct/BumdesProductCreate.vue';
import BumdesProductEdit from '@/views/BumdesProduct/BumdesProductEdit.vue';
import BumdesSalesDetail from '@/views/BumdesSales/BumdesSalesDetail.vue';
import RiwayatTransaksiIndex from '@/views/RiwayatTransaksi/RiwayatTransaksiIndex.vue';
import DashboardDesa from '@/views/Dashboard/DashboardDesa.vue';
import DashboardBumdes from '@/views/Dashboard/DashboardBumdes.vue';
import TransaksiPDF from '@/views/RiwayatTransaksi/TransaksiPDF.vue';
import BumdesCreate from '@/views/Bumdes/BumdesCreate.vue';
import UserIndex from '@/views/Users/UserIndex.vue';
import UserCreate from '@/views/Users/UserCreate.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guest: true
      }
    },
     // Forgot Password
        {
          path: '/forgot-password',
          name: 'forgot-password',
          component: ForgotPassword,
          
        },

        // Reset Password
        {
          path: '/reset-password',
          name: 'reset-password',
          component: ResetPassword
        },
    
    {
      path:'/',
      component:Template,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
            path: '/dashboard-desa',
            name: 'dashboard-desa',
            component: DashboardDesa,
            meta: {
              requiresAuth: true,
              roles: ['Admin','Kepala Desa']
            }
        },
        // Modul citizen
        {
          path: '/citizen',
          name: 'master-data.citizen',
          component: CitizenIndex,
          meta: {
            requiresAuth: true,
            roles: ['Admin','Kepala Desa']
          }
        },
        {
          path: '/citizen/create',
          name: 'master-data.citizen-create',
          component: CitizenCreate,
          meta: {
            requiresAuth: true,
            roles: ['Admin']
          }
        },
        {
          path: '/citizen/detail/:id',
          name: 'master-data.citizen-detail',
          component: CitizenDetail,
          meta: {
            requiresAuth: true,
            roles: ['Admin','Kepala Desa']
          }
        },
        {
          path: '/citizen/edit/:id',
          name: 'master-data.citizen-edit',
          component: CitizenEdit,
          meta: {
            requiresAuth: true,
            roles: ['Admin']
          }
        },

        // Routing Citizen Attachman
        {
          path: '/document-penduduk',
          name: 'master-data.document-penduduk',
          component: CitizenAttachmanIndex,
          meta: {
            requiresAuth: true,
            roles: ['Admin','Kepala Desa']
          }
        },
        // Routing family-card
        {
          path: '/family-card',
          name: 'master-data.family-card',
          component: FamilyCardIndex,
          meta: {
            requiresAuth: true,
            roles: ['Admin','Kepala Desa']
          }
        },
        {
          path: '/family-card/create',
          name: 'master-data.family-card-create',
          component: FamilyCardCreate,
          meta: {
            requiresAuth: true,
            roles: ['Admin']
          }
        },
        {
          path: '/family-card/detail/:id',
          name: 'master-data.family-card-detail',
          component: FamilyCardDetail,
          meta: {
            requiresAuth: true,
            roles: ['Admin','Kepala Desa']
          }
        },
        {
          path: 'family-card/edit/:id',
          name: 'master-data.family-card-edit',
          component: FamilyCardEdit,
          meta: {
            requiresAuth: true,
          }
        },
        // Route Latter
        {
          path: '/type-surat',
          name: 'master-surat.type-surat',
          component: LatterTypeIndex,
          meta: {
            requiresAuth: true,
            roles: ['Admin','Kepala Desa']
          }
        },

        // Lampiran Surat
        {
          path: '/surat',
          name: 'master-surat.surat',
          component: LetterIndex,
          meta: {
            requiresAuth: true,
            roles: ['Admin','Kepala Desa']
          }
        },
        {
          path: '/surat/detail/:id',
          name: 'master-surat.surat-detail',
          component: LetterDetail,
          meta: {
            requiresAuth: true,
            roles: ['Admin','Kepala Desa']
          }
        },
        {
          path: '/surat/:id/template',
          name: 'master-surat.surat-template',
          component: LetterTemplate,
          meta: {
            requiresAuth: true,
          }
        },
        // routing sosial
        {
          path: '/sosial-category',
          name: 'master-sosial.sosial-category',
          component: SosialCategoryIndex,
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: '/bantuan-sosial',
          name: 'master-sosial.bantuan-sosial',
          component: SosialAssistanceIndex,
          meta: {
            requiresAuth: true,
            roles: ['Admin','Kepala Desa']
          }
        },
        {
          path: 'bantuan-sosial/create',
          name: 'master-sosial.bantuan-sosial-create',
          component: SosialAssistanceCreate,
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: 'bantuan-sosial/edit/:id',
          name: 'master-sosial.bantuan-sosial-edit',
          component: SosialAssistanceEdit,
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: 'penerima-bansos',
          name: 'master-sosial.penerima-bansos',
          component: SosialAssistanceRecipientIndex,
          meta: {
            requiresAuth: true,
            roles: ['Admin','Kepala Desa']
          }
        },
        {
          path: 'penerima-bansos/create',
          name: 'master-sosial.penerima-bansos-create',
          component: SosialAssistanceRecipientCreate,
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: 'penerima-bansos/detail/:id',
          name: 'master-sosial.penerima-bansos-detail',
          component: SosialAssistanceRecipientDetail,
          meta: {
            requiresAuth: true,
            roles: ['Admin','Kepala Desa']
          }
        },
        {
          path: 'penerima-bansos/edit/:id',
          name: 'master-sosial.penerima-bansos-edit',
          component: SosialAssistanceRecipientEdit,
          meta: {
            requiresAuth: true,
          }
        },

        // Modul Education
        {
          path: 'pendidikan',
          name: 'pendidikan',
          component: Education,
          meta: {
            requiresAuth: true,
          }
        },

        // Modul Occupations
        {
          path: 'pekerjaan',
          name: 'pekerjaan',
          component: Occupations,
          meta: {
            requiresAuth: true,
          }
        },

        // Modul Profile Desa
        {
          path: '/profile',
          name: 'profile',
          component: Profile,
          meta: {
            requiresAuth: true,
            roles: ['Admin','Kepala Desa']
          }
        },
        {
          path: '/profile/edit',
          name: 'profile-edit',
          component: ProfileVillageEdit,
          meta: {
            requiresAuth: true,
          }
        },

        // Profile User
        {
          path: '/profille-user',
          name: 'profile-user',
          component: ProfileUser,
          meta: {
            requiresAuth: true,
            roles: ['Admin','Kepala Desa']
          }
        },
        {
          path: 'user',
          name: 'user',
          component: UserIndex,
          meta: {
            requiresAuth: true,
            roles: ['Admin']
          }
        },
        {
          path: '/user/create',
          name: 'user-create',
          component: UserCreate,
          meta: {
            requiresAuth: true,
            roles: ['Admin']
          }
        },

        // Bumdes untuk operator
        {
            path: '/dashboard-bumdes',
            name: 'dashboard-bumdes',
            component: DashboardBumdes,
            meta: {
              requiresAuth: true,
              roles: ['Operator','Kepala Desa']
            }
        },
        {
          path: '/bumdes',
          name: 'bumdes',
          component: BumdesIndex,
          meta: {
            requiresAuth: true,
            roles: ['Operator','Kepala Desa']
          }
        },
        {
          path: '/bumdes/create',
          name: 'bumdes-create',
          component: BumdesCreate,
          meta: {
            requiresAuth: true,
            roles: ['Operator']
          }
        },
        {
          path: '/bumdes/edit',
          name: 'bumdes-edit',
          component: EditBumdes,
          meta: {
            requiresAuth: true,
            roles: ['Operator']
          }
        },
        {
          path: '/unit-usaha',
          name: 'unit-usaha',
          component:BumdesUnitIndex,
          meta: {
            requiresAuth: true,
            roles: ['Operator','Kepala Desa']
          }
        },
        {
          path: 'unit-usaha/create',
          name: 'unit-usaha-create',
          component: BumdesUnitCreate,
          meta: {
            requiresAuth: true,
            roles: ['Operator']
          }
        },
        {
          path: 'unit-usaha/edit/:id',
          name: 'unit-usaha-edit',
          component: BumdesUnitEdit,
          meta: {
            requiresAuth: true,
            roles: ['Operator']
          }
        },
        {
          path: 'sales',
          name: 'sales',
          component: BumdesSalesIndex,
          meta: {
            requiresAuth: true,
            roles: ['Operator','Kepala Desa']
          }
        },
        {
          path: 'sales/detail/:id',
          name: 'sales-detail',
          component: BumdesSalesDetail,
          meta: {
            requiresAuth: true,
            roles: ['Operator','Kepala Desa']
          }
        },
        {
          path: 'product',
          name: 'product',
          component: BumdesProductIndex,
          meta: {
            requiresAuth: true,
            roles: ['Operator','Kepala Desa']
          }
        },
        {
          path: 'product/create',
          name: 'product-create',
          component: BumdesProductCreate,
          meta: {
            requiresAuth: true,
            roles: ['Operator']
          }
        },
        {
          path: 'product/edit/:id',
          name: 'product-edit',
          component: BumdesProductEdit,
          meta: {
            requiresAuth: true,
            roles: ['Operator']
          }
        },
        {
          path: 'sales-item',
          name: 'sales-item',
          component: BumdesSalesItemIndex,
          meta: {
            requiresAuth: true,
            roles: ['Operator']
          }
        },
        {
          path: 'riwayat-transaksi',
          name: 'riwayat-transaksi',
          component: RiwayatTransaksiIndex,
          meta: {
            requiresAuth: true,
            roles: ['Operator','Kepala Desa']
          }
        },
        {
          path: 'transaksi-pdf',
          name: 'transaksi-pdf',
          component: TransaksiPDF,
          meta: {
            requiresAuth: true,
          }
        }
      ]
    },
  ],
});


// Function redirect dashboard berdasarkan role
const getDashboardByRole = (role) => {
  switch(role) {
    case 'Admin': 
    return '/dashboard-desa'

    case 'Kepala Desa':
      return '/dashboard-desa'

    case 'Operator':
      return '/sales-item'

    default: 
      return '/login'
  }
}

// Router Guard
router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem('user');

  // Belum login
  if(!token) {
    if(to.meta.requiresAuth){
      return '/login'
    }

    return true
  }

    // jika sudah login, tidak boleh masuk kehalaman guest
    if(to.meta.guest){

      if(!userData){
        return true
      }

      const user =JSON.parse(userData)
      const role = user .role?.name

      return getDashboardByRole(role)

    }

    // Cek role  halaman
    if(to.meta.roles){
      if(!userData){
        return '/login'
      }

      const user = JSON.parse(userData)
      const role = user.role?.name

      if(!to.meta.roles.includes(role)){
        return getDashboardByRole(role)
      }
    }

    return true;

})

export default router
