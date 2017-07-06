<template>
    <li class="yz-dropdown-menu" v-clickoutside="handleClose" @click="toggleShow">
        <a :title="title" :class="{'is-open':isOpen}">
            <slot name="title"></slot>
        </a>
        <transition name="dropdown-fade-bottom">
            <div class="yz-dropdown nav" v-show="isOpen">
                <ul>
                    <slot></slot>
                </ul>
            </div>
        </transition>
    </li>
</template>
<script>
export default {
    name: "yzDropdown",
    template: "#yzDropdown",
    directives: {
        clickoutside: {
            bind(el, binding, vnode) {
                function documentHandler(e) {
                    if (el.contains(e.target)) {
                        return false;
                    }
                    if (binding.expression) {
                        binding.value(e);
                    }
                }
                el.__vueClickOutside__ = documentHandler;
                document.addEventListener('click', documentHandler);
            },
            update() {

            },
            unbind(el, binding) {
                document.removeEventListener('click', el.__vueClickOutside__);
                delete el.__vueClickOutside__;
            }
        }
    },
    props: {
        items: Array,
        close: Boolean,
        disabled: Boolean,
        title: String
    },
    data: function() {
        return {
            isOpen: false
        }
    },

    watch: {
        isOpen: function(val) {
            if (val) {
                this.$emit('dropclick', true);
            }
        }
    },
    methods: {
        toggleShow: function() {
            if (this.disabled) return;
            this.isOpen = !this.isOpen;
            console.log('yz-dropdown is ' + this.isOpen)
        },
        handleCloses: function() {
            var _this = this;
            $(document).bind('click', function() {
                _this.isOpen = false;
            })
        },
        handleClose: function() {
            this.isOpen = false;
        }
    },
    mounted: function() {
        //his.handleClose();
        console.log(this);
    }
}
</script>
