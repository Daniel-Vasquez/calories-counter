const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

const attrsToString = (obj = {}) =>
  Object.keys(obj)
    .map(attr => `${attr}="${obj[attr]}"`)
    .join(' ')

const tagAttrs = obj => (content = '') =>
  `<${obj.tag}${obj.attrs ? ' ' :	 ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`

const tag = t => typeof t === 'string' ? tagAttrs({ tag: t }) : tagAttrs(t)

const tableRowTag = tag('tr')
const tableRow = items => compose(tableRowTag, tableCells)(items)

const tableCell = tag('td')
const tableCells = items => items.map(tableCell).join('')

const trashIcon = tag({ tag: 'i', attrs: { class: 'fas fa-trash-alt' } })('')

const normalizingNumber = number => {
  const normalized = parseFloat(number.toFixed(3));

  const value = number === 0 ? 0 : normalized

  return value
};

let description = $('#description')
let calories = $('#calories')
let carbs = $('#carbs')
let protein = $('#protein')
const removeTableItem = document.getElementById('remove-table-item')

let list = []

const validateInputs = () => {

  description.val() ? '' : description.addClass('is-invalid')
  calories.val() ? '' : calories.addClass('is-invalid')
  carbs.val() ? '' : carbs.addClass('is-invalid')
  protein.val() ? '' : protein.addClass('is-invalid')

  if(
    description.val() &&
    calories.val() &&
    carbs.val() &&
    protein.val()
  ) add()
}

const add = () => {
  const newItem = {
    description: description.val().charAt(0).toUpperCase() + description.val().slice(1),
    calories: parseFloat(calories.val()),
    carbs: parseFloat(carbs.val()),
    protein: parseFloat(protein.val())
  }

  list.push(newItem)

  if (list.length != 0) {
    removeTableItem.innerHTML = 'Eliminar'
  }

  updateTotals()
  cleanInputs()
  renderItems()
}

const removeItem = (index) => {
  list.splice(index, 1)

  if (list.length === 0) {
    removeTableItem.innerHTML = ''
  }

  updateTotals()
  renderItems()
}

const updateTotals = () => {
  let calories = 0, carbs = 0, protein = 0

  list.map(item => {
    calories += item.calories,
    carbs += item.carbs,
    protein += item.protein
  })

  $('#totalCalories').text(normalizingNumber(calories))
  $('#totalCarbs').text(normalizingNumber(carbs))
  $('#totalProtein').text(normalizingNumber(protein))
}

const cleanInputs = () => {
  description.val('')
  calories.val('')
  carbs.val('')
  protein.val('')
}

const renderItems = () => {
  $('tbody').empty()

  list.map((item, index) => {

    const removeButton = tag({
      tag: 'button',
      attrs: {
        class: 'btn btn-outline-danger',
        onclick: `removeItem(${index})`
      }
    })(trashIcon)

    $('tbody').append(tableRow([item.description, item.calories, item.carbs, item.protein, removeButton]))
  })
}
