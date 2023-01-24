<template>
    <div>
        {{ itemsPath }}
    </div>
</template>

<script>
import { reactive } from 'vue'
// debugger
export default {
    props: {
        path: String, // /pasta/arquivo ou /
        user: String, //tipo: tonylampada
        nameRepo: String,
    },
    data: () => ({
        // caminho:["ja tem um", "dois"]
    }),
    computed: {
        itemsPath(){
            let array = [this.user, this.nameRepo, this.path]
            return (array[0] === null)? "path" : array.join('/')
            // return ['tonylampada', 'pasta', 'arquivo'] //TODO gerar esse array a partir de this.user e this.path
        }
    },
}
</script>