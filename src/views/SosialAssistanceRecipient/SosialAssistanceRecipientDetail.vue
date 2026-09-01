<script setup>
import { ref, onMounted, computed } from 'vue';
import { toast } from '@/utils/swal';
import { useRoute } from 'vue-router';
import { approvedSosialAsistanceRecipient, detailSosialAssistanceRecipient, rejectedSosialAssistanceRecipient } from '@/services/SosialAssitanceRecipient';
import { useAuth } from '@/helpers/auth';
import Swal from 'sweetalert2';
import { uploadTransferProof } from '@/services/SosialAssitanceRecipient';

const { fetchUser, isAdmin, isHeadman } = useAuth();

const route = useRoute();

const data = ref([]);
const processing = ref(false);

const transferProof = ref(null);
const uploadingProof = ref(false);

const showTransferModal = ref(false);

const showImagePreview = ref(false);
const previewImage = ref(null);

const openImagePreview = (image) => {
    previewImage.value = image;
    showImagePreview.value = true;
};

const closeImagePreview = () => {
    showImagePreview.value = false;
    previewImage.value = null;
}


// buka modal
const openTransferModal = () => {
    transferProof.value = null;
    showTransferModal.value = true;
}

// Tutup Modal
const closeTransferModal = () => {
    showTransferModal.value = false;
    transferProof.value = null;
}




const getData = async () => {
   const response = await detailSosialAssistanceRecipient(route.params.id);

   data.value = response.data.data;
};

// APPROVED PENERIMA BANTUAN
const handleApproved = async () => {
    const result = await Swal.fire({
        title: 'Setujui Penerima Bantuan ?',
        text: 'Penerima bantuan yang di setujui akan diproses lebih lanjut!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Setujui',
        cancelButtonText: 'Batal',
        reverseButtons: true,
    });

    if(!result.isConfirmed){
        return;
    }

    processing.value = true;

    try {
        const response = await approvedSosialAsistanceRecipient(data.value.id);

        console.log(response.data);

        await Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Penerima bantuan berhasil disetujui',
            timer: 1500,
            showConfirmButton: false,
        });

        await getData();

    } catch (error) {
        console.log(error);

        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: error.response?.data?.message || 'Penerima bantuan gagak disetujui',
        });
    }finally{
        processing.value = false;
    }
}

// REJECT PENERIMA BANTUAN
const handleRejected = async () => {
    const result = await Swal.fire({
        title: 'Tolak Penerima Bantuan?',
        input: 'textarea',
        inputLabel: 'Alasan Penolakan',
        inputPlaceholder: 'Masukkan alasan penolakan...',
        inputAttributes: {
            'aria-label': 'Alasan penolakan'
        },

        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Tolak',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        inputValidator: (value) => {
            if(!value || !value.trim()){
                return 'Alasan penolakan wajib diisi';
            }
        }
    });

    if(!result.isConfirmed){
        return;
    }

    processing.value = true;

    try {
        const response = await rejectSosialAssistanceRecipient(data.value.id, {
            rejection_reason: result.value
        });

        console.log(response.data);

        await Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Penerima bantuan berhasil ditolak',
            timer: 1500,
            showConfirmButton: false,
        });

        await getData();

    } catch (error) {
        console.log(error)

        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: error.response?.data?.message || 'Penerima bantuan gagal ditolak.',
        });
    }finally{
        processing.value = false;
    }
};

// status 
const isPending = computed(() => {
    return data.value?.status === 'pending'
});

const isApproved = computed(() => {
    return data.value?.status === 'approved'
});

const isRejected = computed(() => {
    return data.value?.status === 'rejected'
});

const handleTransferProofChange = (event) => {
    transferProof.value = event.target.files[0] ?? null;
};

const transferProofPreview = computed(() => {
    if(!transferProof.value){
        return null;
    }

    return URL.createObjectURL(transferProof.value);
});

const handleUploadTransferProof = async () => {
    if(!transferProof.value){
        Swal.fire({
            icon: 'warning',
            title: 'Bukti Transfer',
            text: 'Silahkan pilih bukti transfer terlebih dahulu.',
        });

        return;
    }

    uploadingProof.value = true;

    try {
        const formData = new FormData();
        formData.append('transfer_proof', transferProof.value);
        formData.append('_method','PUT');

        console.log(transferProof.value);

        const response = await uploadTransferProof(data.value.id, formData);

        console.log(response.data);

        await Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Bukti transfer berhasil diupload.',
            timer: 3000,
            showConfirmButton: false,
        });

        closeTransferModal();

        await getData();

    } catch (error) {
        console.log(error);

        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: error.response?.data?.message || 'Bukti transfer gagal diupload.'
        });
    }finally{
        uploadingProof.value = false;
    }
}


onMounted(() => {
    getData();
    fetchUser();
})

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header d-flex align-items-center justify-content-between">
                <div class="card-title">
                    <h5>Detail Penerima Bansos</h5>
                </div>
                <div class="card-tools">
                    <RouterLink :to="{name: 'master-sosial.penerima-bansos'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th width="40%">Penerima Bansos</th>
                                    <td width="10%">:</td>
                                    <td>{{ data.citizen?.full_name }}</td>
                                </tr>
                                <tr>
                                    <th>Bantuan Sosial</th>
                                    <td>:</td>
                                    <td>{{ data.sosialAssistance?.name }}</td>
                                </tr>
                                <tr>
                                    <th>Nama Bank</th>
                                    <td>:</td>
                                    <td>{{ data.bank }}</td>
                                </tr>
                                <tr>
                                    <th>Jumlah</th>
                                    <td>:</td>
                                    <td>Rp.{{ data.amount }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="col-md-6">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th width="35%">No.Rek</th>
                                    <td width="10%">:</td>
                                    <td>{{ data.account_number }}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>:</td>
                                    <td><span :class="data.status === 'pending' ? 'badge bg-warning' : data.status === 'approved' ? 'badge bg-success' : 'badge bg-danger'">{{ data.status }}</span></td>
                                </tr>
                                
                                <tr>
                                    <th>Alasan</th>
                                    <td>:</td>
                                    <td>{{ data.reason }}</td>
                                </tr>
                                <tr>
                                    <th width="21%">Alasan Menolak</th>
                                    <td>:</td>
                                    <td width="80%">{{ data.rejection_reason ? data.rejection_reason : '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="mt-3" v-if="data.transfer_proof">
                        <h4 class="fw-bold">Bukti Penyaluran Dana</h4>
                        <img :src="data.transfer_proof" class="border rounded" width="250" alt="" @click="openImagePreview(data.transfer_proof)" style="cursor: pointer;">
                    </div>
                    <div v-else-if="isApproved" class="text-muted">
                        Bukti penyaluran belum diupload
                    </div>

                    <div class="d-flex align-items-center justify-content-between">
                        <div class="mt-2 d-flex gap-1">
                            <button v-if="isHeadman && data.status === 'pending'" @click="handleApproved" class="btn btn-success" :disabled="processing"><i class="fas fa-check"></i> Approve</button>
                            <button v-if="isHeadman && data.status === 'pending'" @click="handleRejected" class="btn btn-danger" :disabled="processing"><i class="fas fa-times"></i> Reject</button>
                        </div>
                        <div v-if="isHeadman && isApproved && !data.transfer_proof" class="d-flex align-items-center justify-content-end gap-2 mt-2">
                            <button  type="button" class="btn btn-primary" @click="openTransferModal"><i class="fas fa-money-bill-wave"></i> Salurkan Bantuan</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Upload Butkti transfer -->
    <div
    v-if="showTransferModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background: rgba(0,0,0,.5);"
>
    <div class="modal-dialog modal-dialog-centered">

        <div class="modal-content">

            <!-- HEADER -->
            <div class="modal-header">

                <h5 class="modal-title fw-bold">
                    <i class="fas fa-money-bill-wave me-2"></i>
                    Salurkan Bantuan
                </h5>

                <button
                    type="button"
                    class="btn-close"
                    :disabled="uploadingProof"
                    @click="closeTransferModal"
                ></button>

            </div>

            <!-- BODY -->
            <div class="modal-body">

                <div class="mb-3">

                    <label class="form-label fw-semibold">
                        Bukti Transfer
                    </label>

                    <input
                        type="file"
                        class="form-control"
                        accept="image/*"
                        @change="handleTransferProofChange"
                    >

                    <small class="text-muted">
                        Format: JPG, JPEG, PNG, atau WEBP. Maksimal 2 MB.
                    </small>

                </div>

                <!-- PREVIEW -->
                <div
                    v-if="transferProof"
                    class="mt-3 text-center"
                >
                    <img
                        :src="transferProofPreview"
                        alt="Preview Bukti Transfer"
                        class="img-fluid rounded border"
                        style="max-height: 300px;"
                    >
                </div>

            </div>

            <!-- FOOTER -->
            <div class="modal-footer">

                <button
                    type="button"
                    class="btn btn-secondary"
                    :disabled="uploadingProof"
                    @click="closeTransferModal"
                >
                    Batal
                </button>

                <button
                    type="button"
                    class="btn btn-primary"
                    :disabled="uploadingProof"
                    @click="handleUploadTransferProof"
                >

                    <span
                        v-if="uploadingProof"
                        class="spinner-border spinner-border-sm me-1"
                    ></span>

                    <i
                        v-else
                        class="fas fa-upload me-1"
                    ></i>

                    {{
                        uploadingProof
                            ? 'Mengupload...'
                            : 'Upload Bukti'
                    }}

                </button>

            </div>

        </div>

    </div>
</div>

<!-- Modal Previe Image -->
 <div v-if="showImagePreview" class="image-preview-overlay" @click="closeImagePreview">
    <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-4" @click.stop="closeImagePreview"></button>

    <img :src="previewImage" alt="Preview Bukti Transfer" class="image-preview" @click.stop>
 </div>
</template>

<style scoped>
.image-preview-overlay{
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    display: flex;
    align-items: center;
    z-index: 9999;
    padding: 30px;
}

.image-preview{
    max-width: 90%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 0 30px rgba(0,0,0,0.5);;
}

</style>