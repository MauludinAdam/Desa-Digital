<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { toast } from '@/utils/swal';
import { createRole, deleteRole, getRoles } from '@/services/RolesService';

const router = useRouter();

const loading = ref(false)
const errors = ref({});
const message = ref('');

const roles = ref([]);

const getData = async () => {
    loading.value = true;
    errors.value = {};

    try {
        const response = await getRoles();

        console.log(response.data);

        roles.value = response.data.data;

    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

const ShowModal = ref(false);

const openModal = async () => {
    loading.value = false;

    form.value = {
        name: ''
    }

    errors.value = {};

    ShowModal.value = true;
}

const closeModal = async() => {
    ShowModal.value = false;
     form.value = {
        name: ''
     }

     errors.value = {};
}

const form = ref({
    name: ''
})

const saveData = async () => {
    message.value = ''
    errors.value = {};

    if(!form.value.name){
        errors.value.name = ["Nama harus diisi"];
    }

    if(Object.keys(errors.value).length > 0){
        return;
    }

    try {
        loading.value = true;

        const data = {
            name: form.value.name
        }

        console.log('Data Yang Dikirim', data);

        await createRole(data);

        closeModal();

        await getData();

        toast("success", "Data role berhasil ditambahkan");
    } catch (error) {
        console.log(error);

        if(error.response?.status === 422){
            errors.value = error.response.data.errors || {};
        }
    }finally{
        loading.value = false;
    }
}

const deleteData = async (id) => {
    const result = await Swal.fire({
        title: "Apakah Anda Yakin ?",
        text: 'Data yang sudah dihapus tidak dapat dikembalikan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
    });

    if(!result.isConfirmed) return;

    try {
        await deleteRole(id);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Data berhasil dihapus',
            showConfirmButton: false,
            timer: 3000,
        });

        getData();
    } catch (error) {
        
        Swal.fire({
            icon: 'error',
            title: 'Ooooppss....',
            text: 'Gagal menghapus data',
        });

        console.log(error);
    }
}


onMounted(() => {
    getData();
})

</script>

<template>
    <div class="container-fluit">
        <div class="card">
            <div class="card-header d-flex align-items-center justify-content-between">
                <div class="card-title">
                    <h5 class="fw-bold">Manajemen Role</h5>
                </div>
                <div class="card-tools">
                    <button @click="openModal" class="btn text-white" style="background:#2F4F4F;"><i class="fas fa-plus"></i> Tambah
                        Role</button>
                </div>
            </div>
            <div class="card-body">
                <table class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th width="5%">No</th>
                            <th>Role</th>
                            <th class="text-center">Guard</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="roles.length > 0" v-for="(item, index) in roles" :key="item.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.name }}</td>
                            <td class="text-center">{{ item.guard_name }}</td>
                            <td width="18%">
                                <RouterLink :to="{name: 'pengaturan-edit', params: {id: item.id}}" class="btn btn-warning btn-sm mx-1"><i class="fas fa-pen-square"></i></RouterLink>
                                <button @click="deleteData(item.id)" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                        <tr v-else-if="loading">
                            <td colspan="4" class="text-center py-4">
                                <p class="spinner-border text-secondary"></p>
                                <p class="text-muted">Sedang memuat...</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal add role and permission -->
    <Transition name="modal">
        <div v-if="ShowModal" class="modal" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Tambah Role</h5>
                        <button @click="closeModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveData">
                            <div class="form-group">
                                <label for="">Nama</label>
                                <input type="text" v-model="form.name" class="form-control" :class="{'is-invalid': errors.name}" placeholder="Masukkan Role User">
                                <small class="text-danger" v-if="errors.name">{{ errors.name[0] }}</small>
                            </div>
                            <div class="modal-footer">
                                <button @click="closeModal" type="button" class="btn btn-danger" data-bs-dismiss="modal">Batal</button>
                                <button type="submit" class="btn btn-primary">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
    <Transition class="backdrop">
        <div v-if="ShowModal" class="modal-backdrop fade show"></div>
    </Transition>
</template>