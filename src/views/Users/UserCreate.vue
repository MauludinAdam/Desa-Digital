<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from '@/utils/swal';
import { createUser } from '@/services/UserService';
import { getRoles } from '@/services/RolesService';

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const errors = ref({})
const message = ref("");

const roles = ref([]);

const form = ref({
    role_id: '',
    name: '',
    email: '',
    password: '',
    status: '',
})

const fetchRole = async () => {
    try {
        const response = await getRoles();

        roles.value = response.data.data;

    } catch (error) {
        console.log(error);
    }
}

const saveData = async () => {
    errors.value = {};
    message.value = "";

    if(!form.value.role_id){
        errors.value.role_id = ["Role harus diisi"];
    }

    if(!form.value.name){
        errors.value.name = ["Nama harus diisi"];
    }

    if(!form.value.email){
        errors.value.email = ["Email harus diisi"];
    }

    if(!form.value.password){
        errors.value.password = ["Password harus diisi"];
    }

    if(!form.value.status){
        errors.value.status = ["Status harus diisi"];
    }

    if(Object.keys(errors.value).length > 0){
        loading.value = false;
        return;
    }

    loading.value = true;

    try {
        const formData = new FormData();

        Object.keys(form.value).forEach((key) => {
            formData.append(key, form.value[key]);
        });

        for (let pair of formData.entries()){
            console.log(pair[0], pair[1]);
        }

        await createUser(formData);

        toast("success","Data User berhasil ditambahkan");

        router.push({
            name: 'user',
        });

    } catch (error) {
        if(error.response?.status === 422){
            errors.value = error.response?.data.errors || {};
        }
        console.log(error)
    }finally{
        loading.value = false;
    }
}

onMounted(() => {
    fetchRole();
})

</script>


<template>
    <div class="container-fluit">
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <h5 class="fw-bold">Tambah User Baru</h5>
                </div>
            </div>
            <div class="card-body">
                <form @submit.prevent="saveData">
                    <div class="form-group">
                        <label for="">Nama</label>
                        <input type="text" v-model="form.name" class="form-control" :class="{'is-invalid': errors.name}" placeholder="Masukkan Nama User">
                        <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Email</label>
                        <input type="email" v-model="form.email" class="form-control" :class="{'is-invalid' : errors.email}" placeholder="Masukkan Email User">
                        <small class="text-danger" v-if="errors.email">{{ errors.email[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Password</label>
                        <input type="password" v-model="form.password" class="form-control" :class="{'is-invalid': errors.password}" placeholder="Masukkan Password User">
                        <small class="text-danger" v-if="errors.password">{{ errors.password[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Role</label>
                        <select v-model="form.role_id" class="form-control" :class="{'is-invalid': errors.role_id}">
                            <option value="">--- Pilih ---</option>
                            <option v-for="role in roles" :value="role.id" :key="role.id">{{ role.name }}</option>
                        </select>
                        <small class="text-danger" v-if="errors.role_id">{{ errors.role_id[0] }}</small>
                    </div>
                    <div class="form-group">
                        <label for="">Status</label>
                        <select v-model="form.status" class="form-control" :class="{'is-invalid': errors.status}">
                            <option value="">--- Pilih ---</option>
                            <option value="active">Active</option>
                            <option value="non active">Non Active</option>
                        </select>
                        <small class="text-danger" v-if="errors.status">{{ errors.status[0] }}</small>
                    </div>
                    <div class="d-flex align-items-center gap-2 mt-3 mx-3">
                        <RouterLink :to="{name: 'user'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                        <button class="btn btn-primary" :disabled="loading"><i class="fas fa-paper-plane"></i> {{ loading ? 'Proses menyimpan...': 'Simpan' }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>