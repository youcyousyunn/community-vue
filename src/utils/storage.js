const ls = window.sessionStorage

export function getItem (key) {
  try {
    return JSON.parse(ls.getItem(key))
  } catch (err) {
    return null
  }
}

export function setItem (key, val) {
  ls.setItem(key, JSON.stringify(val))
}

export function clear () {
  ls.clear()
}

export function removeItem (key) {
  ls.removeItem(key)
}
