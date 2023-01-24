<template>
    <div>
        <!-- <a> tem um link aqui</a>-->
        <v-card>
            <v-tabs
            dark
            background-color="teal darken-3"
            show-arrows
            >
            <v-tabs-slider color="teal lighten-3"></v-tabs-slider>

            <v-tab
                v-for="i in itemsPath"
                :key="i"
                :href="`https://api.github.com/users/${i}/repos`"
            >
                {{ i }}
            </v-tab>
            </v-tabs>
        </v-card>
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
        // array:[],
    }),

    computed: {
        itemsPath(){
            let array = [this.user, this.nameRepo, this.path]
            return (array[0] === null)? null : array
            // return ['tonylampada', 'pasta', 'arquivo'] //TODO gerar esse array a partir de this.user e this.path
        }
    },
}
</script>
// repo -> `https://api.github.com/users/${username}/repos`
