import React from 'react';
import {
    Heading,
    Card,
    CardHeader,
    CardBody,
    Box,
    Text
} from 'grommet';
import {FiCheckCircle} from 'react-icons/fi';
import CountUp from 'react-countup';

function QuickAccessGr({ title, number }) {
  return (
      <Box height='auto' width='auto' pad='small'>
    {number <= 0 ? (
        <Card border={{ color: 'status-ok', size: 'small' }} responsive>
            <CardBody align='center' pad='medium'responsive>
                <Text level={3} color='status-ok'responsive>{title}</Text>
                <FiCheckCircle color='#00C781' size='3rem'/>
            </CardBody>
        </Card>
    ) : (
        <Card  border={{ color: 'status-warning', size: 'small' }}responsive>
            <CardBody responsive align='center' pad='medium'>
                <Text level={3} responsive color='status-warning'>{title}</Text>
                <Heading responsive level={3} color='status-warning'><CountUp end={number} duration={3}/></Heading>
            </CardBody>
        </Card>)}
        </Box>
    
  );
}

export default QuickAccessGr;