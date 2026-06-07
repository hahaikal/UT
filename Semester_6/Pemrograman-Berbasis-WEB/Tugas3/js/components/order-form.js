Vue.component('order-form', {
    template: `
        <div>
            <h2>Form Input DO Baru (Pemesanan)</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #dee2e6; max-width: 800px;">
                <div class="flex-row">
                    <div class="form-group">
                        <label>Nomor DO (Auto-generate)</label>
                        <input type="text" v-model="formData.nomorDO" class="form-control" readonly style="background-color: #e9ecef;">
                    </div>
                    <div class="form-group">
                        <label>Tanggal Kirim (Otomatis Hari Ini)</label>
                        <input type="text" :value="formData.tanggalKirim | dateFormat" class="form-control" readonly style="background-color: #e9ecef;">
                    </div>
                </div>

                <div class="flex-row">
                    <div class="form-group">
                        <label>NIM</label>
                        <input type="text" v-model="formData.nim" class="form-control" placeholder="Masukkan NIM">
                    </div>
                    <div class="form-group">
                        <label>Nama</label>
                        <input type="text" v-model="formData.nama" class="form-control" placeholder="Masukkan Nama Mahasiswa">
                    </div>
                </div>

                <div class="flex-row">
                    <div class="form-group">
                        <label>Ekspedisi</label>
                        <select v-model="formData.ekspedisi" class="form-control">
                            <option value="" disabled>Pilih Ekspedisi</option>
                            <option v-for="eks in pengirimanList" :key="eks.kode" :value="eks.nama">{{ eks.nama }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Paket Bahan Ajar</label>
                        <select v-model="formData.paketKode" class="form-control">
                            <option value="" disabled>Pilih Paket</option>
                            <option v-for="pkt in paketList" :key="pkt.kode" :value="pkt.kode">{{ pkt.nama }}</option>
                        </select>
                    </div>
                </div>

                <!-- Menampilkan detail isi paket jika ada yang dipilih -->
                <div v-if="selectedPaketDetail" style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-bottom: 15px;">
                    <h5>Detail {{ selectedPaketDetail.nama }}</h5>
                    <ul style="margin: 5px 0 10px 0; padding-left: 20px;">
                        <li v-for="isi in selectedPaketDetail.isi" :key="isi">{{ isi }}</li>
                    </ul>
                    <div><strong>Total Harga Paket:</strong> {{ selectedPaketDetail.harga | currency }}</div>
                </div>

                <div style="margin-top: 20px;">
                    <button class="btn btn-success" @click="submitOrder" style="width: 100%; padding: 12px; font-size: 1.1em;">Simpan DO Baru</button>
                </div>
            </div>
        </div>
    `,
    props: {
        pengirimanList: {
            type: Array,
            required: true
        },
        paketList: {
            type: Array,
            required: true
        },
        nextDoNumber: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            formData: {
                nomorDO: '',
                nim: '',
                nama: '',
                ekspedisi: '',
                paketKode: '',
                tanggalKirim: ''
            }
        };
    },
    computed: {
        selectedPaketDetail() {
            if (!this.formData.paketKode) return null;
            return this.paketList.find(p => p.kode === this.formData.paketKode);
        }
    },
    watch: {
        nextDoNumber: {
            immediate: true,
            handler(newVal) {
                this.formData.nomorDO = newVal;
            }
        }
    },
    mounted() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        this.formData.tanggalKirim = `${year}-${month}-${day}`;
    },
    methods: {
        submitOrder() {
            if (!this.formData.nim || !this.formData.nama || !this.formData.ekspedisi || !this.formData.paketKode) {
                alert('Mohon lengkapi semua form sebelum menyimpan DO!');
                return;
            }

            const payload = {
                nomorDO: this.formData.nomorDO,
                nim: this.formData.nim,
                nama: this.formData.nama,
                status: 'Menunggu Penjemputan',
                ekspedisi: this.formData.ekspedisi,
                tanggalKirim: this.formData.tanggalKirim,
                paket: this.formData.paketKode,
                total: this.selectedPaketDetail ? this.selectedPaketDetail.harga : 0,
                perjalanan: [
                    {
                        waktu: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        keterangan: 'DO Dibuat: Menunggu Penjemputan Kurir'
                    }
                ]
            };

            this.$emit('submit-do', payload);

            this.formData.nim = '';
            this.formData.nama = '';
            this.formData.ekspedisi = '';
            this.formData.paketKode = '';
            alert('DO Berhasil disimpan!');
        }
    }
});