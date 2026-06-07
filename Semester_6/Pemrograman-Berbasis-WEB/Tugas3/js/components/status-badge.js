Vue.component('status-badge', {
    template: `
        <div class="tooltip-container">
            <span :class="['badge', badgeClass]">
                <span v-if="status === 'Aman'">&#10004;</span>
                <span v-if="status === 'Menipis'">&#9888;</span>
                <span v-if="status === 'Kosong'">&#10006;</span>
                {{ status }}
            </span>
            <div class="tooltiptext" v-if="catatanHTML" v-html="catatanHTML"></div>
        </div>
    `,
    props: {
        qty: {
            type: Number,
            required: true
        },
        safety: {
            type: Number,
            required: true
        },
        catatanHTML: {
            type: String,
            default: ''
        }
    },
    computed: {
        status() {
            if (this.qty === 0) return 'Kosong';
            if (this.qty < this.safety) return 'Menipis';
            return 'Aman';
        },
        badgeClass() {
            if (this.qty === 0) return 'badge-danger';
            if (this.qty < this.safety) return 'badge-warning';
            return 'badge-success';
        }
    }
});