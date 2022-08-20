import axios from 'axios';

// const { API_KEY } = import.meta.env;

export const gw2api = axios.create({
  baseURL: `https://api.guildwars2.com`,
  // headers: {
  //   ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
  //   'User-Agent': 'guilds.gw2w2w.com',
  // },
});
