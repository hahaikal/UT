Vue.component('do-tracking', {
    template: `
        <div>
            <h2>Tracking Delivery Order</h2>
            <div class="form-group">
                <label>Pencarian Nomor DO atau NIM:</label>
                <input 
                    type="text" 
                    v-model="searchQuery" 
                    @keyup.enter="searchTracking" 
                    @keyup.esc="clearSearch"
                    placeholder="Ketik DO / NIM lalu tekan Enter... (Esc untuk reset)" 
                    class="form-control"
                    style="max-width: 500px;"
                >
                <small style="color: #6c757d; display:block; margin-top:5px;">* Tekan Enter untuk mencari, Esc untuk menghapus pencarian</small>
            </div>

            <div v-if="searchResult" style="margin-top: 30px; background: white; border: 1px solid #dee2e6; padding: 20px; border-radius: 8px;">
                <h3>Detail Pengiriman: {{ searchResult.nomorDO }}</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div><strong>NIM:</strong> {{ searchResult.nim }}</div>
                    <div><strong>Nama:</strong> {{ searchResult.nama }}</div>
                    <div><strong>Ekspedisi:</strong> {{ searchResult.ekspedisi }}</div>
                    <div><strong>Status:</strong> <span class="badge badge-success">{{ searchResult.status }}</span></div>
                    <div><strong>Tanggal Kirim:</strong> {{ searchResult.tanggalKirim | dateFormat }}</div>
                    <div><strong>Paket:</strong> {{ searchResult.paket }}</div>
                </div>

                <h4>Perjalanan Pengiriman</h4>
                <div class="timeline" v-if="searchResult.perjalanan && searchResult.perjalanan.length > 0">
                    <div class="timeline-item" v-for="(p, index) in searchResult.perjalanan" :key="index">
                        <div class="timeline-time">{{ p.waktu }}</div>
                        <div class="timeline-content">{{ p.keterangan }}</div>
                    </div>
                </div>
                <div v-else style="color: #6c757d; margin-bottom: 20px;">Belum ada data perjalanan.</div>

                <div style="margin-top: 25px; padding-top: 15px; border-top: 1px dashed #dee2e6;">
                    <h5>Tambah Progres Perjalanan</h5>
                    <div class="flex-row" style="align-items: flex-end;">
                        <div class="form-group" style="flex: 2;">
                            <label>Keterangan Progres:</label>
                            <input type="text" v-model="newProgress" class="form-control" placeholder="Contoh: Paket tiba di gudang sortir..." @keyup.enter="addProgress">
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <button class="btn btn-primary" @click="addProgress">Tambah Progres</button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="hasSearched && !searchResult" style="margin-top: 30px; padding: 20px; background-color: #f8d7da; color: #721c24; border-radius: 4px;">
                Data pengiriman tidak ditemukan untuk DO/NIM: <strong>{{ lastSearchQuery }}</strong>
            </div>

        </div>
    `,
    props: {
        trackingData: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            searchQuery: '',
            lastSearchQuery: '',
            searchResult: null,
            hasSearched: false,
            newProgress: ''
        };
    },
    methods: {
        searchTracking() {
            const query = this.searchQuery.trim().toLowerCase();
            this.lastSearchQuery = query;
            this.hasSearched = true;

            if (!query) {
                this.searchResult = null;
                return;
            }

            const result = this.trackingData.find(t => 
                t.nomorDO.toLowerCase() === query || 
                t.nim.toLowerCase() === query
            );

            this.searchResult = result || null;
            this.newProgress = '';
        },
        clearSearch() {
            this.searchQuery = '';
            this.lastSearchQuery = '';
            this.searchResult = null;
            this.hasSearched = false;
        },
        addProgress() {
            if (!this.newProgress.trim()) return;

            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            const waktuStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            this.$emit('add-progress', {
                nomorDO: this.searchResult.nomorDO,
                waktu: waktuStr,
                keterangan: this.newProgress
            });

            this.newProgress = '';
        }
    }
});