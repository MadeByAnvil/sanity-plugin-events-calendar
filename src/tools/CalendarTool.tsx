import {CalendarIcon} from '@sanity/icons'
import {Flex, Box, Card, Text} from '@sanity/ui'
import {CalendarView} from '../components/CalendarView'

export default function CalendarTool() {
  return (
    <Flex padding={4} direction="column">  
      <Box marginBottom={4}>
        <Text weight="semibold" size={4}>Event Calendar</Text>
      </Box>
      <Card padding={4} radius={2} shadow={1}>
        <CalendarView />
      </Card>
    </Flex>
  )
}
