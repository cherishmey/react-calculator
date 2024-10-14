// src/components/Calculator.tsx

import React, { useState } from 'react';
import './Calculator.css';

const Calculator: React.FC = () => {
    const [display, setDisplay] = useState<string>('0');
    const [operator, setOperator] = useState<string | null>(null);
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [isNewInput, setIsNewInput] = useState<boolean>(false);
    const [history, setHistory] = useState<string[]>([]);

    const handleNumber = (num: string) => {
        if (isNewInput) {
            setDisplay(num);
            setIsNewInput(false);
        } else {
            setDisplay(display === '0' ? num : display + num);
        }
    };

    const formatNumber = (num: string): string => {
        if (num === '0') return '0';
        if (num === '0.') return '0.';
        const numToNumber = parseFloat(num);
        if (Math.abs(numToNumber) >= 1e12 || Math.abs(numToNumber) < 1e-12) {
            return numToNumber.toExponential(3).toString(); // Display with 3 decimal places in scientific notation
        }
        if (num.length > 12) {
            const [integerPart, decimalPart] = num.split('.');
            if (decimalPart) {
                const maxIntegerLength = 12 - (decimalPart.length > 11 ? 11 : decimalPart.length);
                return `${integerPart.slice(0, maxIntegerLength)}.${decimalPart.slice(0, 11)}`;
            } else {
                return num.slice(0, 12);
            }
        }
        return num;
    };

    const handleOperator = (op: string) => {
        if (operator && !isNewInput) {
            calculate();
        } else {
            setPreviousValue(parseFloat(display));
        }
        setOperator(op);
        setIsNewInput(true);
    };

    const handleDecimal = () => {
        if (isNewInput) {
            setDisplay('0.');
            setIsNewInput(false);
            return;
        }
        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const calculate = () => {
        if (operator && previousValue !== null) {
            const current = parseFloat(display);
            let result: number;
            switch (operator) {
                case '+':
                    result = previousValue + current;
                    break;
                case '-':
                    result = previousValue - current;
                    break;
                case '×':
                    result = previousValue * current;
                    break;
                case '÷':
                    result = current !== 0 ? previousValue / current : 0;
                    break;
                case '%':
                    result = previousValue % current;
                    break;
                default:
                    return;
            }
            const calculation = `${previousValue} ${operator} ${current} = ${result}`;
            setHistory([calculation, ...history]);
            setDisplay(result.toString());
            setOperator(null);
            setPreviousValue(null);
            setIsNewInput(true);
        }
    };

    const handleClear = () => {
        setDisplay('0');
        setOperator(null);
        setPreviousValue(null);
        setIsNewInput(false);
    };

    const handleDelete = () => {
        setDisplay((prevDisplay) => prevDisplay.slice(0, -1) || "0");
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <div className="body">
            <div className="calculator">
                <div className="display" data-testid="display">{formatNumber(display)}</div>
                <div className="button-container">
                    <button onClick={handleClear} className="button function">C</button>
                    <button onClick={handleDelete} className="button function">DEL</button>
                    <button onClick={() => handleOperator('%')} className="button operator">%</button>
                    <button onClick={() => handleOperator('÷')} className="button operator">/</button>

                    <button onClick={() => handleNumber('7')} className="button">7</button>
                    <button onClick={() => handleNumber('8')} className="button">8</button>
                    <button onClick={() => handleNumber('9')} className="button">9</button>
                    <button onClick={() => handleOperator('×')} className="button operator">*</button>

                    <button onClick={() => handleNumber('4')} className="button">4</button>
                    <button onClick={() => handleNumber('5')} className="button">5</button>
                    <button onClick={() => handleNumber('6')} className="button">6</button>
                    <button onClick={() => handleOperator('-')} className="button operator">-</button>

                    <button onClick={() => handleNumber('1')} className="button">1</button>
                    <button onClick={() => handleNumber('2')} className="button">2</button>
                    <button onClick={() => handleNumber('3')} className="button">3</button>
                    <button onClick={() => handleOperator('+')} className="button operator">+</button>
                    <button onClick={() => handleNumber('0')} className="button zero">0</button>
                    <button onClick={handleDecimal} className="button">.</button>
                    <button onClick={calculate} className="button equals">=</button>
                </div>
            </div>
            <div className="history">
                <div className="history-header">
                    <h3>History</h3>
                    <button onClick={clearHistory} id="history-clear-button">Clear</button>
                </div>
                <ul>
                    {history.map((entry, index) => (
                        <li key={index}>{entry}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Calculator;
