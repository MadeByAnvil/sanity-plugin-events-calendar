import styled, {css} from 'styled-components'

import {theme} from '../styles/theme'

// Define common styles for different event states
const featuredEventStyles = css`
  background-color: ${theme.colors.event.featured.bg};
  border-color: ${theme.colors.event.featured.border};
`

const postponedEventStyles = css`
  background-color: ${theme.colors.event.postponed.bg};
  border-color: ${theme.colors.event.postponed.border};
`

const cancelledEventStyles = css`
  background-color: ${theme.colors.event.cancelled.bg};
  border-color: ${theme.colors.event.cancelled.border};
`

// Main event container with conditional styling
export const EventContainer = styled.div<{
  $featured?: boolean
  $postponed?: boolean
  $cancelled?: boolean
  $categoryColor?: string
}>`
  font-size: ${theme.fontSizes.sm};
  padding: ${theme.space.sm};
  margin-bottom: 4px;
  background-color: ${theme.colors.event.default.bg};
  border-radius: ${theme.radii.md};
  cursor: pointer;
  box-shadow: ${theme.shadows.sm};
  transition: all ${theme.transitions.base};
  border: 1px solid ${theme.colors.event.default.border};
  position: relative;
  overflow: hidden;

  /* Apply event state styles */
  ${(props) => props.$featured && featuredEventStyles}
  ${(props) => props.$postponed && postponedEventStyles}
  ${(props) => props.$cancelled && cancelledEventStyles}
  
  /* Apply category color if available */
  ${(props) =>
    props.$categoryColor &&
    css`
      border-left: 3px solid ${props.$categoryColor};
      padding-left: 6px;
    `}
  
  /* Hover effects */
  &:hover {
    opacity: 0.9;
    box-shadow: ${theme.shadows.md};
    transform: translateY(-1px);
  }
`

export const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

export const EventTitle = styled.span<{
  $featured?: boolean
  $postponed?: boolean
  $cancelled?: boolean
}>`
  word-break: break-word;

  /* Apply text styling based on event state */
  ${(props) =>
    props.$featured &&
    css`
      font-weight: bold;
      color: ${theme.colors.event.featured.text};
    `}

  ${(props) =>
    props.$postponed &&
    css`
      font-style: italic;
      color: ${theme.colors.event.postponed.text};
    `}
  
  ${(props) =>
    props.$cancelled &&
    css`
      text-decoration: line-through;
      color: ${theme.colors.event.cancelled.text};
    `}
`

export const EventTime = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: #666;
  margin-left: 4px;
  white-space: nowrap;
`

export const EventStatus = styled.div<{
  $status: 'cancelled' | 'postponed'
}>`
  margin-top: 2px;
  font-size: ${theme.fontSizes.xs};
  font-weight: 500;
  color: ${(props) =>
    props.$status === 'cancelled'
      ? theme.colors.event.cancelled.text
      : theme.colors.event.postponed.text};
`

export const EventCategories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
  font-size: ${theme.fontSizes.xs};
`

export const CategoryBadge = styled.span<{
  $backgroundColor?: string
  $textColor?: string
}>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: ${theme.radii.sm};
  font-weight: 500;
  font-size: ${theme.fontSizes.xs};
  background-color: ${(props) => props.$backgroundColor || '#eee'};
  color: ${(props) => props.$textColor || '#333'};
`

export const CategoryMore = styled.span`
  font-size: ${theme.fontSizes.xs};
  color: #666;
`
