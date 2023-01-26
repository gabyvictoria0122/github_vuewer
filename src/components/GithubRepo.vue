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
      <v-breadcrumbs>
          <v-breadcrumbs-item
              v-for="i in arrayPath"
              :key="i"
              @click.native="volta(i.text, arrayPath)">
              {{ i.text + " /"}}
          </v-breadcrumbs-item>
      </v-breadcrumbs>
      <v-divider></v-divider>
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
      <div v-else>
        <h1>Lista Conteudos</h1>
        <v-card
        class="mx-auto"
        max-width="400"
        >
        <v-list flat>
          <v-list-item-group
            color="primary"
          >
            <v-list-item
              v-for="(item, i) in contents"
              :key="i"
              :href="`#tab-${i}`"
            >
              <!-- <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon> -->

              <v-list-item-content @click="listaFolderOrArchive(item.path)" >
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
      
    },
    data: () => ({
      user: null,
      repo: null,
      path: null,
      usersearch: null,
      nameRepo: null,
      caminho: null,
      branch: null,
      model: 'Tarefa01',
      userlist: [],
      repolist: [],
      contents: [],
      arrayPath: [],
      userloading: false,
      repoloading: false,
      bollRepo: false,
      bollContents: false,
      items: [
        
        'Dashboard',
          
        {
          text: 'Link 1',
          disabled: false,
          href: 'breadcrumbs_link_1',
        },
        {
          text: 'Link 2',
          disabled: true,
          href: 'breadcrumbs_link_2',
        },
      ],
    }),
    methods: {
      procuraUsuariosGithub: debouncerdecorator(async function () { // atenção: não use ()=>{} aqui. vai quebrar o decorator
        this.userloading = true
        const data = await api.search_users(this.usersearch)
        this.userlist = data.items
        this.userloading = false
      }, 500),
      async listaRepositorios(){
        debugger
        this.arrayPath = [{text: this.user, disabled: false}]
        this.bollRepo = true
        this.repoloading = true
        const data = await api.lista_repos(this.user)
        this.repolist = data
        this.branch = data.default_branch
        this.repoloading = false
      }, 
      async listaContents(nameRepo){
        debugger
        this.nameRepo = nameRepo
        this.arrayPath = [{text: this.user, disabled: true}, {text: this.nameRepo, disabled: false}]
        this.bollRepo = false
        this.bollContents = true
        this.repoloading = true
        const data = await api.listaContents(this.user, nameRepo, )
        this.contents = data
        this.repoloading = false
      }, 
      async listaFolderOrArchive(path){
        debugger
        this.arrayPath = [{text: this.user, disabled: true}, {text: this.nameRepo, disabled: true}, {text: path, disabled: false}  ]
        this.path = path
        this.repoloading = true
        const data = await api.listaArchive(this.user, this.nameRepo, path)
        this.contents = data
        this.repoloading = false
      },
      volta (i, itemsPath){
        debugger
        let executa = null
        // let indice = this.itemsPath.indexOf(i)
        if (i == this.user){
          executa = this.listaRepositorios()
        } else if(i == this.nameRepo){
          executa = this.listaContents(i)
        } else{
          executa = this.listaFolderOrArchive
        }
        // let indice = itemsPath.indexOf(i)+1
        // let tamanho = itemsPath.length
        // this.itemsPath.splice((indice),(tamanho-indice));
        return executa
        // se priemiro repo
        // pasta dentro de pasta 
      }, 
    },
    computed: {
        itemsPath(){
            let array = [this.user, this.nameRepo, this.path]
            return (array[0] === null)? null : array
            // return ['tonylampada', 'pasta', 'arquivo'] //TODO gerar esse array a partir de this.user e this.path
        }
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
