Vue.component('app-modal', {
    template: `
        <div class="modal-mask" v-show="show">
            <div class="modal-wrapper" @click.self="$emit('close')">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">
                            <h3>Default Header</h3>
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            Default body
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                            <button class="btn btn-secondary" @click="$emit('close')">Tutup</button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: {
        show: {
            type: Boolean,
            default: false
        }
    }
});