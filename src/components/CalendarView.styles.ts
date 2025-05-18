import styled from 'styled-components'

import {disabledStyles, theme} from '../styles/theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.lg};
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.space.md};
`

export const DateSelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
`

export const MonthYear = styled.h2`
  font-weight: 600;
  font-size: ${theme.fontSizes.lg};
  margin: 0;
  cursor: pointer;
  padding: 6px;
  border-radius: ${theme.radii.md};
  border: 1px solid transparent;
  transition: all ${theme.transitions.base};
  text-decoration: underline;

  &:hover {
    border-color: ${theme.colors.border};
  }
`

export const DateToggleButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px 8px;
`

export const CategorySelector = styled.select`
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.radii.md};
  border: 1px solid ${theme.colors.border};
  font-size: ${theme.fontSizes.base};
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: 2px solid ${theme.colors.event.default.border};
    outline-offset: 1px;
  }
`

export const Navigation = styled.div`
  display: flex;
  gap: ${theme.space.sm};
`

export const NavigationButton = styled.button<{$today?: boolean}>`
  padding: ${theme.space.sm} ${theme.space.md};
  background: ${(props) => (props.$today ? '#f0f0f0' : 'transparent')};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  font-weight: ${(props) => (props.$today ? '700' : 'normal')};

  &:hover:not(:disabled) {
    background-color: #f5f5f5;
  }

  &:disabled {
    ${disabledStyles}
  }
`

export const DatePicker = styled.div`
  border-radius: ${theme.radii.md};
  padding: ${theme.space.md};
  margin-top: ${theme.space.sm};
  background-color: #f9f9f9;
  border: 1px solid ${theme.colors.border};
  box-shadow: ${theme.shadows.lg};
`

export const DatePickerRow = styled.div`
  display: flex;
  gap: ${theme.space.md};
  flex-wrap: wrap;
`

export const DatePickerGroup = styled.div`
  flex: 1;
  min-width: 200px;
`

export const DatePickerTitle = styled.div`
  font-weight: 600;
  margin-bottom: ${theme.space.sm};
`

export const DatePickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
`

export const DateOptionButton = styled.button<{$active?: boolean}>`
  padding: 6px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  cursor: pointer;
  text-align: center;
  transition: background-color ${theme.transitions.fast};
  background-color: ${(props) => (props.$active ? theme.colors.highlight : 'white')};

  &:hover {
    background-color: ${theme.colors.event.default.bg};
  }
`

export const LoadingIndicator = styled.div`
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: ${theme.radii.md};
`

export const DaysHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

export const DayName = styled.div`
  flex: 1;
  padding: ${theme.space.sm};
  text-align: center;
  font-weight: 600;
`

export const CalendarGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const DayCell = styled.div<{$inactive?: boolean}>`
  padding: ${theme.space.md};
  min-height: ${theme.calendar.dayMinHeight};
  width: ${theme.calendar.dayWidth};
  box-sizing: border-box;
  opacity: ${(props) => (props.$inactive ? 0.3 : 1)};
`

export const DayContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.space.md};
`

export const DayNumber = styled.div`
  font-weight: 600;
`

export const EmptyState = styled.div`
  padding: ${theme.space.lg};
  text-align: center;
  background-color: #fafafa;
  border-radius: ${theme.radii.md};
  margin-top: ${theme.space.lg};
  color: #666;
`
