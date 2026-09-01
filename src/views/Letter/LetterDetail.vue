<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute , useRouter} from 'vue-router';
import { detailLetter, approvedLetter, rejectedLetter } from '@/services/LetterService';
import Swal from 'sweetalert2';
import html2pdf from 'html2pdf.js';
import LetterTemplate from './LetterTemplate.vue';
import { getLetterAttachman, createLetterAttachman, deleteLetterAttachman } from '@/services/LetterAttachman.js';
import { useAuth } from '@/helpers/auth';

const { fetchUser, isAdmin, isHeadman } = useAuth();


const route = useRoute();

const data = ref({});

const loading = ref(false);
const errors = ref({});
const message = ref("");

const user = ref([]);

const processing = ref(false);

const letterTemplate = ref(null);
const letterDocument = ref(null);

const printLetter = async () =>{

    if(!data.value?.id){
        return;
    }

    if(!letterTemplate.value) {
         console.log('Data surat belum tersedia');
        return;
    }

    const element = letterTemplate.value.letterDocument;
    if(!element){
        console.error('Element surat tidak ditemukan');
        return;
    }

    const options = {
        margin: 0,
        filename: `Surat-${data.value?.letter_number ?? 'Dokumen'}.pdf`,
        image: {
            type: 'jpeg',
            quality: 0.98
        },

        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            scrollX: 0,

        },

        jsPDF:{
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    try {
        await html2pdf()
        .set(options)
        .from(element)
        .save();

        console.log('PDF berhasil dibuat')
    } catch (error) {
        console.log('Gagal membuat PDF:', error);   
    }
    
}

const getData = async () => {
    try {
        const response = await detailLetter(route.params.id);

        console.log(response.data);

        data.value = response.data.data;


    } catch (error) {
        console.log(error);

        Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Data surat gagal diambil"
        });
    }finally{
        loading.value = false;
    }
};

const getUser = () => {
    const userData = localStorage.getItem('user');
    if(!userData){
        return;
    }

    try {
        user.value = JSON.parse(userData);
    } catch (error) {
        console.log('Gagal membaca data user:', error);
    }
};

// STATUS
const isPending = computed(() => {
    return data.value?.status === 'pending'
});

const isApproved = computed(() => {
    return data.value.status === 'approved'
});

const isRejected = computed(() => {
    return data.value?.status === 'rejected'
});


// FORMAT DATE
const formDate = (date) => {
    if(!date){
        return '-'
    }

    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};


// FORMAT DATETIME
const formatDateTime = (date) => {
    if(!date){
        return '-';
    }

    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};


// APPROVE SURAT
const handleApprove = async () => {

    const result = await Swal.fire({
        title: "Setujui Surat?",
        text: "Surat yang disetujui akan diproses lebih lanjut",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, Setujui",
        cancelButtonText: "Batal",
        reverseButtons: true,
    });

    if(!result.isConfirmed){
        return;
    }

    processing.value = true;

    try {
        const response = await approvedLetter(data.value.id);

        console.log(response.data);

        await Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Surat berhasil disetujui",
            timer: 1500,
            showConfirmButton: false,
        });

        await getData();

    } catch (error) {
        console.log(error);

        Swal.fire({
            icon: "error",
            title: "Gagal",
            text: error.response?.data?.message || 'Surat gagal disetujui',
        });
    }finally{
        processing.value = false;
    }
};


// REJECT SURAT
const handleReject = async () => {
    const result = await Swal.fire({
        title: "Tolak Surat?",
        input: "textarea",
        inputLabel: "Alasan Penolakan",
        inputPlaceholder: "Masukkan alasan penolakan...",
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
                return 'Alasan penolakan wajib diisi.';
            }
        }
    });

    if(!result.isConfirmed){
        return;
    }

    processing.value = true;

    try {
        const response = await rejectedLetter(data.value.id,{
            rejection_reason: result.value
        });

        console.log(response.data)

        await Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Surat berhasil ditolak',
            timer: 1500,
            showConfirmButton: false,
        });

        await getData();

    } catch (error) {
        console.log(error)

        Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: error.response?.data?.message || 'Surat gagal ditolak.'
        });
    }finally{
        processing.value = false;
    }
}

const goBack = () => {
    router.back();
};

// Modal Upload Document
const attachman = ref([]);

const uploading = ref(false);

const showModal = ref(false);

const form = ref({
    file: null,
    description: "",
});

const fetchAttachman = async () => {
    loading.value = true;

    try {
        const response = await getLetterAttachman();

        attachman.value = response.data.data.data ?? [];
    } catch (error) {
        console.log(error);

    }finally{
        loading.value = false;
    }
}

const openLetterAttachModal = async () => {
    form.value = {
        file: null,
        description: '',
    }

    errors.value = {};

    showModal.value = true;
}

const closeLetterAttachModal = () => {
    showModal.value = false;

    form.value = {
        file: null,
        description: '',
    };

    errors.value = {};
}

const handlFileChange = (event) => {
    form.value.file = event.target.files[0] ?? null;
};

const getFileName = (fileUrl) => {
    if(!fileUrl){
        return '-';
    }

    return fileUrl.split('/').pop();
}

// Upload File
const saveAttachman = async () => {
    errors.value = {};

    if(!form.value.file){
        errors.value.file = ["File harus diisi"];
    }

    if(!form.value.description){
        errors.value.description = ["Deskripsi harus diisi"];
    }

    if(Object.keys(errors.value).length > 0){
        return;
    }


    uploading.value = true;

    try {
        const formData = new FormData();

        formData.append('letter_id', route.params.id);
        formData.append('file', form.value.file);
        formData.append('description', form.value.description);

        console.log('FILE:', form.value.file);
        console.log('DESCRIPTION:', form.value.description);

        for (const [key, value] of formData.entries()){
            console.log(key, value);
        }

        await createLetterAttachman(formData);

        Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Lampiran berhasil diupload.",
            timer: 3000,
            showConfirmButton: false,
        });

        closeLetterAttachModal();

        await fetchAttachman();
    } catch (error) {
        console.log(error);

        if(error.response?.status === 422){
            errors.value = error.response.data?.errors ?? error.response.data?.errors ?? {};
        }
    }finally{
        uploading.value = false;
    }
}

const formatFileSize = (bytes) => {
    if(!bytes) return '0 KB';

    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const index = Math.floor(Math.log(bytes)/Math.log(1024));

    return (Math.round(bytes / Math.pow(1024, index) + ' ' + units[index]));
}

const deleteData = async (id) => {
    const result = await Swal.fire({
        title: "Apakah Anda Yakin ?",
        text: "Data yang dihapus tidak dapat dikembalikan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
    });

    if(!result.isConfirmed) return;

    try {
        await deleteLetterAttachman(id);

        attachman.value = attachman.value.filter(item => item.id !== id);
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
            title: 'Oooops....',
            text: 'Gagal menghapus data',
        });

        console.log(error);
    }
}

onMounted(() => {
    getData();
    getUser();
    fetchAttachman();
    fetchUser();
    getUser();
});

</script>

<template>
    <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="card">
            <div class="card-header d-flex justify-content-between">
                <div class="card-title"><h5>Detail Surat</h5></div>
                <div class="card-tools d-flex gap-2">
                    <button v-if="isApproved" type="button" class="btn btn-danger" @click="printLetter">
                        <i class="fas fa-print me-1"></i>
                        Cetak Surat
                    </button>
                    <RouterLink :to="{name: 'master-surat.surat'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                </div>
            </div>
            <div class="card-body">
                    <h5>Surat Keterangan Domisil</h5>
                <div class="row mt-4">
                    <div class="col-lg-6 border-end p-3">
                        <h4>INFORMASI SURAT</h4><hr>
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th>Nomor Surat</th>
                                    <td>:</td>
                                    <td>{{ data.letter_number }}</td>
                                </tr>
                                <tr>
                                    <th>Jenis Surat</th>
                                    <td>:</td>
                                    <td>{{ data.letter_type?.name }}</td>
                                </tr>
                                <tr>
                                    <th>Keperluan</th>
                                    <td>:</td>
                                    <td>{{ data.purpose }}</td>
                                </tr>
                                <tr>
                                    <th>Dibuat</th>
                                    <td>:</td>
                                    <td>{{ formDate(data.created_at) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="col-lg-6 p-3">
                        <h4>INFORMASI PEMOHON</h4><hr>
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th>Nama</th>
                                    <td>:</td>
                                    <td>{{ data.citizen?.full_name }}</td>
                                </tr>
                                <tr>
                                    <th>NIK</th>
                                    <td>:</td>
                                    <td>{{ data.citizen?.nik }}</td>
                                </tr>
                                <tr>
                                    <th>No.Telp</th>
                                    <td>:</td>
                                    <td>{{ data.citizen?.phone_number }}</td>
                                </tr>
                                <tr>
                                    <th>Alasan Tolak</th>
                                    <td>:</td>
                                    <td>{{ data.rejection_reason ? data.rejection_reason : '-' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div><hr>

             <!-- status surat -->
            <div class="border-0 p-4">
                <h4 class="fw-bold text-uppercase mb-4">Status surat</h4>

                <!-- TIME LINE -->
                <div class="d-flex align-items-center justify-content-center">

                    <!-- DIBUAT -->
                    <div class="text-center">
                        <div class="rounded-circle bg-success mx-auto d-flex align-items-center justify-content-center text-white" style="width: 22px; height: 22px;">
                            <i class="fas fa-check" :class="data.status === 'pending'" style="font-size: 14px;"></i>
                        </div>
                        <div class="mt-2 fw-semibold small">
                            dibuat
                        </div>
                    </div>
                    <div class="mx-2" :class="data.status === 'pending' ? 'bg-success' :'bg-secondary-subtle'" style="height: 3px; width: 180px;"></div>
               

                    <!-- PROSES -->
                    <div class="text-center">
                        <div class="rounded-circle bg-success mx-auto d-flex align-items-center justify-content-center text-white" style="width: 22px; height: 22px;">
                            <i class="fas fa-check" style="font-size: 14px;"></i>
                        </div>
                        <div class="mt-2fw-semibold small">Diproses</div>
                    </div>
                    <div class="mx-2" :class="{'bg-secondary-subtle' : data.status === 'pending', 'bg-success' : data.status === 'approved', 'bg-danger' : data.status === 'rejected'}" style="height: 3px; width: 180px;"></div>

                    <!-- DISETUJUI -->
                     <div class="text-center">
                        <div class="rounded-circle border border-2 bg-white mx-auto d-flex align-items-center justify-content-center" :class="{'bg-success text-white border-success' :data.status === 'approved', 'bg-danger text-white border-danger' :data.status === 'rejected', 'bg-white' :data.status === 'pending'}" style="width: 22px; height: 22px;">
                            <i v-if="data.status === 'approved'" class="fas fa-check"></i>    
                            <i v-if="data.status === 'rejected'" class="fas fa-times"></i>    
                            <span v-else style="width: 8px; height: 8px; border-radius: 50%; background-color: #6c757d;"></span> 
                        </div>
                        <div class="mt-2 text-muted small">
                            {{ data.status === 'approved' ? 'Disetujui' : data.status === 'rejected' ? 'Ditolak' : '' }}
                        </div>
                     </div>
                </div>

                <div class="mt-5">
                    <div class="text-muted small mb-2">
                        Status saat ini
                    </div>
                    <div class="fw-semibold">
                        {{ data.status === 'pending' ? 'menunggu Persetujuan ' : data.status === 'approved' ? 'Disetujui oleh kepala desa' : 'Ditolak oleh kepala desa' }} <br><br>

                        <span class="badge bg-warning rounded text-white p-2" v-if="isPending"><i class="fas fa-info-circle"></i> Menunggu Persetujuan</span>
                        <span class="badge bg-success rounded text-white p-2" v-else-if="isApproved"><i class="fas fa-check-circle"></i> Disetujui</span>
                        <span class="badge bg-danger rounded text-white p-2" v-else-if="isRejected"><i class="fas fa-times-circle"></i> Ditolak</span>
                    </div>
                </div>

                <div class="d-flex align-items-center justify-content-end gap-2 mt-4">

                    <button v-if="isHeadman && data.status ==='pending'" @click="handleApprove" type="button" class="btn btn-success" :disabled="processing"><i class="bi bi-check-lg me-1"></i>Approve</button>

                    <button v-if="isHeadman && data.status === 'pending'" @click="handleReject" class="btn btn-danger" :disabled="processing"><i class="fas fa-times"></i>Reject</button>

                </div>
            </div><hr>

            <!-- RIWAYAT SURAT -->
             <div class="row">
                <div class="col-lg-4 border-end">
                    <div class="border-0 mb-4 p-4 ">
                        <h5 class="fw-bold text-uppercase mb-4">Riwayat Surat</h5>
        
                        <!-- TIMELINE -->
                        <div class="position-relative d-flex">
        
                            <!-- Surat Dibuat -->
                             <div class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center flex-shrink-0"  style="width: 24px; height: 24px; z-index: 2;"><i class="fas fa-check" style="font-size: 14px;"></i></div>
                             
                             <!-- CONTENT -->
                              <div class="ms-3 pb-4 mx-3">
                                 <div class="fw-semibold">Surat Dibuat</div>
                                 <div class="text-mited small mt-1">
                                     {{ formatDateTime(data?.created_at) }}
                                 </div>
                                 <div class="text-muted small mt-1">
                                     Oleh Admin Desa
                                 </div>
                              </div>
             
                              <!-- CONECTOR -->
                               <div class="position-absolute bg-success"  style="width: 2px; height: 55px; left: 11px; top: 27px;"></div>
        
                            </div>
                            <!-- SURAT DIPROSES -->
                             <div class="d-flex position-relative">
        
                                 <div class="rounded-circle bg-success d-flex align-items-center justify-content-center text-white flex-shrink-0" style="width: 24px; height: 24px; z-index: 2;">
                                     <i class="fas fa-check" style="font-size: 14px;"></i>
                                 </div>
        
                                 <!-- CONTENT -->
                                  <div class="ms-3 pb-4">
                                    <div class="fw-semibold">
                                        Surat Diproses
                                    </div>
                                    <div class="text-muted small mt-1">
                                        {{ formatDateTime(data.created_at) }}
                                    </div>
                                    <div class="text-muted small mt-1">
                                        Oleh Admin Desa
                                    </div>
        
                                    <!-- CONECTOR -->
                                    <div class="position-absolute" :class="{'bg-success text-white': data.status === 'approved', 'bg-danger text-white': data.status === 'rejected', 'bg-secondary-subtle text-secondary': data.status === 'pending'}" style="width: 2px; height: 55px; left: 11px; top: 29px;">
                                        <i v-if="data.status === 'approved'" class="fas fa-check"></i>
                                        <i v-if="data.status === 'rejected'" class="fas fa-times"></i>
                                       <span v-else style="width: 8px; height: 8px; border-radius: 50%; background: currentColor;"></span>
                                    </div>
                                  </div>
        
                             </div>
        
                              <!-- MENUNGGU PERSETUJUAN -->
                               <div class="d-flex position-relative">
        
                                <div class="rounded-circle border border-2 d-flex justify-content-center align-items-center text-white flex-shrink-0" :class="{
                                    'bg-warning border-warning' :data.status === 'pending',
                                    'bg-success' :data.status === 'approved',
                                    'bg-danger border-danger'   :data.status === 'rejected'
                                    }" 
                                    style="width: 25px; height: 26px; z-index: 2;">
                                    <i v-if="data.status === 'approved'" class="fas fa-check" style="font-size: 14px;"></i>
                                    <i v-else-if="data.status === 'rejected'" class="fas fa-times" style="font-size: 14px;"></i>
                                </div>
        
                                <!-- CONTENT -->
                                 <div class="ms-3" v-if="data.status === 'pending'">
                                    <div class="fw-simebold text-muted">
                                        Menunggu Persetujuan
                                    </div>
                                    <div class="text-muted small mt-1">
                                        Kepala Desa
                                    </div>
                                 </div>

                                 <!-- Surat Disetujui -->
                                 <div class="ms-3" :class v-else-if="data.status === 'approved'">
                                    <div class="fw-simebold text-muted">
                                        Surat Disetujui
                                    </div>
                                    <div class="text-muted mt-1 small">
                                        {{ formatDateTime(data.approved_at) }}
                                    </div>
                                    <div class="text-muted small mt-1">
                                       Oleh Kepala Desa
                                    </div>
                                 </div>

                                 <div class="ms-3" v-else-if="data.status === 'rejected'">
                                    <div class="fw-simebold text-muted">
                                        Surat Ditolak
                                    </div>
                                    <div class="text-muted mt-1 small">
                                        {{ formatDateTime(data.approved_at) }}
                                    </div>
                                    <div class="text-muted small mt-1">
                                       Oleh Kepala Desa
                                    </div>
                                 </div>

                               </div>
        
                    </div>
                </div>
                <div class="col-lg-8">
                    <!-- LAMPIRAN -->
                 <div class="p-4">
                     <div class="d-flex align-items-center justify-content-between">
                        <h5 class="fw-bold text-uppercase mt-3">Lampiran</h5>
                        <button v-if="isAdmin" @click="openLetterAttachModal" class="btn btn-primary btn-sm"><i class="fas fa-upload"></i> Upload File</button>
                    </div><hr>
                    <div v-if="loading" class="text-center py-4">
                        <div class="spinner-border text-secodary" role="status"></div>
                    </div>

                    <div v-else-if="attachman.length === 0" class="text-center py-5 mt-5 text-muted">
                        <i class="fas fa-folder fa-3x"></i><br>
                        <span>Belum ada lampiran file</span>
                    </div>

                    <div v-else class="row g-3">
                        <div v-for="item in attachman" :key="item.id" class="d-flex align-items-center justify-content-between border-bottom py-3">
                            <div class="d-flex align-items-center">
                                <div class="rounded bg-danger bg-opacity-10 text-white d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                                    <i class="fas fa-file-pdf fs-5"></i>
                                </div>
                                <div>
                                    <div class="fw-semibold">
                                        {{ getFileName(item.file) }}
                                    </div>
                                    <small class="text-muted">
                                        {{ item.description }}
                                    </small>
                                    <small v-if="item.size" class="text-muted">{{ formatFileSize(item.size) }}</small>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end">
                                <a :href="item.file" target="_blank" class="btn btn-sm btn-outline-primary mx-1"><i class="fas fa-eye me-1"></i> Lihat</a>
                                <button v-if="isAdmin" @click="deleteData(item.id)" class="btn btn-outline-danger btn-sm"><i class="fas fa-trash"></i> Hapus</button>
                            </div>
                        </div>
                    </div>

                 </div>
                </div>

             </div>

        </div>
    </div>

    <div
    style="
        position: fixed;
        left: -99999px;
        top: 0;
        width: 210mm;
    "
>
    <LetterTemplate
        ref="letterTemplate"
        :data="data"
    />
</div>

<!-- Modal Upload Data -->
 <Transition name="modal">
<div v-if="showModal" class="modal" tabindex="-1" style="display: block;">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Upload Dokumen</h5>
        <button @click="closeLetterAttachModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="saveAttachman">
            <div class="form-group">
                <label for="">FIle</label>
                <input type="file" @change="handlFileChange" class="form-control" :class="{'is-invalid': errors.file}">
                <small class="text-danger" v-if="errors.fila">{{ errors.file[0] }}</small>
            </div>
            <div class="form-group">
                <label for="">Deskripsi</label>
                <input type="text" v-model="form.description" class="form-control" :class="{'is-invalid': errors.description}" placeholder="Masukkan deskripsi">
                <small class="text-danger" v-if="errors.description">{{ errors.description[0] }}</small>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary" :disabled="loading">{{ loading ? 'Proses upload...': 'Simpan' }}</button>
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

