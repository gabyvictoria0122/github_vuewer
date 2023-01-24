<template>
  <div>
      <v-col>
        <v-autocomplete
        v-model="user"
        label="Encontre seu usuário"
        :items="userlist"
        :loading="userloading"
        :search-input.sync="usersearch"
        item-text="login"
      />
      </v-col>
      <GithubPath :user="user" :nameRepo="nameRepo" :path="path"/>
      <div v-if="bollRepo">
        <h1>Lista Repos</h1>
        <v-card
        class="mx-auto"
        max-width="400"
        >
        <v-list flat>
          <v-list-item-group
            color="indigo"
          >
            <v-list-item
              v-for="(item, i) in repolist"
              :key="i"
            >
              <!-- <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon> -->

              <v-list-item-content @click="listaContents(item.name)" >
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        </v-card>
      </div>
      <div v-if="bollContents">
        <h1>Lista Conteudos</h1>
        <v-card
        class="mx-auto"
        max-width="400"
        >
        <v-list flat>
          <v-list-item-group
            color="indigo"
          >
            <v-list-item
              v-for="(item, i) in contents"
              :key="i"
            >
              <!-- <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon> -->

              <v-list-item-content @click="listaContents(item.name)" >
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </div>

  </div>
</template>

<script>
  import GithubPath from '@/components/GithubPath.vue'
  import {debouncerdecorator} from '@/helpers/debouncer.js'
  import {api} from '~api'

  export default {
    components: {
      GithubPath,
    },
    data: () => ({
      user: null,
      repo: null,
      path: null,
      usersearch: null,
      nameRepo: null,
      userlist: [],
      repolist: [],
      contents: [],
      userloading: false,
      repoloading: false,
      bollRepo: false,
      bollContents: false,
    }),
    methods: {
      procuraUsuariosGithub: debouncerdecorator(async function () { // atenção: não use ()=>{} aqui. vai quebrar o decorator
        this.userloading = true
        const data = await api.search_users(this.usersearch)
        this.userlist = data.items
        this.userloading = false
        
      }, 500),
      async listaRepositorios(){
        this.bollRepo = true
        this.repoloading = true
        const data = await api.lista_repos(this.user)
        this.repolist = data
        this.repoloading = false
      }, 
      async listaContents(nameRepo){
        this.nameRepo = nameRepo
        this.bollRepo = false
        this.bollContents = true
        this.repoloading = true
        const data = await api.listaContents(this.user, nameRepo, )
        this.contents = data
        this.repoloading = false
      }, 
      async listaFolderOrArchive(owner, nameRepo, path){
        debugger
        // this.path = name + "/"
        this.repoloading = true
        const data = await api.listaContents(this.user, nameRepo, path)
        this.repolist = data
        this.repoloading = false
      }, 
      
    },
    watch: {
      usersearch () {
        this.procuraUsuariosGithub()
      },
      user() {
        if(this.user){
          this.listaRepositorios()
        }
      },
      repo () {
        this.$emit('reposelected', this.repo)
      },
      // contents () {
      //   this.$emit('reposelected', this.repo)
      // }

    }
  }
</script>
