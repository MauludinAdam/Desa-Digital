<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { detailFamilyCard } from '@/services/FamilyCardService';
import { getCitizenOptions } from '@/services/citizenService';
import { createFamilyMember, updateFamilyMember, deleteFamilyMember } from '@/services/FamilyMemberService';
import Swal from 'sweetalert2';
import { toast } from '@/utils/swal';

const route = useRoute();

const data = ref([]);


const loading = ref(false);
const errorMessage = ref('');

const members = ref([]);


// menampilkan data KK
const getData = async () => {
    try {
        loading.value = true;
        errorMessage.value = '';

        const response = await detailFamilyCard(route.params.id);
        data.value = response.data.data;
    
        members.value = data.value.family_members ?? [];

    } catch (error) {
        console.log(error)
    }finally{
        loading.value = false;
    }
};

// model tambah anggota keluarga
const showModal = ref(false);

const editMemberId = ref(null);
const isEdit = ref(false);

const form = ref({
    citizen_id: "",
    relationship: "",
});

const citizens = ref([]);

const getCitizens = async () => {
    try {
        const response = await getCitizenOptions();

        citizens.value = response.data.data.data ?? [];
    } catch (error) {
        console.log(error);
    }
}

const selectedCitizen = ref(null);

const getSelectedCitizen = () => {
    selectedCitizen.value = citizens.value.find(
        citizen => citizen.id === form.value.citizen_id
    )

    console.log(selectedCitizen.value);
};

const saveMember = async () => {
    try {
        loading.value = true;

        const payload = {
            family_card_id: route.params.id,
            citizen_id: form.value.citizen_id,
            relationship: form.value.relationship
        };

        let response;

        if(isEdit.value){
            response = await updateFamilyMember(
                editMemberId.value, payload
            );
        }else{
            response = await createFamilyMember(payload);
        }

        showModal.value = false;

        console.log('RESPONSE:', response.data);

        // tutup modal
        showModal.value = false;

        // Reset form
        form.value = {
            citizen_id: '',
            relationship: '',
        };

        selectedCitizen.value = null;
        editMemberId.value = null;
        isEdit.value =false;

        // Refresh data anggota
        await getData();

        Swal.fire({
            toast:true,
            position: 'top-end',
            icon: 'success',
            title: 'Anggota berhasil ditambahkan',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });

    } catch (error) {
        console.log(error);
        console.log('EROR RESPONSE:', error.response?.data);
        if(error.response?.status === 422){
           Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: 'Data sudah terpakai',
            text: error.response?.data?.message || 'Data warga suda terdaftar sebagai anggota keluarga.',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
           });


           return;
        }
        
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: error.response?.data?.message ?? 'Gagal menambahkan anggota keluarga',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar:true,
        });
    }finally{
        loading.value = false;
    }
}

const deleteMember = async (id) => {
    const result = await Swal.fire({
        title: 'Hapus Anggota Keluarga?',
        text: 'Anggota keluarga dikeluarkan dari kartu keluarga.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        reverseButtons: true,
    });

    if(!result.isConfirmed){
        return;
    }

    try {

       const response = await deleteFamilyMember(id);

        console.log(response);

        toast("success","Anggota keluarga berhasil dihapus");

        await getData();

    } catch (error) {
        console.log(error);

        toast('error', error.response?.data?.message || 'Gagal menghapus anggota keluarga');
    }
}

const availableCitizens = computed(() => {
    const memberIds = members.value
    .filter(member => member.id !== editMemberId.value)
    .map(member => member.citizen_id);

    return citizens.value.filter(
        citizen => !memberIds.includes(citizen.id)
    );
});

const openMember = async () => {
    form.value = {
        citizen_id: '',
        relationship: '',
    };

    await getCitizens();

    showModal.value = true;
}

const closeMemberModal = () => {
    showModal.value = false;
}

const editMember = async (member) => {
    isEdit.value = true;
    editMemberId.value = member.id;

    form.value = {
        citizen_id: member.citizen_id,
        relationship: member.relationship
    };

    await getCitizens();

    selectedCitizen.value = citizens.value.find(
        citizen => citizen.id === member.citizen_id
    ) || null;

    console.log(member);

    showModal.value = true;
}


onMounted(() => {
    getData();
});

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header d-flex justify-content-between">
                <div class="card-title"><h5>Detail Kartu Keluarga</h5></div>
                <div class="card-tools">
                    <RouterLink :to="{name: 'master-data.family-card'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <h5 class="py-2 mx-4 fw-bold">INFORMASI KARTU KELUARGA:</h5>
                    <div class="col-md-6 border-end">
                <table class="table">
                    <tbody>
                        <tr>
                            <th>Nama</th>
                            <td>:</td>
                            <td width="100%">{{ data.head_of_family?.full_name }}</td>
                        </tr>
                        <tr>
                            <th>No.KK</th>
                            <td>:</td>
                            <td>{{ data.family_card_number }}</td>
                        </tr>
                        <tr>
                            <th>RT</th>
                            <td>:</td>
                            <td>{{ data.rt }}</td>
                        </tr>
                        <tr>
                            <th>RW</th>
                            <td>:</td>
                            <td>{{ data.rw }}</td>
                        </tr>
                        <tr>
                            <th>Dusun</th>
                            <td>:</td>
                            <td>{{ data.hamlet }}</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                <div class="col-md-6">
                    <table class="table" >
                        <tbody>
                            <tr>
                                <th width="20%">Desa</th>
                                <td>:</td>
                                <td width="100%">{{ data.village }}</td>
                            </tr>
                            <tr>
                                <th>Kecamatan</th>
                                <td>:</td>
                                <td>{{ data.district }}</td>
                            </tr>
                            <tr>
                                <th>Kabupaten</th>
                                <td>:</td>
                                <td>{{ data.regency }}</td>
                            </tr>
                            <tr>
                                <th>Provinsi</th>
                                <td>:</td>
                                <td>{{ data.province }}</td>
                            </tr>
                            <tr>
                                <th>Alamat</th>
                                <td>:</td>
                                <td>{{ data.address }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>    
             </div>
             <div class="info mt-3">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <h5 class="fw-bold">ANGGOTA KELUARGA:</h5>
                    <button @click="openMember" class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Tambah Data</button>
                </div>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>NIK</th>
                            <th>Gender</th>
                            <th>Hubungan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="members.length === 0">
                            <td colspan="6" class="text-center py-4">
                                <i class="fas fa-folder-closed"></i>
                                Belum ada anggota keluarga
                            </td>
                        </tr>
                        <tr v-for="(item, index) in members" :key="item.id">
                            <td width="5%">{{ index + 1 }}</td>
                            <td>{{ item.citizen?.full_name }}</td>
                            <td>{{ item.citizen?.nik }}</td>
                            <td>{{ item.citizen?.gender === 'male' ? 'Laki-Laki' : 'Perempuan' }}</td>
                            <td>{{ item.relationship === 'head_of_family' ? 'Kepala Keluarga' : item.relationship === 'wife' ? 'Istri' : item.relationship === 'child' ? 'Anak' : item.relationship === 'parent' ? 'Orang Tua' : item.relationship === 'other' ? 'lain-lain' : '' }}</td>
                            <td class="text-center">
                                <button type="button" class="btn btn-warning btn-sm" @click="editMember(item)"><i class="fas fa-pen-square"></i></button>
                                <button @click="deleteMember(item.id)" class="btn btn-danger btn-sm mx-1"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
             </div>
            </div>
        </div>
    </div>

    <!-- modal tambah anggota keluarga -->
     <Transition name = "modal">
        <div v-if="showModal" class="modal fade show" tabindex="-1" style="display: block;">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ isEdit ? 'Edit Anggota Keluarga' : 'Tambah Anggota Keluarga' }}</h5>
                    <button type="button" @click="closeMemberModal" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="saveMember">
                        <div class="form-group">
                            <label for="">Nama</label>
                            <select v-model="form.citizen_id" @change="getSelectedCitizen" class="form-select">
                                <option value="">--- Pilih Anggota ---</option>
                                <option v-for="citizen in availableCitizens" :value="citizen.id" :key="citizen.id">{{ citizen.full_name }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="">NIK</label>
                            <input type="text" class="form-control" :value="selectedCitizen?.nik ?? ''" readonly>
                        </div>
                        <div class="form-group">
                            <label for="">Hubungan</label>
                            <select v-model="form.relationship" class="form-select">
                                <option value="">--- Pilih Hubungan ---</option>
                                <option value="head_of_family">Kepala keluarga</option>
                                <option value="wife">Istri</option>
                                <option value="husband">Suami</option>
                                <option value="child">Anak</option>
                                <option value="parent">Orang Tua</option>
                                <option value="other">Lainnya</option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <button @click="closeMemberModal" type="button" class="btn btn-secondary" data-bs-dismiss="modal"><i class="fas fa-times"></i> Batal</button>
                            <button type="submit" class="btn btn-primary" :disabled="loading"><i :class="loading ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'"></i> {{ loading ? 'Proses menyimpan...' : isEdit  ? 'Update' : 'Simpan' }}</button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    </Transition>

     <Transition name="backdrop">
        <div v-if="showModal" class="modal-backdrop fade show"></div>
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

.backdrop-enter-active,
.backdrop-leave-active {
    transition: opacity 0.2s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-dialog,
.modal-leave-active .modal-dialog {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .modal-dialog,
.modal-leave-to .modal-dialog {
    transform: translateY(-20px);
    opacity: 0;
}


</style>