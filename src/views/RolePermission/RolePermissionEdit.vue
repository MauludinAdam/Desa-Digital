<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from '@/utils/swal';
import { getRole, updateRole } from '@/services/RolesService';
import { getPermissions, updateRolePermissions } from '@/services/PermissionService';

const route = useRoute()
const router = useRouter()

const loading = ref(false);
const loadingData = ref(false);

const errors = ref({});
const message = ref("");

const role = ref([])

const form = ref({
    name: '',
})

const permissions = ref([]);

const selectedPermissions = ref([]);

// Get Role
const getRoleData = async() => {
    try {
        const response = await getRole(route.params.id);

        role.value = response.data.data;

        form.value.name = role.value.name;

        selectedPermissions.value = role.value?.permissions?.map(permission => permission.id) || [];

        console.log(selectedPermissions.value);
    } catch (error) {
        console.log(error)

        if(error.response?.status === 404){
            toast("error","Role tidak ditemukan");
        }

        router.push({
            name: 'pengaturan'
        });
    }
}

// GET PERMISSIONS
const getDataPermission = async() => {
    try {
        const response = await getPermissions();

        console.log(response.data);

        permissions.value = response.data.data;
    } catch (error) {
        console.log(error)
    }
}

// Group PERMISSIONS

const groupPermissions = computed(() => {
     const groups = {};
    
    permissions.value.forEach(permission => {
        const parts = permission.name.split('-');

        const action = parts.pop();

        const module = parts.join('-');

        if(!groups[module]) {
            groups[module] = [];
        }

        groups[module].push({
            ...permission, action
        });
    });

    return groups;
});


// FORMAT MODULE
const formatModuleName = (name) => {
    const labels = {
        'family-card': 'Kartu keluarga',
        'family-member': 'Anggota keluarga',
        'citizen': 'Penduduk',
        'citizen-document': 'Dokumen Penduduk',
        'head-of-family': 'Kepala Keluarga',
        'letter': 'Surat',
        'letter-attachment': 'Lampiran Surat',
        'letter-type': 'Type Surat',
        'sosial-assistance-category': 'Kategori Bantuan Sosial',
        'sosial-assistance': 'Bantuan Sosial',
        'sosial-assistance-applicant': 'Penerima Bansos',
        'profile-village': 'Profil Desa',
        'occupation': 'Pekerjaan',
        'education': 'Pendididikan',
    }

    return labels[name] || name
    .split('-')
    .map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');
};


// CEK PERMISSION
const hasPermission = (permissionId) => {
    return selectedPermissions.value.includes(permissionId);
}

// TOGGLE PERMISSION
const togglePermission = (permissionId) => {
    const index = selectedPermissions.value.indexOf(permissionId);

    if(index === -1){
        selectedPermissions.value.push(permissionId);
    }else{
        selectedPermissions.value.splice(index, 1)
    }
}


// SELECT ALL MODULE
const isModuleSelected = (modulePermissions) => {
    return modulePermissions.every(permission => selectedPermissions.value.includes(permission.id));
}


// TOGGLE ALL MODULE
const toggleModule = (modulePermissions) => {
    const allSelected = isModuleSelected(modulePermissions);

    if(allSelected){

        modulePermissions.forEach(permission => {
            const index = selectedPermissions.value.indexOf(permission.id);

            if(index !== -1){
                selectedPermissions.value.splice(index, 1)
            }
        });
    }else{
        modulePermissions.value.includes(permission => {
            if(!selectedPermissions.value.includes(permission.id)
        )   {
                selectedPermissions.value.push(permission.id);
            }
        })
    }
}
 
// SIMPAN DATA
const saveData = async () => {
    message.value = ''
    errors.value = {}

    if(!form.value.name) {
        errors.value.name = ["Nama role harus diisi"];
    }

    if(Object.keys(errors.value).length > 0) {
        return;
    }

    try {
        loading.value = true;

        // Update Role
        const roleData = {
            name: form.value.name
        };

        console.log(roleData);

        await updateRole(route.params.id, roleData);

        //Update Permission
        
        console.log(selectedPermissions.value);

        await updateRolePermissions(route.params.id, selectedPermissions.value);

        toast("success","Role dan permission berhasil diperbarui");

        router.push({
            name: 'pengaturan'
        })
    } catch (error) {
         console.log('STATUS:', error.response?.status);
    console.log('RESPONSE:', error.response?.data);
    console.log('ERROR:', error);

        console.log(error);
        if(error.response.status === 422) {
            errors.value = error.response.data.errors || {};
        }
    }finally{
        loading.value = false;
    }
}

const cancelEdit = () => {
    router.push({
        name: 'pengaturan'
    });
}


//LOAD DATA
const loadData = async () => {
    loadingData.value = true;

    await Promise.all([
        getRoleData(),
        getDataPermission()
    ]);

    loadingData.value = false;
}

onMounted(() => {
    loadData();
    getRoleData();
    getDataPermission();
})

</script>


<template>
    <div class="container-fluit">
        <div class="card">
            <div class="card-header d-flex align-items-center justify-content-between">
                <div class="card-title">
                    <h5 class="fw-bold">Kelola Nama Role dan Permission</h5>
                </div>
                <div class="card-tools">
                    <RouterLink :to="{name: 'pengaturan'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                </div>
            </div>
            <div class="card-body">
                <div>
                    <div class="mb-3">
                        
                            <label for="form-label">Nama Role</label>
                            <input type="text" class="form-control mt-2" v-model="form.name" :class="{'is-invalid': errors.name}" placeholder="Masukkan Nama Role">
                            <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                    
                    </div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <div class="d-flex align-items-center justify-content-between">
                    <h5>Permission</h5>
                    <span class="badge bg-primary" style="font-size: 1rem;">{{ selectedPermissions.length }} permission dipilih</span>
                </div>
            </div>
            <div v-if="loadingData" class="card-body">
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2">
                        Memuat data...
                    </p>
                </div>
            </div>
            <div v-else class="card-body">
                <div v-if="Object.keys(groupPermissions).length === 0" class="text-center text-muted py-4"> Permission tidak tersedia</div>
                <div v-for="(modulePermissions, moduleName) in groupPermissions" :key="moduleName" class="border rounded mb-3">

                    <!-- Module header -->
                     <div class="d-flex align-items-center p-2" style="background-color: #F0FFFF;">
                        <div class="form-check">
                            <input type="checkbox" :checked="isModuleSelected(modulePermissions)" @change="toggleModule(modulePermissions)" class="mx-2" style="font-size: 1.3rem;">
                            <label for="form-check-label fw-bold text-dark"><h5 class="text-dark fw-bold">{{ formatModuleName(moduleName) }}</h5></label>
                        </div>
                     </div>

                     <!-- PERMISSION -->
                     <div class="p-3">
                        <div class="row">
                            <div v-for="permission in modulePermissions" :key="permission.id" class="col-md-3 col-sm-6 mb-2">
                                <div class="form-check" style="font-size: 1.3rem;">
                                    <input type="checkbox" class="form-check-input fw-bold" :id="`permission-${permission.id}`" :checked="hasPermission(permission.id)" @change="togglePermission(permission.id)" style="font-size: 1.3rem;">
                                     <label for="form-check-label" :for="`permission-${permission.id}`"><h6 class="text-dark">{{ permission.action }}</h6></label>
                                </div>
                            </div>
                        </div>
                     </div>

                </div>
            </div>
        </div>

        <!-- ACTION -->
         <div class="d-flex align-items-center justify-content-end gap-2 mt-4">
            <button type="button" class="btn btn-secondary" :disabled="loading" @click="cancelEdit">Batal</button>
            <button type="button" class="btn btn-primary" :disabled="loading" @click="saveData">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                {{ loading ? 'Menyimpan...': 'Simpan Perubahan' }}
            </button>
         </div>

    </div>
</template>