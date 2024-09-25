"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "../Components/ui/button"
import { Input } from "../Components/ui/input"
import { Label } from "../Components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs"
import { Dialog, DialogContent, DialogTrigger } from "../Components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Smartphone, Monitor, Sun, Moon, Palette } from "lucide-react"

type Theme = "light" | "dark" | "blue" | "green" | "purple" | "sepia" | "grayscale" | "ocean" | "forest" | "sunset"
type CalculatorType = "standard" | "position" | "exchange"
type DeviceMode = "mobile" | "desktop"
type ColorMode = "light" | "dark"

const themes: Record<Theme, string> = {
  light: "bg-white text-gray-800 border-gray-300 shadow-md",
  dark: "bg-gray-800 text-white border-gray-600 shadow-md",
  blue: "bg-blue-100 text-blue-900 border-blue-300 shadow-md",
  green: "bg-green-100 text-green-900 border-green-300 shadow-md",
  purple: "bg-purple-100 text-purple-900 border-purple-300 shadow-md",
  sepia: "bg-yellow-100 text-yellow-900 border-yellow-300 shadow-md",
  grayscale: "bg-gray-200 text-gray-900 border-gray-400 shadow-md",
  ocean: "bg-gradient-to-r from-blue-300 to-blue-500 text-white border-blue-400 shadow-md",
  forest: "bg-gradient-to-r from-green-300 to-green-500 text-white border-green-400 shadow-md",
  sunset: "bg-gradient-to-r from-orange-300 to-red-500 text-white border-red-400 shadow-md",
}

const themeButtonStyles: Record<Theme, string> = {
  light: "bg-white text-gray-800 border-gray-300 hover:bg-gray-100",
  dark: "bg-gray-800 text-white border-gray-600 hover:bg-gray-700",
  blue: "bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-200",
  green: "bg-green-100 text-green-900 border-green-300 hover:bg-green-200",
  purple: "bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200",
  sepia: "bg-yellow-100 text-yellow-900 border-yellow-300 hover:bg-yellow-200",
  grayscale: "bg-gray-200 text-gray-900 border-gray-400 hover:bg-gray-300",
  ocean: "bg-blue-400 text-white border-blue-500 hover:bg-blue-500",
  forest: "bg-green-400 text-white border-green-500 hover:bg-green-500",
  sunset: "bg-orange-400 text-white border-red-500 hover:bg-orange-500",
}

const currencyPairs = ["EUR/USD", "USD/JPY", "GBP/USD", "USD/CHF", "AUD/USD"]
const accountCurrencies = ["USD", "EUR", "JPY", "GBP", "CHF"]

const currencySymbols: Record<string, string> = {
  USD: "$", EUR: "€", JPY: "¥", GBP: "£", CHF: "Fr", AUD: "A$", CAD: "C$", CNY: "¥", HKD: "HK$", NZD: "NZ$",
  SEK: "kr", KRW: "₩", SGD: "S$", NOK: "kr", MXN: "$", INR: "₹", RUB: "₽", ZAR: "R", TRY: "₺", BRL: "R$",
  // Add more currencies as needed
}

export default function Cal() {
  const [result, setResult] = useState<string>("0")
  const [theme, setTheme] = useState<Theme>("light")
  const [calculatorType, setCalculatorType] = useState<CalculatorType>("standard")
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop")
  const [colorMode, setColorMode] = useState<ColorMode>("light")
  const [isAnimating, setIsAnimating] = useState(false)
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false)

  // Position sizing state
  const [accountSize, setAccountSize] = useState<string>("100")
  const [riskPercentage, setRiskPercentage] = useState<string>("1")
  const [entryPrice, setEntryPrice] = useState<string>("0")
  const [stopLoss, setStopLoss] = useState<string>("0")
  const [currencyPair, setCurrencyPair] = useState<string>("EUR/USD")
  const [accountCurrency, setAccountCurrency] = useState<string>("USD")
  const [positionSize, setPositionSize] = useState<string>("0")
  const [positionValue, setPositionValue] = useState<string>("0")

  const [inputErrors, setInputErrors] = useState<Record<string, string>>({
    accountSize: '',
    riskPercentage: '',
    entryPrice: '',
    stopLoss: '',
  });

  // New state for exchange rate calculator
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("EUR")
  const [exchangeAmount, setExchangeAmount] = useState<string>("1")
  const [exchangeResult, setExchangeResult] = useState<string>("0")

  useEffect(() => {
    const handleResize = () => {
      setDeviceMode(window.innerWidth < 768 ? "mobile" : "desktop")
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleButtonClick = useCallback((value: string) => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
    setResult((prev) => {
      if (prev === "0" && value !== ".") {
        return value
      }
      if (value === "=") {
        try {
          return eval(prev).toString()
        } catch {
          return "Error"
        }
      }
      if (value === "C") {
        return "0"
      }
      if (value === "sin" || value === "cos" || value === "tan") {
        return `Math.${value}(${prev})`
      }
      if (value === "√") {
        return `Math.sqrt(${prev})`
      }
      if (value === "^") {
        return `${prev}**`
      }
      if (value === "π") {
        return `${prev}${prev === "0" ? "" : "*"}${Math.PI}`
      }
      return prev + value
    })
  }, [])

  const handleSelectChange = useCallback((setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
  }, []);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setter(value);
    
    // Example validation
    if (value === '') {
      setInputErrors((prev) => ({ ...prev, [field]: 'This field is required' }));
    } else {
      setInputErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const calculatePositionSize = useCallback(() => {
    const account = parseFloat(accountSize) || 0;
    const risk = parseFloat(riskPercentage) || 0;
    const entry = parseFloat(entryPrice) || 0;
    const stop = parseFloat(stopLoss) || 0;

    if (account && risk && entry && stop && entry !== stop) {
      const riskAmount = account * (risk / 100);
      const shares = riskAmount / Math.abs(entry - stop);
      const value = shares * entry;
      setPositionSize(shares.toFixed(2));
      setPositionValue(value.toFixed(2));
    } else {
      setPositionSize("Invalid input");
      setPositionValue("Invalid input");
    }
  }, [accountSize, riskPercentage, entryPrice, stopLoss]);

  const handleExchangeInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setExchangeAmount(value);
    }
  }, []);

  const calculateExchangeRate = useCallback(() => {
    // In a real application, you would fetch real-time exchange rates from an API
    // For this example, we'll use a mock exchange rate
    const mockExchangeRate = 1.2; // 1 USD = 1.2 EUR (example)
    const result = parseFloat(exchangeAmount) * mockExchangeRate;
    setExchangeResult(result.toFixed(2));
  }, [exchangeAmount]);

  const standardButtons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+",
    "C"
  ]

  const buttons = calculatorType === "standard" ? standardButtons : []

  const CalculatorContent = () => (
    <div className={`w-full max-w-md p-4 rounded-2xl shadow-lg border-2 ${themes[theme]} transition-all duration-500`}>
      <motion.div
        animate={isAnimating ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Input
          type="text"
          value={result}
          readOnly
          className="w-full mb-4 text-right text-3xl font-bold bg-transparent border-none focus:ring-0"
        />
      </motion.div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => (
          <motion.div
            key={btn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => handleButtonClick(btn)}
              className={`w-full h-14 text-lg font-semibold rounded-xl ${btn === "=" ? "col-span-2" : ""} ${themeButtonStyles[theme]}`}
            >
              {btn}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const PositionSizingCalculator = useMemo(() => () => (
    <div className={`w-full max-w-md p-6 rounded-2xl shadow-lg border-2 ${themes[theme]} transition-all duration-500`}>
      <h2 className="text-2xl font-bold mb-6 text-center">Position Sizing Calculator</h2>
      <div className="space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="accountSize" className="mb-1">Account Size</Label>
          <Input
            id="accountSize"
            type="text"
            inputMode="decimal"
            value={accountSize}
            onChange={handleInputChange(setAccountSize, 'accountSize')}
            className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          {inputErrors.accountSize && <span className="text-red-500">{inputErrors.accountSize}</span>}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="riskPercentage" className="mb-1">Risk Percentage</Label>
          <Input
            id="riskPercentage"
            type="text"
            inputMode="decimal"
            value={riskPercentage}
            onChange={handleInputChange(setRiskPercentage, 'riskPercentage')}
            className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          {inputErrors.riskPercentage && <span className="text-red-500">{inputErrors.riskPercentage}</span>}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="entryPrice" className="mb-1">Entry Price</Label>
          <Input
            id="entryPrice"
            type="text"
            inputMode="decimal"
            value={entryPrice}
            onChange={handleInputChange(setEntryPrice, 'entryPrice')}
            className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          {inputErrors.entryPrice && <span className="text-red-500">{inputErrors.entryPrice}</span>}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="stopLoss" className="mb-1">Stop Loss</Label>
          <Input
            id="stopLoss"
            type="text"
            inputMode="decimal"
            value={stopLoss}
            onChange={handleInputChange(setStopLoss, 'stopLoss')}
            className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          {inputErrors.stopLoss && <span className="text-red-500">{inputErrors.stopLoss}</span>}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="currencyPair" className="mb-1">Currency Pair</Label>
          <select id="currencyPair" value={currencyPair} onChange={handleSelectChange(setCurrencyPair)} className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500">
            {currencyPairs.map(pair => (
              <option key={pair} value={pair}>{pair}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="accountCurrency" className="mb-1">Account Currency</Label>
          <select id="accountCurrency" value={accountCurrency} onChange={handleSelectChange(setAccountCurrency)} className="p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500">
            {accountCurrencies.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <Button onClick={calculatePositionSize} className={`w-full mt-4 ${themeButtonStyles[theme]}`}>Calculate</Button>
        <div className="flex flex-col mt-4">
          <Label className="mb-1">Position Size (Units)</Label>
          <Input value={positionSize} readOnly className="p-2 rounded-md border border-gray-300 bg-gray-100" />
        </div>
        <div className="flex flex-col mt-2">
          <Label className="mb-1">Position Value ({currencySymbols[accountCurrency]})</Label>
          <Input value={`${currencySymbols[accountCurrency]} ${positionValue}`} readOnly className="p-2 rounded-md border border-gray-300 bg-gray-100" />
        </div>
      </div>
    </div>
  ), [theme, accountSize, riskPercentage, entryPrice, stopLoss, currencyPair, accountCurrency, positionSize, positionValue, calculatePositionSize, inputErrors]);

  const ExchangeRateCalculator = useMemo(() => () => (
    <div className={`w-full max-w-md p-6 rounded-2xl shadow-lg border-2 ${themes[theme]} transition-all duration-500`}>
      <h2 className="text-2xl font-bold mb-6 text-center">Currency Exchange Calculator</h2>
      <div className="space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="exchangeAmount" className="mb-1">Amount</Label>
          <Input
            id="exchangeAmount"
            type="text"
            inputMode="decimal"
            value={exchangeAmount}
            onChange={handleExchangeInputChange}
            className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <Label htmlFor="fromCurrency" className="mb-1">From Currency</Label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(currencySymbols).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <Label htmlFor="toCurrency" className="mb-1">To Currency</Label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(currencySymbols).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <Button onClick={calculateExchangeRate} className={`w-full mt-4 ${themeButtonStyles[theme]}`}>Calculate</Button>
        <div className="flex flex-col mt-4">
          <Label className="mb-1">Result</Label>
          <Input value={`${currencySymbols[fromCurrency]}${exchangeAmount} = ${currencySymbols[toCurrency]}${exchangeResult}`} readOnly className="p-2 rounded-md border border-gray-300 bg-gray-100" />
        </div>
      </div>
    </div>
  ), [theme, exchangeAmount, fromCurrency, toCurrency, exchangeResult, calculateExchangeRate, handleExchangeInputChange]);

  const ThemeGallery = () => (
    <Dialog open={isThemeDialogOpen} onOpenChange={setIsThemeDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg rounded-full">
          <Palette className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Themes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 py-4">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Choose Your Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.keys(themes).map((themeKey) => (
              <ThemeOption key={themeKey} themeKey={themeKey as Theme} setTheme={setTheme} setIsThemeDialogOpen={setIsThemeDialogOpen} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const ThemeOption = ({ themeKey, setTheme, setIsThemeDialogOpen }: { themeKey: Theme, setTheme: (theme: Theme) => void, setIsThemeDialogOpen: (open: boolean) => void }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center space-y-2 p-2 rounded-lg cursor-pointer"
      onClick={() => {
        setTheme(themeKey)
        setIsThemeDialogOpen(false)
      }}
    >
      <div className={`w-full aspect-square rounded-lg ${themes[themeKey]} shadow-lg`}></div>
      <span className="text-sm font-medium text-center">{themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}</span>
    </motion.div>
  )

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${colorMode === "dark" ? "bg-[#111111]" : "bg-gray-100"} transition-colors duration-300`}>
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mb-8">
        <Tabs 
          defaultValue="standard" 
          className="w-full flex flex-col"
          onValueChange={(value) => setCalculatorType(value as CalculatorType)}
        >
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-gray-200 dark:bg-gray-700 rounded-full p-1">
            <TabsTrigger value="standard" className="rounded-full">Standard</TabsTrigger>
            <TabsTrigger value="position" className="rounded-full">Position Sizing</TabsTrigger>
            <TabsTrigger value="exchange" className="rounded-full">Exchange Rates</TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={calculatorType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-grow flex items-center justify-center"
            >
              <TabsContent value="standard" className="w-full">
                <CalculatorContent />
              </TabsContent>
              <TabsContent value="position" className="w-full">
                <PositionSizingCalculator />
              </TabsContent>
              <TabsContent value="exchange" className="w-full">
                <ExchangeRateCalculator />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setDeviceMode("mobile")}
            variant={deviceMode === "mobile" ? "default" : "outline"}
            className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg rounded-full"
          >
            <Smartphone className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Mobile
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setDeviceMode("desktop")}
            variant={deviceMode === "desktop" ? "default" : "outline"}
            className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg rounded-full"
          >
            <Monitor className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Desktop
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")}
            variant="outline"
            className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg rounded-full"
          >
            {colorMode === "dark" ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ThemeGallery />
        </motion.div>
      </div>
    </div>
  )
}