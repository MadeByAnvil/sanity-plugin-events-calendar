import {jest} from '@jest/globals'
import React from 'react'
type StyledComponent = {
  div: (() => string) & {attrs: () => () => string}
  span: (() => string) & {attrs: () => () => string}
  h1: () => string
  h2: () => string
  h3: () => string
  ul: () => string
  li: () => string
  button: (() => string) & {attrs: () => () => string}
}

const styled: StyledComponent = {
  div: Object.assign(() => 'div', {attrs: () => () => 'div'}),
  span: Object.assign(() => 'span', {attrs: () => () => 'span'}),
  h1: () => 'h1',
  h2: () => 'h2',
  h3: () => 'h3',
  ul: () => 'ul',
  li: () => 'li',
  button: Object.assign(() => 'button', {attrs: () => () => 'button'}),
}

styled.div.attrs = () => styled.div
styled.span.attrs = () => styled.span
styled.button.attrs = () => styled.button

export const ThemeProvider = ({children}: {children: React.ReactNode}) => children
export const createGlobalStyle = jest.fn().mockImplementation(() => () => null)
export default styled
