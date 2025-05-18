import {CalendarIcon, InfoOutlineIcon} from '@sanity/icons'
import {ThemeProvider, studioTheme} from '@sanity/ui'
import {CalendarView} from '../components/CalendarView'
import {useRouter} from 'sanity/router'
import React, {useState} from 'react'

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
      <div style={{padding: '16px', maxWidth: '1280px', margin: '0 auto'}}>  
        <div style={{
          marginBottom: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <h2 style={{fontWeight: 600, fontSize: '1.25rem', margin: 0}}>
              <CalendarIcon style={{marginRight: '8px', verticalAlign: 'middle'}} />
              Event Calendar
            </h2>
            <button 
              onClick={toggleHelpTips}
              title="Show/hide help information"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <InfoOutlineIcon style={{color: '#666'}} />
            </button>
          </div>
          
          <div style={{
            display: 'flex', 
            gap: '10px', 
            fontSize: '0.8rem',
            flexWrap: 'wrap',
            backgroundColor: '#fafafa',
            padding: '8px 12px',
            borderRadius: '4px'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
              <div style={{
                width: '12px', 
                height: '12px', 
                backgroundColor: '#e6f7ff', 
                borderRadius: '2px',
                border: '1px solid #bde3ff'
              }}></div>
              <span>Normal</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
              <div style={{
                width: '12px', 
                height: '12px', 
                backgroundColor: '#e6fff6', 
                borderRadius: '2px',
                border: '1px solid #c2ffe0'
              }}></div>
              <span>Featured</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
              <div style={{
                width: '12px', 
                height: '12px', 
                backgroundColor: '#fff5e6', 
                borderRadius: '2px',
                border: '1px solid #ffeac2'
              }}></div>
              <span>Postponed</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
              <div style={{
                width: '12px', 
                height: '12px', 
                backgroundColor: '#ffebe6', 
                borderRadius: '2px',
                border: '1px solid #ffccc2'
              }}></div>
              <span>Cancelled</span>
            </div>
          </div>
        </div>
        
        {/* Help tips section */}
        {showHelpTips && (
          <div style={{
            marginBottom: '16px',
            padding: '12px 16px',
            backgroundColor: '#f0f9ff',
            borderRadius: '4px',
            fontSize: '0.9rem',
            border: '1px solid #d0e8ff'
          }}>
            <h3 style={{fontSize: '1rem', margin: '0 0 8px 0'}}>Calendar Tips</h3>
            <ul style={{margin: '0', paddingLeft: '20px'}}>
              <li>Click on any event to open its editor</li>
              <li>Filter events by category using the dropdown</li>
              <li>Click on the month/year to quickly jump to a different date</li>
              <li>Use the "Today" button to return to the current month</li>
              <li>Only published events are shown (drafts are hidden)</li>
              <li>Events with categories show color-coded indicators</li>
            </ul>
          </div>
        )}
        
        <div style={{
          padding: '16px', 
          borderRadius: '4px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          backgroundColor: 'white'
        }}>
          <CalendarView onEventClick={handleEventClick} />
        </div>
        
        <div style={{
          marginTop: '16px', 
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => router.navigateIntent('create', { type: 'calendarEvent' })}
            style={{
              padding: '8px 16px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>+ Create New Event</span>
          </button>
          
          <button
            onClick={() => router.navigateIntent('create', { type: 'eventCategory' })}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffffff',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Create Category
          </button>
        </div>
        
        <div style={{marginTop: '16px', fontSize: '0.85rem', color: '#777', textAlign: 'center'}}>
          Note: Only published events are shown. Events marked as "Draft" or unpublished won't appear here.
        </div>
      </div>
    </ThemeProvider>
  )
}
