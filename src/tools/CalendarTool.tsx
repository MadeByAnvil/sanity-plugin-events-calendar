import React, {useState} from 'react'
import {CalendarIcon, InfoOutlineIcon} from '@sanity/icons'
import {ThemeProvider, studioTheme} from '@sanity/ui'
import {CalendarView} from '../components/CalendarView'
import {useRouter} from 'sanity/router'
import {
  Container,
  Header,
  TitleContainer,
  Title,
  InfoButton,
  Legend,
  LegendItem,
  LegendColor,
  HelpTips,
  CalendarContainer,
  ActionsContainer,
  PrimaryButton,
  SecondaryButton,
  Footer
} from './CalendarTool.styles'

export default function CalendarTool() {
  const router = useRouter()
  const [showHelpTips, setShowHelpTips] = useState(false)
  
  const handleEventClick = (id: string) => {
    // Navigate to the document editor for this event
    if (id) {
      router.navigateIntent('edit', {
        id, 
        type: 'calendarEvent'
      })
    }
  }
  
  const toggleHelpTips = () => {
    setShowHelpTips(!showHelpTips)
  }
  
  return (
    <ThemeProvider theme={studioTheme}>
      <Container>  
        <Header>
          <TitleContainer>
            <Title>
              <CalendarIcon style={{marginRight: '8px', verticalAlign: 'middle'}} />
              Event Calendar
            </Title>
            <InfoButton 
              onClick={toggleHelpTips}
              title="Show/hide help information"
            >
              <InfoOutlineIcon />
            </InfoButton>
          </TitleContainer>
          
          <Legend>
            <LegendItem>
              <LegendColor variant="default" />
              <span>Normal</span>
            </LegendItem>
            <LegendItem>
              <LegendColor variant="featured" />
              <span>Featured</span>
            </LegendItem>
            <LegendItem>
              <LegendColor variant="postponed" />
              <span>Postponed</span>
            </LegendItem>
            <LegendItem>
              <LegendColor variant="cancelled" />
              <span>Cancelled</span>
            </LegendItem>
          </Legend>
        </Header>
        
        {/* Help tips section */}
        {showHelpTips && (
          <HelpTips>
            <h3>Calendar Tips</h3>
            <ul>
              <li>Click on any event to open its editor</li>
              <li>Filter events by category using the dropdown</li>
              <li>Click on the month/year to quickly jump to a different date</li>
              <li>Use the "Today" button to return to the current month</li>
              <li>Only published events are shown (drafts are hidden)</li>
              <li>Events with categories show color-coded indicators</li>
            </ul>
          </HelpTips>
        )}
        
        <CalendarContainer>
          <CalendarView onEventClick={handleEventClick} />
        </CalendarContainer>
        
        <ActionsContainer>
          <PrimaryButton
            onClick={() => router.navigateIntent('create', { type: 'calendarEvent' })}
          >
            <span>+ Create New Event</span>
          </PrimaryButton>
          
          <SecondaryButton
            onClick={() => router.navigateIntent('create', { type: 'eventCategory' })}
          >
            Create Category
          </SecondaryButton>
        </ActionsContainer>
        
        <Footer>
          Note: Only published events are shown. Events marked as "Draft" or unpublished won't appear here.
        </Footer>
      </Container>
    </ThemeProvider>
  )
}