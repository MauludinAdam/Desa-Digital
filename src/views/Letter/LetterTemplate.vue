<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { detailLetter } from '@/services/LetterService';
import logoDesa from '@/assets/images/logo-surat.png';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const data = ref(null);

const letterDocument = ref(null);
defineExpose({
    letterDocument
})

const getData = async () => {
    try {
        loading.value = true;

        const response = await detailLetter(route.params.id);

        console.log(response.data);

        data.value = response.data.data;
    } catch (error) {
        console.log(error);
    }finally{
        loading.value = false;
    }
};

// FORMAT DATA
const formatDate = (date) => {
    if(!date){
        return '-';
    }

    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
};

const formatDateTime = (date) => {
    if(!date) {
        return '-';
    }

    const options = {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    return new Intl.DateTimeFormat('id-ID', options).format(new Date(date));

}

// FORMAT GENDER
const formatGender = (gender) => {
    if(gender === 'male') {
        return 'Laki-Laki';
    }

    if(gender === 'female'){
        return 'Perempuan';
    }

    return '-';
}

const goBack = () => {
    router.back();
};

const downloadLetter = () => {
    console.log('Download surat:', data.value?.id);
};

onMounted(() => {
    getData();
})

</script>


<template>
    <div class="container-fluit bg-light min-vh-100 py-4">
        <div class="container mb-4">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="fw-bold mb-1">Priview Surat</h5>
                    <small class="text-muted">Pretinjau Dokumen Surat</small>
                </div>
                <div class="d-flex gap-1">
                    <button @click="goBack" class="btn btn-outline-secondary"><i class="fas fa-arrow-left"></i> Kembali</button>
                    <button @click="downloadLetter" class="btn btn-outline-primary"><i class="fas fa-download"></i> Download</button>
                </div>
            </div>
        </div>

        <div v-if="loading" class="container">
            <div class="card border-0 shadow-sm">
                <div class="card-body text-center py-5">

                    <div class="spinner-border text-primary mb-3" role="status">
                    </div>
                    <div class="text-muted">
                        Memuat surat...
                    </div>

                </div>
            </div>
        </div>
        
        <div v-else-if="data" class="letter-document" ref="letterDocument">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-5">
                    <!-- KOP SURAT -->
                     <div class="row align-items-center">
                        <div class="col-2 text-center">
                            <div class=" rounded-circle mx-auto d-flex align-items-center justify-content-center" style="width: 85px; height: 85px;">
                                <img :src="logoDesa" alt="Logo Desa" width="180" height="190" class="img-fluit">
                            </div>
                        </div>

                        <!-- IDENTITAS PEMERINTAH -->
                         <div class="col-10 text-center">
                            <div class="fw-semibold fs-5">
                                PEMERINTAH KABUPATEN FLORES TIMUR
                            </div>
                            <div class="fw-bold fs-4">
                                KECAMATAN SOLOR TIMUR
                            </div>
                            <div class="fw-bold fs-3">
                                DESA LEWOGEKA
                            </div>
                            <div class="small">
                                Alamat: Jl.Jatimakmur, Kel.Jatimakmur NO 99
                            </div>
                            <div class="small">
                                Kecamatan Solor Timur, Kabupaten Flores Timur, Nusa Tenggara Timur
                            </div>
                         </div>
                     </div>
                     <hr class="border-dark border-2 opacity-100 mt-3">

                     <!-- JUDUL SURAT -->
                     <div class="text-center mt-4">
                        <div class="fw-bold text-decoration-underline fs-5">
                            Surat Pindah Penduduk
                        </div>
                        <div class="mt-1">
                            Nomor: {{ data?.letter_number ?? '-' }}
                        </div>
                     </div>

                     <div class="mt-5">
                        <p class="mb-4">
                            Yang bertanda tangan dibawah ini
                            menerangkan bahwa:
                        </p>

                        <!-- Data Warga -->
                         <table class="table-borderless table-sm mb-4">
                            <tbody>
                                <tr>
                                    <td style="width: 200px;">Nama</td>
                                    <td style="width: 20px;">:</td>
                                    <td class="fw-semibold">{{ data?.citizen?.full_name }}</td>
                                </tr>
                                <tr>
                                    <td>NIK</td>
                                    <td>:</td>
                                    <td>{{ data?.citizen?.nik }}</td>
                                </tr>
                                <tr>
                                    <td>Tempat, Tanggal Lahir</td>
                                    <td>:</td>
                                    <td>{{ data?.citizen?.place_of_birth ?? '-' }}, {{ formatDate(data?.citizen?.date_of_birth) }}</td>
                                </tr>
                                <tr>
                                    <td>Jenis Kelamin</td>
                                    <td>:</td>
                                    <td>{{ formatGender(data?.citizen?.gender) }}</td>
                                </tr>
                                <tr>
                                    <td>Alamat</td>
                                    <td>:</td>
                                    <td>{{ data?.citizen?.address ?? '-' }}</td>
                                </tr>
                            </tbody>
                         </table>

                         <!-- ISI SURAT -->
                          <div class="mt-4">
                            <template v-if="data?.letter_type?.template === 'moving'">
                                <p class="text-justify">
                                    Yang bersangkutan benar merupakan peduduk Desa Lewogeka dan surat ini diterbitkan  untuk keperluan pindah penduduk.
                                </p>
                            </template>

                            <template v-else-if="data?.letter_type?.template === 'birth'">
                                <p class="text-justify">
                                    Yang bersangkutan telah melaporkan kelahiran seorang anak yang lahir di wilayah Desa Lewogeka
                                </p>
                            </template>

                            <template v-else-if="data?.letter_type?.template === 'poor'">
                                <p class="text-justify">
                                    Yang bersangkutan benar merupakan penduduk Desa Lewogeka dan berdasarkan keterangan yang diperoleh termasuk dalam keluarga kurang mampu.
                                </p>
                            </template>

                            <template v-else-if="data?.letter_type?.template ==='business'">
                                <p class="text-justify">
                                    Yang bersangukan bener merupakan penduduk Desa Lewogeka dan memiliki usah yang berada di wilayah Desa Lewogeka.
                                </p>
                            </template>

                            <!-- SURAT UNDANGAN -->
                             <template v-else-if="data?.letter_type?.template === 'invitation'">
                                <p class="text-justify">
                                    Dengan ini kami mengundang kepada {{ data?.citizen?.full_name }} untuk menghadir dalam kegiatan yang akan dilaksanakan oleh pemerintah Desa Lewogeka.
                                </p>
                                <span>Hari/Tanggal: {{ formatDate(data.created_at) }}</span><br>
                                <span>Waktu: {{ formatDateTime(data.created_at) }} </span><br>
                                <span>Tempat: Kantor Desa</span><br>
                             </template>

                             <!-- Surat Edaran -->
                              <template v-else-if="data?.letter_type?.template === 'circular'">
                                <p class="text-justify">
                                    Dalam rangka memberikan informasi kepada masyarakat Desa Lewogeka, bersama ini disampaikan edaran sebagaimana mesti nya.
                                </p>
                              </template>

                              <!-- Template belu tersedia -->
                               <template v-else>
                                <p class="text-muted">
                                    Isi surat untuk jenis ini belum tersedia.
                                </p>
                               </template>
                          </div>

                          <!-- Penutup -->
                           <p class="text-justify mt-4">
                            Demikian surat ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.
                           </p>
                     </div>

                     <!-- Tanda Tangan -->
                      <div class="row justify-content-end mt-5">
                        <div class="col-md-5 text-center">
                            <div class="">
                                <div>
                                Desa Lewogeka, {{ formatDate(data?.created_at) }}
                            </div>

                            <!-- Jabatan -->
                             <div class="mt-1">
                                Kepala Desa lewogeka
                             </div>
                            </div>

                             <!-- Spapsi Tanda Tangan -->
                              <div style="height: 100px;"></div>
                             
                              <div class="fw-bold text-decoration-underline">
                                Mauludin Adam
                              </div>
                        </div>
                      </div>

                </div>
            </div>
        </div>

        <!-- Data Tidak Ditemukan -->
         <div v-else class="container">
            <div class="alert alert-danger">
                Data surat tidak ditemukan
            </div>
         </div>
    </div>
</template>

<style scoped>
.letter-document{
    max-width: 210mm;
    max-height: 297mm;
    background: white;
    padding: 15mm 20mm;
    box-sizing: border-box;
    overflow: hidden;
}
</style>