new Vue({
    el: '#app',
    
    data() {
        return {
            stok: dummyData.stok,
            
            form: {
                nama: '',
                nim: '',
                pilihanBahanAjar: '',
                jumlah: 1
            },
            
            pesanSukses: ''
        }
    },

    computed: {
        totalHarga() {
            if (!this.form.pilihanBahanAjar) {
                return 0;
            }
            return this.form.pilihanBahanAjar.harga * (this.form.jumlah || 0);
        }
    },

    watch: {
        'form.jumlah': function(nilaiBaru, nilaiLama) {
            
            if (this.form.pilihanBahanAjar && nilaiBaru !== '') {
                let batasMaksimal = this.form.pilihanBahanAjar.qty;
                
                if (nilaiBaru > batasMaksimal) {
                    this.form.jumlah = batasMaksimal;
                }
                
                if (nilaiBaru < 1) {
                    this.form.jumlah = 1;
                }
            }
        },
        
        'form.pilihanBahanAjar': function() {
            this.form.jumlah = 1;
        }
    },

    methods: {
        toRupiah(angka) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
        },

        submitPesanan() {
            if (!this.form.pilihanBahanAjar) {
                alert("Silakan pilih bahan ajar terlebih dahulu!");
                return;
            }

            this.pesanSukses = `Pesanan atas nama ${this.form.nama} (${this.form.nim}) untuk buku ${this.form.pilihanBahanAjar.judul} sebanyak ${this.form.jumlah} eksemplar berhasil dibuat!`;

            this.form.nama = '';
            this.form.nim = '';
            this.form.pilihanBahanAjar = '';
            this.form.jumlah = 1;

            setTimeout(() => {
                this.pesanSukses = '';
            }, 5000);
        }
    }
});
