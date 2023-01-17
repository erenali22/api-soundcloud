export const mapErrors = (errors) => {
  return errors.map(error => {
    let desc = ''
    for (const key of Object.keys(error)) {
      desc += `${error[key]}`
    }
    return desc
  })
}
