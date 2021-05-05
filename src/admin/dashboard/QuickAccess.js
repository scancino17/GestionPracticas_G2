import React from 'react';
import { Card, CardBody, CardHeader, CardFooter, Button } from 'grommet';
import { LinkNext } from 'grommet-icons';

function QuickAccess({ title, body }) {
  return (
    <Card height='small' width='small' background='light-1'>
      <CardHeader pad='medium'>{title}</CardHeader>
      <CardBody align='center' pad='medium'>
        {body}
      </CardBody>
      <CardFooter pad={{ horizontal: 'small' }} background='light-2'>
        <Button
          fill='horizontal'
          icon={<LinkNext color='plain' />}
          hoverIndicator
        />
      </CardFooter>
    </Card>
  );
}

export default QuickAccess;
