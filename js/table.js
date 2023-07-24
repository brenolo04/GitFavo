import { GithubUser } from "./gitsearch.js"

class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.LocalKey = 'GitUsers'
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem(this.LocalKey)) || []
    console.log(this.entries)
  }

  saveLocalStorage() {
    localStorage.setItem(this.LocalKey, JSON.stringify(this.entries)) 
  }
  
  async add(user) {
    try {
      const hasUser = this.entries.find(entry => String(entry.login).toUpperCase() == String(user).toUpperCase())
      if(hasUser) {
        alert('Usuário já cadastrado!')
        return
      }

      const githubUser = await GithubUser.search(user)
      if (githubUser.login == undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [githubUser, ...this.entries]
      this.verifyUsers(this.entries.length)
      this.saveLocalStorage()
      this.update()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry => 
      entry.login !== user.login
    )
    this.entries = filteredEntries
    
    this.verifyUsers(this.entries.length)
    this.update()
  }
}

export class FavoritesView extends Favorites{
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('tbody')
    this.update()
    this.verifyUsers(this.entries.length)
    this.addUser()
  }

  addUser() {
    this.root.querySelector('.search button').onclick = () => {
      const input = this.root.querySelector('.search input')

      if(input.value == '') {
        alert('Nenhum usuário digitado')
        return
      }
        this.add(input.value)
        input.value = ''
    }
  }

  update() {
    this.clearTbody()
    this.entries.forEach(user => {
      const row = this.creatTr()
      row.querySelector('img').src = `https://github.com/${user.login}.png`
      row.querySelector('img').alt = `Imagem de ${user.name}`
      row.querySelector('.user-links a').href = `https://github.com/${user.login}`
      row.querySelector('.user-links #name-user').textContent = `${user.name}`      
      row.querySelector('.user-links #log-user').textContent = `${user.login}`
      row.querySelector('#repos').textContent = `${user.public_repos}`
      row.querySelector('#followers').textContent = `${user.followers}`

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que apagar?')
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  verifyUsers(arrayLength) {
    const emptyUsers = this.root.querySelector('.empty-fav')
    if(arrayLength > 0) {
      emptyUsers.classList.add('hide')
      return
    }
      emptyUsers.classList.remove('hide')
  }

  creatTr() {
    const tr = document.createElement('tr')
    tr.classList.add('fav-user')
    tr.innerHTML = `
      <td class="user">
        <img src="" alt="">
        <div class="user-links">
          <a target="_blank" id="name-user"></a>
          <a target="_blank" id="log-user" href=""></a> 
        </div>

        <div class="user-infos">
          <td id="repos">321</td>
          <td id="followers">23123</td>
          <td class="remove">
            <button>Remover</button>
          </td>
        </div>
      </td>
    `
    return tr
  }

  clearTbody() {
    this.tbody.querySelectorAll('tr').forEach(tr => tr.remove())
  }
}