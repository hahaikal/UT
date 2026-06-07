Vue.component('stock-table', {
    template: `
        <div>
            <h2>Data Stok Bahan Ajar</h2>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4>Filter & Tambah Data</h4>
                <div class="flex-row">
                    <div class="form-group">
                        <label>Filter UT-Daerah:</label>
                        <select v-model="filterUpbjj" class="form-control">
                            <option value="">Semua Daerah</option>
                            <option v-for="upbjj in upbjjList" :key="upbjj" :value="upbjj">{{ upbjj }}</option>
                        </select>
                    </div>
                    
                    <div class="form-group" v-if="filterUpbjj">
                        <label>Filter Kategori (Dependent):</label>
                        <select v-model="filterKategori" class="form-control">
                            <option value="">Semua Kategori</option>
                            <option v-for="kat in kategoriList" :key="kat" :value="kat">{{ kat }}</option>
                        </select>
                    </div>

                    <div class="form-group" style="display: flex; align-items: flex-end; gap: 10px;">
                        <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                            <input type="checkbox" v-model="filterWarningOnly">
                            Tampilkan Peringatan Stok Saja
                        </label>
                        <button class="btn btn-secondary" @click="resetFilters" style="margin-left: 10px;">Reset Filter</button>
                    </div>
                </div>

                <div style="margin-top: 15px; border-top: 1px solid #dee2e6; padding-top: 15px;">
                    <h5>Tambah Data Cepat (Tekan Enter di input mana saja untuk simpan)</h5>
                    <div class="flex-row">
                        <div class="form-group"><input type="text" v-model="newData.kode" placeholder="Kode" class="form-control" @keyup.enter="addData"></div>
                        <div class="form-group"><input type="text" v-model="newData.judul" placeholder="Judul" class="form-control" @keyup.enter="addData"></div>
                        <div class="form-group">
                            <select v-model="newData.kategori" class="form-control" @keyup.enter="addData">
                                <option value="" disabled>Pilih Kategori</option>
                                <option v-for="kat in kategoriList" :value="kat">{{ kat }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <select v-model="newData.upbjj" class="form-control" @keyup.enter="addData">
                                <option value="" disabled>Pilih UT-Daerah</option>
                                <option v-for="upbjj in upbjjList" :value="upbjj">{{ upbjj }}</option>
                            </select>
                        </div>
                        <div class="form-group"><input type="number" v-model.number="newData.harga" placeholder="Harga" class="form-control" @keyup.enter="addData"></div>
                        <div class="form-group"><input type="number" v-model.number="newData.qty" placeholder="Qty" class="form-control" @keyup.enter="addData"></div>
                        <div class="form-group"><input type="number" v-model.number="newData.safety" placeholder="Safety" class="form-control" @keyup.enter="addData"></div>
                        <div class="form-group"><button class="btn btn-primary" @click="addData">Tambah</button></div>
                    </div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Kode</th>
                        <th @click="sortBy('judul')">Judul <span v-if="sortKey === 'judul'">{{ sortAsc ? '↑' : '↓' }}</span></th>
                        <th>Kategori</th>
                        <th>UT-Daerah</th>
                        <th>Lokasi Rak</th>
                        <th @click="sortBy('harga')">Harga <span v-if="sortKey === 'harga'">{{ sortAsc ? '↑' : '↓' }}</span></th>
                        <th @click="sortBy('qty')">Stok <span v-if="sortKey === 'qty'">{{ sortAsc ? '↑' : '↓' }}</span></th>
                        <th>Stok Safety</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="filteredAndSortedStok.length === 0">
                        <td colspan="10" style="text-align: center;">Tidak ada data ditemukan</td>
                    </tr>
                    <tr v-for="item in filteredAndSortedStok" :key="item.kode">
                        <td>{{ item.kode }}</td>
                        <td>{{ item.judul }}</td>
                        <td>{{ item.kategori }}</td>
                        <td>{{ item.upbjj }}</td>
                        <td>{{ item.lokasiRak || '-' }}</td>
                        <td>{{ item.harga | currency }}</td>
                        <td>{{ item.qty | qtyFormat }}</td>
                        <td>{{ item.safety | qtyFormat }}</td>
                        <td>
                            <status-badge 
                                :qty="item.qty" 
                                :safety="item.safety" 
                                :catatanHTML="item.catatanHTML">
                            </status-badge>
                        </td>
                        <td>
                            <button class="btn btn-warning" style="font-size: 0.8em; padding: 4px 8px;" @click="openEditModal(item)">Edit</button>
                            <button class="btn btn-danger" style="font-size: 0.8em; padding: 4px 8px;" @click="deleteData(item.kode)">Hapus</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Edit Modal -->
            <app-modal :show="showModal" @close="showModal = false">
                <template #header>
                    <h3>Edit Data Stok</h3>
                </template>
                <template #body>
                    <div v-if="editData">
                        <div class="form-group">
                            <label>Kode (Readonly)</label>
                            <input type="text" v-model="editData.kode" class="form-control" readonly>
                        </div>
                        <div class="form-group">
                            <label>Judul</label>
                            <input type="text" v-model="editData.judul" class="form-control" @keyup.enter="saveEdit">
                        </div>
                        <div class="form-group">
                            <label>Harga</label>
                            <input type="number" v-model.number="editData.harga" class="form-control" @keyup.enter="saveEdit">
                        </div>
                        <div class="flex-row">
                            <div class="form-group">
                                <label>Qty</label>
                                <input type="number" v-model.number="editData.qty" class="form-control" @keyup.enter="saveEdit">
                            </div>
                            <div class="form-group">
                                <label>Safety</label>
                                <input type="number" v-model.number="editData.safety" class="form-control" @keyup.enter="saveEdit">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Catatan HTML</label>
                            <input type="text" v-model="editData.catatanHTML" class="form-control" @keyup.enter="saveEdit">
                        </div>
                    </div>
                </template>
                <template #footer>
                    <button class="btn" @click="showModal = false">Batal</button>
                    <button class="btn btn-primary" @click="saveEdit">Simpan (Enter)</button>
                </template>
            </app-modal>

        </div>
    `,
    props: {
        stok: {
            type: Array,
            required: true
        },
        upbjjList: {
            type: Array,
            required: true
        },
        kategoriList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            filterUpbjj: '',
            filterKategori: '',
            filterWarningOnly: false,
            sortKey: '',
            sortAsc: true,
            newData: {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: null,
                qty: null,
                safety: null,
                catatanHTML: ''
            },
            showModal: false,
            editData: null
        };
    },
    watch: {
        filterUpbjj(newVal) {
            if (!newVal) {
                this.filterKategori = '';
            }
        }
    },
    computed: {
        filteredAndSortedStok() {
            let result = this.stok;

            if (this.filterUpbjj) {
                result = result.filter(item => item.upbjj === this.filterUpbjj);
                if (this.filterKategori) {
                    result = result.filter(item => item.kategori === this.filterKategori);
                }
            }

            if (this.filterWarningOnly) {
                result = result.filter(item => item.qty < item.safety || item.qty === 0);
            }

            if (this.sortKey) {
                result = result.slice().sort((a, b) => {
                    let valA = a[this.sortKey];
                    let valB = b[this.sortKey];
                    
                    if (typeof valA === 'string') valA = valA.toLowerCase();
                    if (typeof valB === 'string') valB = valB.toLowerCase();

                    if (valA < valB) return this.sortAsc ? -1 : 1;
                    if (valA > valB) return this.sortAsc ? 1 : -1;
                    return 0;
                });
            }

            return result;
        }
    },
    methods: {
        sortBy(key) {
            if (this.sortKey === key) {
                this.sortAsc = !this.sortAsc;
            } else {
                this.sortKey = key;
                this.sortAsc = true;
            }
        },
        resetFilters() {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.filterWarningOnly = false;
            this.sortKey = '';
        },
        addData() {
            if (!this.newData.kode || !this.newData.judul || !this.newData.kategori || !this.newData.upbjj) {
                alert('Mohon lengkapi data (Kode, Judul, Kategori, UPBJJ) sebelum menambah.');
                return;
            }
            this.$emit('add-stok', { ...this.newData });
            
            this.newData = {
                kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: null, qty: null, safety: null, catatanHTML: ''
            };
        },
        deleteData(kode) {
            if (confirm(`Apakah Anda yakin ingin menghapus data dengan kode ${kode}?`)) {
                this.$emit('delete-stok', kode);
            }
        },
        openEditModal(item) {
            this.editData = { ...item };
            this.showModal = true;
        },
        saveEdit() {
            if (this.editData) {
                this.$emit('update-stok', this.editData);
                this.showModal = false;
                this.editData = null;
            }
        }
    }
});