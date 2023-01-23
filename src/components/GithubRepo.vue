<template>
  <div>
    <v-row class="text-center">
      <v-col cols="6">
        <v-autocomplete
        v-model="user"
        label="Encontre seu usuário"
        :items="userlist"
        :loading="userloading"
        :search-input.sync="usersearch"
        item-text="login"
      />
      </v-col>
      <!-- <v-col cols="6">
        <v-select
          v-model="repo"
          :items="repolist"
          :loading="repoloading"
          item-text="name"
          label="Selecione o repositorio"
          return-object
          single-line
        ></v-select>
      </v-col> -->
    </v-row>
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
  <div>
  </div>
  </div>
</template>

<script>

  import {debouncerdecorator} from '@/helpers/debouncer.js'
  import {api} from '~api'

  export default {
    data: () => ({
      user: null,
      repo: null,
      path: null,
      usersearch: null,
      userlist: [],
      repolist: [],
      userloading: false,
      repoloading: false,
    }),
    methods: {
      procuraUsuariosGithub: debouncerdecorator(async function () { // atenção: não use ()=>{} aqui. vai quebrar o decorator
        this.userloading = true
        const data = await api.search_users(this.usersearch)
        this.userlist = data.items
        this.userloading = false
      }, 500),
      async listaRepositorios(){
        this.repoloading = true
        const data = await api.lista_repos(this.user)
        this.repolist = data
        this.repoloading = false
      }, 
      async listaContents(nameRepo){
        debugger
        this.repoloading = true
        const data = await api.listaContents(this.user, nameRepo, )
        this.repolist = data
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
