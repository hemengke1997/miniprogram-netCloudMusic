const baseURL = require('../../utils/baseURL/baseURL.js')
const wxRq = require('./wxRq.js')
const wxGet = wxRq.wxGet

// 获取单曲的信息 
function getSong(id) {
  const url = baseURL + `song/detail?ids=${id}`
  return wxGet(url)
}

// 获取歌词
function getLyric(id) {
  const url = baseURL + `lyric?id=${id}`
  return wxGet(url)
}

// 获取相似歌曲
function getSimiSongs(id) {
  const url = baseURL + `simi/song?id=${id}`
  return wxGet(url)
}

// 获取歌曲播放链接
function getSongUrl(id) {
  const url = baseURL + `song/url?id=${id}`
  return wxGet(url)
}

// 获取专辑内容
function getAlbum(id) {
  const url = baseURL + `album?id=${id}`
  return wxGet(url)
}

// 获取单曲的评论 （取十条
function getSongComments(id) {
  const url = baseURL + `comment/hot?id=${id}&type=0&limit=10`
  return wxGet(url)
}


module.exports = {
  getSong,
  getLyric,
  getSimiSongs,
  getSongUrl,
  getAlbum,
  getSongComments
}