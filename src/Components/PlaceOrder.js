import { openTabQueries } from '../Domain'
import OrderedItem from '../Domain/OrderedItem'

export default class PlaceOrder extends React.Component {
  constructor(props) {
    super(props)

    const order = this.props.menu.reduce((obj, item) => {
      obj[item.menuNumber] = 0
      return obj
    }, {})

    this.state = Object.assign({}, order, { tableNumber: 0});

    this.handleChangeAmount = this.handleChangeAmount.bind(this)
    this.handleChangeTable = this.handleChangeTable.bind(this)
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this)
  }

  handleChangeAmount(event) {
    this.setState({
      [event.target.id]: parseInt(event.target.value)
    })
  }

  handleChangeTable(event) {
    this.setState({
      tableNumber: event.target.value
    })
  }

  handlePlaceOrder(event) {
    event.preventDefault()
    const order = this.props.menu
      .filter(item => this.state[item.menuNumber] > 0)
      .reduce((orderedItems, item) => {
        const newItems = []
        for (let i = 0; i < this.state[item.menuNumber]; i++) {
          newItems.push(new OrderedItem({
            menuNumber: item.menuNumber,
            description: item.description,
            isDrink: item.isDrink,
            price: item.price
          }))
        }
        return orderedItems.concat(newItems)
      }, [])
    
    this.props.handlePlaceOrder(order, this.state.tableNumber)
  }

  render() {
    const el = React.createElement
    return el('form', {onSubmit: this.handlePlaceOrder},
      el('h2', null, 'Place Order'),
      el('div', {className: 'form-group'},
        el('label', {htmlFor: 'tableNumber'}, 'Table'),
        el('select', {
            className: 'form-control',
            name: 'tableNumber',
            onChange: this.handleChangeTable,
            value: this.state.tableNumber
          },
          el('option', null, '--SELECT TABLE #--'),
          this.props.activeTableNumbers.map((t,i) =>
            el('option', {value: t, key: i}, t)
          )
        )
      ),
      el('table', {className: 'table'},
        el('thead', null,
          el('tr', null,
            el('th', null, 'Menu #'),
            el('th', null, 'Description'),
            el('th', null, 'Price'),
            el('th', null, '# Order')
          )
        ),
        el('tbody', null,
          this.props.menu.map(i =>
            el('tr', {key: i.menuNumber},
              el('td', null,
                i.menuNumber,
                el('input', {type: 'hidden', value: i.menuNumber})
              ),
              el('td', null, i.description),
              el('td', null, `$${i.price.toFixed(2)}`),
              el('td', null,
                el('input', {
                  type: 'number',
                  id: i.menuNumber,
                  name: 'numberToOrder',
                  value: this.state[i.menuNumber],
                  className: 'form-control',
                  onChange: this.handleChangeAmount
                })
              )
            )
          )
        )
      ),
      el('button', {type: 'submit', className: 'btn'}, 'Place Order')
    )
  }
}