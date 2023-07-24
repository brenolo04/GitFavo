export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return axios.get(endpoint).catch(error => error.response)  
    .then(res => {
      const {data} = res
      const {login, name, followers, public_repos} = data
      return ({login, name, followers, public_repos})
    })
  }
}

// ({login, name, followers, public_repos})
