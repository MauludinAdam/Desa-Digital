<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { detailCitizen } from '@/services/citizenService';

const route = useRoute();

const data = ref([]);

const getData = async () => {
    const response = await detailCitizen(route.params.id);

    data.value = response.data.data;
};

onMounted(() => {
    getData();
});

</script>

<template>
    <div class="container-fluit">
        <div class="d-flex align-items-center justify-content-between">
            <h5 class="fw-bold">Detail Penduduk</h5>
            <div class="button d-flex gap-2">
                <RouterLink :to="{ name: 'master-data.citizen' }" class="btn btn-warning"><i
                        class="fas fa-arrow-left"></i>
                    Kembali</RouterLink>
                <RouterLink :to="{ name: 'master-data.citizen-edit', params: { id: data.id } }" class="btn btn-info"><i
                        class="fas fa-pen-square"></i> Edit</RouterLink>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-md-4">
                <div class="card bg-dark text-white p-4" style="height: 26rem;">
                    <div class="mt-5">
                        <div class="icon text-center mb-4">
                            <i class="fas fa-user fa-4x"></i>
                        </div>
                        <div class="mb-5">
                            <p class="text-center fw-bold">{{ data.full_name }}</p>
                            <table>
                                <tbody>
                                    <tr>
                                        <th width="50%">No.Telp</th>
                                        <td width="10%">:</td>
                                        <td>{{ data.phone_number }}</td>
                                    </tr>
                                    <tr>
                                        <th>EMail</th>
                                        <td>:</td>
                                        <td>{{ data.email }}</td>
                                    </tr>
                                    <tr>
                                        <th>Status</th>
                                        <td>:</td>
                                        <td>
                                            <span class="badge" :class="data.status === 'active' ? 'bg-success' : 'bg-danger'">{{ data.status }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- <span>No.Telp : {{ data.phone_number }}</span><br>
                            <span>Email : {{ data.email }}</span><br>
                            <span>Status : <span class="badge"
                                    :class="data.status === 'active' ? 'bg-success' : 'bg-secondary'">{{ data.status
                                    }}</span></span> -->
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card">
                    <h4 class="text-center mt-3">Informasi Identitas</h4>
                    <hr>
                    <table class="table">
                        <tbody>
                            <tr>
                                <th>Nama</th>
                                <td>:</td>
                                <td>{{ data.full_name }}</td>
                            </tr>
                            <tr>
                                <th>NIK</th>
                                <td>:</td>
                                <td>{{ data.nik }}</td>
                            </tr>

                            <tr>
                                <th>Jenis Kelamin.</th>
                                <td>:</td>
                                <td>{{ data.gender ? 'Laki-Laki' : 'Perempuan' }}</td>
                            </tr>
                            <tr>
                                <th>Tempat Lahir</th>
                                <td>:</td>
                                <td>{{ data.place_of_birth }}</td>
                            </tr>
                            <tr>
                                <th>Tanggal lahir</th>
                                <td>:</td>
                                <td>{{ data.date_of_birth }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-md-12">
            <div class="card p-4">
                <h4>Informasi Kependudukan</h4><hr/>
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th width="20%">Pekerjaan</th>
                                    <td width="8%">:</td>
                                    <td>{{ data.occupation?.name }}</td>
                                </tr>
                                <tr>
                                    <th>Pendidikan</th>
                                    <td>:</td>
                                    <td>{{ data.education?.name }}</td>
                                </tr>
                                <tr>
                                    <th>Agama</th>
                                    <td>:</td>
                                    <td>{{ data.religion }}</td>
                                </tr>
                                <tr>
                                    <th>Status Kawin</th>
                                    <td>:</td>
                                    <td>{{ data.marital_status ? 'Laki-Laki' : 'Perempuan' }}</td>
                                </tr>
                                <tr>
                                    <th>Golongan Darah</th>
                                    <td>:</td>
                                    <td>{{ data.blood_type }}</td>
                                </tr>
                                <tr>
                                    <th>Kewarganegaraan</th>
                                    <td>:</td>
                                    <td>{{ data.nationality }}</td>
                                </tr>
                            </tbody>
                        </table>
            </div>
        </div>
        <!-- <div class="card">
            <div class="card-header d-flex justify-content-between">
                <div class="card-title"><h5>Detail Penduduk</h5></div>
                <div class="card-tools d-flex gap-1">
                    <RouterLink :to="{name: 'master-data.citizen'}" class="btn btn-warning"><i class="fas fa-arrow-left"></i> Kembali</RouterLink>
                    <RouterLink :to="{name: 'master-data.citizen-edit', params: {id:data.id}}" class="btn btn-info"><i class="fas fa-pen-square"></i> Edit</RouterLink>
                </div>
            </div>
            <div class="card-body">
                <div class="row p-2">
                    <div class="col-lg-4  p-4">
                        <div class="mt-5">
                            <div class="icon text-center mb-4">
                                <i class="fas fa-user fa-4x"></i>
                            </div>
                            <div class="content text-center">
                                <p class="text-center fw-bold">{{ data.full_name }}</p>
                                <span>No.Telp : {{ data.phone_number }}</span><br>
                                <span>Email : {{ data.email }}</span><br>
                               <span>Status : <span class="badge" :class="data.status === 'active' ? 'bg-success' : 'bg-secondary'">{{ data.status }}</span></span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8 border p-4">
                        <h4 class="text-center">Informasi Identitas</h4><hr>
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th>Nama</th>
                                    <td>:</td>
                                    <td>{{ data.full_name }}</td>
                                </tr>
                                <tr>
                                    <th>NIK</th>
                                    <td>:</td>
                                    <td>{{ data.nik }}</td>
                                </tr>
                                
                                <tr>
                                    <th>Jenis Kelamin.</th>
                                    <td>:</td>
                                    <td>{{ data.gender ? 'Laki-Laki' : 'Perempuan' }}</td>
                                </tr>
                                <tr>
                                    <th>Tempat Lahir</th>
                                    <td>:</td>
                                    <td>{{data.place_of_birth}}</td>
                                </tr>
                                <tr>
                                    <th>Tanggal lahir</th>
                                    <td>:</td>
                                    <td>{{ data.date_of_birth }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="col-lg-12 border p-4 mt-2">
                        <h4>Informasi Kependudukan</h4><hr/>
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th width="50%">Pekerjaan</th>
                                    <td>:</td>
                                    <td>{{ data.occupation?.name }}</td>
                                </tr>
                                <tr>
                                    <th>Pendidikan</th>
                                    <td>:</td>
                                    <td>{{ data.education?.name }}</td>
                                </tr>
                                <tr>
                                    <th>Agama</th>
                                    <td>:</td>
                                    <td>{{ data.religion }}</td>
                                </tr>
                                <tr>
                                    <th>Status Kawin</th>
                                    <td>:</td>
                                    <td>{{ data.marital_status ? 'Laki-Laki' : 'Perempuan' }}</td>
                                </tr>
                                <tr>
                                    <th>Golongan Darah</th>
                                    <td>:</td>
                                    <td>{{ data.blood_type }}</td>
                                </tr>
                                <tr>
                                    <th>Kewarganegaraan</th>
                                    <td>:</td>
                                    <td>{{ data.nationality }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>