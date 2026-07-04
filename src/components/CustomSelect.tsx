import { useState, useRef, useEffect } from 'react'

type CustomSelectOption<T extends string = string> = {
  value: T
  label: string
}

type CustomSelectProps<T extends string = string> = {
  value: T
  onChange: (value: T) => void
  options: readonly CustomSelectOption<T>[]
  label?: string
}

export function CustomSelect<T extends string>({
  value,
  onChange,
  options,
  label,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value) || options[0]

  // Ferme le menu quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOptionClick = (optionValue: T) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className="custom-select-wrapper">
      {label && <span>{label}</span>}
      <div
        ref={selectRef}
        className="custom-select"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen)
            e.preventDefault()
          }
          if (e.key === 'Escape') {
            setIsOpen(false)
          }
        }}
      >
        <span className="custom-select-value">{selectedOption.label}</span>
        <svg
          className="custom-select-arrow"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 9L2 4H12L7 9Z" />
        </svg>
        {isOpen && (
          <ul className="custom-select-dropdown" role="listbox">
            {options.map((option) => (
              <li
                key={option.value}
                className="custom-select-option"
                role="option"
                aria-selected={option.value === value}
                onClick={(e) => {
                  e.stopPropagation()
                  handleOptionClick(option.value)
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
