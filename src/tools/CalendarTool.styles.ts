import styled from 'styled-components'
import { blue } from '@sanity/color'
import { theme, interactiveStateStyles } from '../styles/theme'

export const Container = styled.div`
  padding: ${theme.space.lg};
  max-width: 1280px;
  margin: 0 auto;
`

export const Header = styled.div`
  margin-bottom: ${theme.space.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.space.md};
`

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.space.sm};
`

export const Title = styled.h2`
  font-weight: 600;
  font-size: ${theme.fontSizes.lg};
  margin: 0;
`

export const InfoButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  color: #666;
  transition: color ${theme.transitions.fast};
  
  &:hover {
    color: ${theme.colors.button.primary.bg};
  }
`

export const Legend = styled.div`
  display: flex;
  gap: 10px;
  font-size: ${theme.fontSizes.sm};
  flex-wrap: wrap;
  background-color: #fafafa;
  padding: ${theme.space.sm} ${theme.space.md};
  border-radius: ${theme.radii.md};
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const LegendColor = styled.div<{ variant?: 'default' | 'featured' | 'postponed' | 'cancelled' }>`
  width: 12px;
  height: 12px;
  border-radius: ${theme.radii.sm};
  background-color: ${props => {
    switch(props.variant) {
      case 'featured':
        return theme.colors.event.featured.bg;
      case 'postponed':
        return theme.colors.event.postponed.bg;
      case 'cancelled':
        return theme.colors.event.cancelled.bg;
      default:
        return theme.colors.event.default.bg;
    }
  }};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'featured':
        return theme.colors.event.featured.border;
      case 'postponed':
        return theme.colors.event.postponed.border;
      case 'cancelled':
        return theme.colors.event.cancelled.border;
      default:
        return theme.colors.event.default.border;
    }
  }};
`

export const HelpTips = styled.div`
  margin-bottom: ${theme.space.lg};
  padding: ${theme.space.md} ${theme.space.lg};
  background-color: ${theme.colors.info.bg};
  border-radius: ${theme.radii.md};
  font-size: ${theme.fontSizes.base};
  border: 1px solid ${theme.colors.info.border};
  
  h3 {
    font-size: ${theme.fontSizes.md};
    margin: 0 0 ${theme.space.sm} 0;
  }
  
  ul {
    margin: 0;
    padding-left: 20px;
  }
`

export const CalendarContainer = styled.div`
  padding: ${theme.space.lg};
  border-radius: ${theme.radii.md};
  box-shadow: ${theme.shadows.md};
  background-color: ${theme.colors.background};
`

export const ActionsContainer = styled.div`
  margin-top: ${theme.space.lg};
  display: flex;
  gap: ${theme.space.lg};
  justify-content: center;
  flex-wrap: wrap;
`

export const PrimaryButton = styled.button`
  padding: ${theme.space.sm} ${theme.space.lg};
  background-color: ${theme.colors.button.primary.bg};
  color: ${theme.colors.button.primary.text};
  border: none;
  border-radius: ${theme.radii.md};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color ${theme.transitions.fast};
  
  &:hover {
    background-color: ${blue[600].hex};
  }
`

export const SecondaryButton = styled.button`
  padding: ${theme.space.sm} ${theme.space.lg};
  background-color: ${theme.colors.button.secondary.bg};
  color: ${theme.colors.button.secondary.text};
  border: 1px solid ${theme.colors.button.secondary.border};
  border-radius: ${theme.radii.md};
  font-weight: 500;
  cursor: pointer;
  transition: background-color ${theme.transitions.fast};
  
  &:hover {
    background-color: #f5f5f5;
  }
`

export const Footer = styled.div`
  margin-top: ${theme.space.lg};
  font-size: ${theme.fontSizes.sm};
  color: #777;
  text-align: center;
`