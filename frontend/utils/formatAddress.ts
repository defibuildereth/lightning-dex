function formatAddress(address: string) {
    return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length)
}
  
export default formatAddress