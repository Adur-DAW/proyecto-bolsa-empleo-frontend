export const limpiarLocalStorage = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
}
