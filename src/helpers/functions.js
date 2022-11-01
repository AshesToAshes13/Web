export function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
    (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

export function getNavstackPath (tree, uid) {
  if (tree.uid === uid) {
    return [{
      name: tree.name,
      to: '/project/' + tree.uid
    }]
  } else if (tree.children) {
    for (let i = 0; i < tree.children.length; i++) {
      const path = getNavstackPath(tree.children[i], uid)
      if (path !== null) {
        path.unshift({
          name: tree.name,
          to: '/project/' + tree.uid
        })
        return path
      }
    }
  }

  return null
}

export function stripPhoneNumber (phoneString) {
  let preparedClientPhone = phoneString.split('')
  if (!preparedClientPhone.length) {
    return ''
  }

  if (preparedClientPhone[0] === '8') {
    preparedClientPhone[0] = '7'
  }

  preparedClientPhone = preparedClientPhone.join('').replaceAll(/(\s|\(|\)|\+|-)/g, '')
  return preparedClientPhone
}

export const debounceFn = (cb, ms) => {
  let timeout
  return function () {
    const fnCall = () => {
      cb.apply(this, arguments)
    }
    clearTimeout(timeout)
    timeout = setTimeout(fnCall, ms)
  }
}
