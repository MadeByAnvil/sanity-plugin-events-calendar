import React, {useState, useEffect} from 'react'
import {useClient} from 'sanity'
import {Stack, Box, Text, Card, Flex, Button} from '@sanity/ui'

type Event = {
  _id: string
  title: string
  startDateTime: string
  endDateTime?: string
  allDay: boolean
}

type CalendarViewProps = {
  /* Add any props here */
}

export function CalendarView(props: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const client = useClient({apiVersion: '2023-01-01'})

  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  
  // Get day of week (0 = Sunday, 6 = Saturday)
  const startDay = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        // Format the date range for GROQ query
        const startOfMonth = firstDayOfMonth.toISOString()
        const endOfMonth = lastDayOfMonth.toISOString()

        // Fetch events for the current month
        const query = `*[_type == "calendarEvent" && startDateTime >= $startDate && startDateTime <= $endDate] | order(startDateTime asc) {
          _id,
          title,
          startDateTime,
          endDateTime,
          allDay
        }`

        const result = await client.fetch(query, {
          startDate: startOfMonth,
          endDate: endOfMonth,
        })

        setEvents(result)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [currentDate, client, firstDayOfMonth, lastDayOfMonth])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Generate day cells for the calendar grid
  const renderCalendarDays = () => {
    const days = []
    const totalCells = Math.ceil((daysInMonth + startDay) / 7) * 7

    // Add days from previous month if needed (for UI grid alignment)
    for (let i = 0; i < startDay; i++) {
      days.push(
        <Box key={`empty-start-${i}`} padding={3} style={{opacity: 0.3}}>
          <Text size={1}></Text>
        </Box>
      )
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const formattedDate = date.toISOString().split('T')[0] // YYYY-MM-DD

      // Find events for this day
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startDateTime).toISOString().split('T')[0]
        return eventDate === formattedDate
      })

      days.push(
        <Box key={`day-${day}`} padding={3} style={{minHeight: '100px', border: '1px solid #e1e1e1'}}>
          <Flex direction="column" gap={3}>
            <Text weight="semibold">{day}</Text>
            
            {dayEvents.map(event => (
              <Card key={event._id} padding={2} tone="primary" style={{marginBottom: 2}}>
                <Text size={1}>{event.title}</Text>
              </Card>
            ))}
          </Flex>
        </Box>
      )
    }

    // Add days from next month if needed (for UI grid alignment)
    const remainingCells = totalCells - (daysInMonth + startDay)
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <Box key={`empty-end-${i}`} padding={3} style={{opacity: 0.3}}>
          <Text size={1}></Text>
        </Box>
      )
    }

    return days
  }

  const monthName = currentDate.toLocaleString('default', {month: 'long'})
  const year = currentDate.getFullYear()

  return (
    <Stack space={4}>
      <Flex justify="space-between" align="center">
        <Text weight="semibold" size={4}>
          {monthName} {year}
        </Text>
        <Flex gap={2}>
          <Button onClick={handlePrevMonth} text="Previous" mode="ghost" />
          <Button onClick={handleNextMonth} text="Next" mode="ghost" />
        </Flex>
      </Flex>

      {isLoading ? (
        <Text>Loading events...</Text>
      ) : (
        <>
          <Flex wrap="wrap" justify="space-between">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Box key={day} flex={1} padding={2}>
                <Text align="center" weight="semibold">
                  {day}
                </Text>
              </Box>
            ))}
          </Flex>

          <Flex wrap="wrap">
            {renderCalendarDays()}
          </Flex>
        </>
      )}
    </Stack>
  )
}
