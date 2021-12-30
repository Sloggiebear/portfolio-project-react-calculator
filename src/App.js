import "./style.css"
import { useReducer, useState } from "react"
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'
import Navigation from './Navigation'


const singleTaxCredit = 1650
const employeeTaxCredit = 1650
const twentyPercentBracket = 36800

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0,})

function grossPay(paye, investments) {
  return ( paye + investments )
}

function TwentyPercentTax(paye, investments) {
  if ( paye + investments > 36800) {
    let twentyPercent = 36800 * 0.2
    return twentyPercent
  }
  let twentyPercent = (paye + investments) * 0.2
  return twentyPercent
}

function fortyPercentTax(paye, investments) {
  if (paye + investments - twentyPercentBracket < 0) {
    let fortyPercent = 0
    return fortyPercent
  }
  let fortyPercent = (paye + investments - twentyPercentBracket) * 0.4
  return fortyPercent
}



// YESSS

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
          return state
        }
      if (payload.digit === "." && state.currentOperand != null && state.currentOperand.includes(".")) {
          return state 
        }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }

      if (state.currentOperand == null) {
        return state
      }

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      }

      case ACTIONS.EVALUATE:
        if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
          return state
        }

        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),
        }
  }
}

function evaluate({ currentOperand, previousOperand, operation}) {
  const previous = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(previous) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = previous + current
      break

    case "-":
      computation = previous - current
      break

    case "*":
      computation = previous * current
      break
    
    case "÷":
      computation = previous / current
      break
}

  return computation.toString()
}

// const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits: 0,})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`

}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})
  const [paye, setPaye] = useState(0)
  const [pension, setPension] = useState(0)
  const [investments, setInvestments] = useState(0)
  const [twentyPercent, setTwentyPercent] = useState(0)

  return (
    <>
    <Navigation />
      <div className="container">
        <div className="app-grid">
          <div className="output-window">
            <div className="previous-operation">{formatOperand(previousOperand)} {operation}</div>
            <div className="current-operation">{formatOperand(currentOperand)}</div>
          </div>
          <button className="span-2 bg-blue" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
          <button className="bg-blue" onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
          <OperationButton operation={"÷"} dispatch={dispatch} />
          <DigitButton digit={"1"} dispatch={dispatch} />
          <DigitButton digit={"2"} dispatch={dispatch} />
          <DigitButton digit={"3"} dispatch={dispatch} />
          <OperationButton operation={"*"} dispatch={dispatch} />
          <DigitButton digit={"4"} dispatch={dispatch} />
          <DigitButton digit={"5"} dispatch={dispatch} />
          <DigitButton digit={"6"} dispatch={dispatch} />
          <OperationButton operation={"-"} dispatch={dispatch} />
          <DigitButton digit={"7"} dispatch={dispatch} />
          <DigitButton digit={"8"} dispatch={dispatch} />
          <DigitButton digit={"9"} dispatch={dispatch} />
          <OperationButton operation={"+"} dispatch={dispatch} />
          <DigitButton digit={"."} dispatch={dispatch} />
          <DigitButton digit={"0"} dispatch={dispatch} />
          <button className="span-2 bg-purple" onClick={ () => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
        </div>
        <div>
      <h1>Single? Childless? Great! </h1>
      <p>Fuck the married with kids people for once, right?</p>


      <label htmlFor="paye-income">PAYE Income
        <input type="number" name="paye-income" id="paye-income" placeholder="PAYE Income" value={ paye } onChange={(e) => setPaye(parseInt(e.target.value))} />
      </label>
      <br />
      <label htmlFor="pension-contributions">Annual Pension Contributions
        <input type="number" name="pension-contributions" id="pension-contributions" placeholder="Pension Contribuations" value={ pension } onChange={(e) => setPension(parseInt(e.target.value))} />
      </label>
      <br />
      <label htmlFor="investment-income">Annual Investment Income
        <input type="number" name="investment-income" id="investment-income" placeholder="Investment Income" value={ investments } onChange={(e) => setInvestments(parseInt(e.target.value))} />
      </label>


      <p>Single Person Tax Credit: { INTEGER_FORMATTER.format(singleTaxCredit) }</p>

      <p>Employee Tax Credit: { INTEGER_FORMATTER.format(employeeTaxCredit) }</p>

      <p>Gross income: { INTEGER_FORMATTER.format(grossPay(paye, investments)) }</p>

      <p onChange={TwentyPercentTax}>Tax payable at 20%: {twentyPercent} ||| </p>
      {/* { INTEGER_FORMATTER.format(twentyPercentTax(paye, investments)) } */}

      <p>Tax payable at 40%: { INTEGER_FORMATTER.format(fortyPercentTax(paye, investments)) }</p>

      <p>Total tax payable: { INTEGER_FORMATTER.format(0) }</p>



      <p>PAYE: {paye}</p>
      <p>PENSION: {pension}</p>
      <p>INVESTMENTS: {investments}</p>

    </div>
      </div>
    </>
  );
}

export default App;
