Vue.filter('currency', function (value) {
    if (typeof value !== "number") {
        return value;
    }
    return 'Rp ' + value.toLocaleString('id-ID');
});

Vue.filter('qtyFormat', function (value) {
    if (value === undefined || value === null) return '';
    return value + ' buah';
});

Vue.filter('dateFormat', function (value) {
    if (!value) return '';
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    try {
        const parts = value.split('-');
        if(parts.length === 3) {
            const year = parts[0];
            const month = months[parseInt(parts[1], 10) - 1];
            const day = parseInt(parts[2], 10);
            return `${day} ${month} ${year}`;
        }
        return value;
    } catch(e) {
        return value;
    }
});


new Vue({
    el: '#app',
    data: {
        currentTab: 'stok',
        dataUtama: {
            upbjjList: [],
            kategoriList: [],
            pengirimanList: [],
            paket: [],
            stok: [],
            tracking: []
        },
        loading: true
    },
    computed: {
        nextDoNumber() {
            const currentYear = new Date().getFullYear();
            const prefix = `DO${currentYear}-`;
            
            if (!this.dataUtama.tracking || this.dataUtama.tracking.length === 0) {
                return `${prefix}001`;
            }

            const doThisYear = this.dataUtama.tracking.filter(t => t.nomorDO.startsWith(prefix));
            
            if (doThisYear.length === 0) {
                return `${prefix}001`;
            }

            let maxSeq = 0;
            doThisYear.forEach(t => {
                const parts = t.nomorDO.split('-');
                if (parts.length === 2) {
                    const seq = parseInt(parts[1], 10);
                    if (!isNaN(seq) && seq > maxSeq) {
                        maxSeq = seq;
                    }
                }
            });

            const nextSeq = maxSeq + 1;
            return `${prefix}${String(nextSeq).padStart(3, '0')}`;
        }
    },
    watch: {
        currentTab(newTab, oldTab) {
            console.log(`Berpindah dari tab ${oldTab} ke ${newTab}`);
        }
    },
    async created() {
        this.loading = true;
        const fetchedData = await ApiService.fetchData();
        
        this.dataUtama.upbjjList = fetchedData.upbjjList || [];
        this.dataUtama.kategoriList = fetchedData.kategoriList || [];
        this.dataUtama.pengirimanList = fetchedData.pengirimanList || [];
        this.dataUtama.paket = fetchedData.paket || [];
        this.dataUtama.stok = fetchedData.stok || [];
        this.dataUtama.tracking = fetchedData.tracking || [];
        
        this.loading = false;
    },
    methods: {
        handleAddStok(newData) {
            this.dataUtama.stok.push(newData);
        },
        handleUpdateStok(updatedData) {
            const index = this.dataUtama.stok.findIndex(item => item.kode === updatedData.kode);
            if (index !== -1) {
                this.$set(this.dataUtama.stok, index, updatedData);
            }
        },
        handleDeleteStok(kode) {
            this.dataUtama.stok = this.dataUtama.stok.filter(item => item.kode !== kode);
        },

        handleAddProgress(payload) {
            const trackingItem = this.dataUtama.tracking.find(t => t.nomorDO === payload.nomorDO);
            if (trackingItem) {
                if (!trackingItem.perjalanan) {
                    this.$set(trackingItem, 'perjalanan', []);
                }
                trackingItem.perjalanan.push({
                    waktu: payload.waktu,
                    keterangan: payload.keterangan
                });
            }
        },

        handleSubmitDo(newDoPayload) {
            this.dataUtama.tracking.push(newDoPayload);
        }
    }
});