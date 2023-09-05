import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [highScore, setHighScore] = React.useState(parseInt(localStorage.getItem('highScore')) || null);

    const [showInfo, setShowInfo] = React.useState(false)
    
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])
    
    React.useEffect(() => {
        localStorage.setItem("highScore", highScore)
    }, [highScore])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(-1)
        }
    }
    
    function numberOfRolls() {
        setRolls(prevRolls => prevRolls += 1)
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    function getHighScore() {
        if(tenzies === true) {
            if(highScore === null || rolls < highScore) {
                setHighScore(rolls)
            }
        }
    }
    
    function toggleInfo() {
        setShowInfo(prevInfo => !prevInfo)
    }

        
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    let score
    if(highScore === undefined || highScore === 'null') {
        score = 'No highScore'
    } else {
        score = highScore
    }
    console.log(highScore)
    return (
        <div className="content">
            <main>
                <div className="top">
                    <div className='answer'>
                        <button className="equal" onClick={toggleInfo}>
                        ={showInfo && <p className='score'>{score}</p>}
                        </button>
                    </div>
                    <h1 className="title">Tenzies</h1>
                </div>
                <p className="instructions">Roll until all dice are the same. 
                Click each die to freeze it at its current value between rolls.</p>
                <p className='rolls'>Rolls: {rolls}</p>
                <div className="dice-container">
                    {diceElements}
                </div>
                <button 
                    className="roll-dice" 
                    onClick={() => {rollDice(); numberOfRolls(); getHighScore();}}
                    
                >
                    {tenzies ? "New Game" : "Roll"}
                </button>
            </main>
        </div>
    )
}