export const countries = ['nl', 'be', 'fr', 'de', 'ch', 'at', 'cz', 'pl', 'sk', 'hu', 'it', 'lu', 'si']

const yearNow = new Date().getFullYear()
export const years = [];
var startYear = 2010;
while ( startYear <= yearNow ) {
    years.push(startYear++);
}

export const getCountryInParams = (params) => {
  for (let key in params) {
    if (countries.includes(params[key])) {
      return params[key]
    }
  }
}
  
export const getYearInParams = (params) => {
  for (let key in params) {
    if (years.includes(parseInt(params[key]))) {
      return params[key]
    }
  }
}