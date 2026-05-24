new Vue({
    el: '#app',
    
    data() {
        return {
            nomorDO: '',
            databaseTracking: dummyData.tracking,
            hasilTracking: null,
            pesanError: ''
        }
    },

    watch: {
        'nomorDO': function(nilaiBaru, nilaiLama) {
            if (this.pesanError !== '') {
                this.pesanError = '';
            }
            
            if (nilaiBaru === '') {
                this.hasilTracking = null;
            }
        }
    },

    methods: {
        cariResi() {
            if (this.nomorDO.trim() === '') {
                this.pesanError = "Nomor DO tidak boleh kosong. Silakan masukkan nomor resi yang valid.";
                this.hasilTracking = null;
                return;
            }

            let dataDicari = this.databaseTracking[this.nomorDO];

            if (dataDicari) {
                this.hasilTracking = dataDicari;
                this.pesanError = '';
            } else {
                this.pesanError = `Nomor resi / DO "${this.nomorDO}" tidak ditemukan dalam sistem kami. Pastikan nomor sudah benar.`;
                this.hasilTracking = null;
            }
        },

        toRupiah(angka) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
        }
    }
});
