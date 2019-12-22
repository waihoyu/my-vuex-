<template>
<div id="app">
    我是state: {{this.$store.state.age}}
    <br>
    我是getters:{{this.$store.getters.myAge}}
    <br>
    <button @click="add">同步 点击按钮增加10岁</button>
    <button @click="minus">异步 点击按钮减少10岁</button>
    <button @click="childrenX">调用子组件方法</button>
    <br>
    {{this.$store.state}}
</div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {}
    },
    methods: {
        add() {
            this.$store.commit('syncAdd', 10);
        },
        minus() {
            this.$store.dispatch('asyncMinus', 20);
        },
        childrenX(){
             this.$store.commit('syncchildrenX', 20);
        }
    },
    mounted() {
        setTimeout(() => {
            console.log(this.$store.state)
            this.$store.state.age = 100;
        }, 1000)
    }
}
</script>

<style>
#app {
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
