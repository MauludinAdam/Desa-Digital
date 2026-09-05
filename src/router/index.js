import { createRouter, createWebHistory } from 'vue-router'

import Template from '@/layouts/Template.vue'
import Dashboard from '@/views/Dashboard.vue'
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
            path: '/',
            name: 'dashboard',
            component: Dashboard,
            meta: {
              requiresAuth: true,
            }
        },
        // Modul citizen
        {
          path: '/citizen',
          name: 'master-data.citizen',
          component: CitizenIndex,
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: '/citizen/create',
          name: 'master-data.citizen-create',
          component: CitizenCreate,
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: '/citizen/detail/:id',
          name: 'master-data.citizen-detail',
          component: CitizenDetail,
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: '/citizen/edit/:id',
          name: 'master-data.citizen-edit',
          component: CitizenEdit,
          meta: {
            requiresAuth: true
          }
        },

        // Routing Citizen Attachman
        {
          path: '/document-penduduk',
          name: 'master-data.document-penduduk',
          component: CitizenAttachmanIndex,
          meta: {
            requiresAuth: true,
          }
        },
        // Routing family-card
        {
          path: '/family-card',
          name: 'master-data.family-card',
          component: FamilyCardIndex,
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/family-card/create',
          name: 'master-data.family-card-create',
          component: FamilyCardCreate,
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: '/family-card/detail/:id',
          name: 'master-data.family-card-detail',
          component: FamilyCardDetail,
          meta: {
            requiresAuth: true,
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
          }
        },

        // Lampiran Surat
        {
          path: '/surat',
          name: 'master-surat.surat',
          component: LetterIndex,
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: '/surat/detail/:id',
          name: 'master-surat.surat-detail',
          component: LetterDetail,
          meta: {
            requiresAuth: true,
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

        // Bumdes untuk operator
        {
          path: '/bumdes',
          name: 'bumdes',
          component: BumdesIndex,
          meta: {
            requiresAuth: true,
          }
        },
        {
          path: '/bumdes/edit',
          name: 'bumdes-edit',
          component: EditBumdes,
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
          }
        },
      ]
    },
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");

  if(to.meta.requiresAuth && !token) {
    return "/login";
  }

  if(to.meta.guest && token){
    return "/"
  }

  return true;
})

export default router
