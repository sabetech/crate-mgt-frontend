export const formatDate = (date: string) => {
    let myDate = new Date(date)
    return myDate.toLocaleDateString('en-GB', {year: 'numeric', month: 'long', day: 'numeric'});
}