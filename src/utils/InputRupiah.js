export const formatInputRupiah = (value) => {
    if(value === null || value === undefined || value === ''){
        return ''
    }

    const number = String(value).replace(/\D/g, '')

    return number ? Number(number).toLocaleString('id-ID') : ''
}

export const getRupiahValue = (value) => {
    return Number(String(value).replace(/\D/g, '')) || 0
}