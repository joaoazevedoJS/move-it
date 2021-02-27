import axios from 'axios';

const oauthGithub = axios.create({
  baseURL: 'https://github.com/login/oauth'
})

export default oauthGithub;