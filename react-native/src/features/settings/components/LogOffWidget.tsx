import React from 'react';
import { Button, Card, Title } from 'react-native-paper';
import { connect } from 'react-redux';
import { purgeState } from 'src/store/purgable-reducer';

const dispatchProps = {
    purgeState,
};

type Props = typeof dispatchProps;

function LogOffWidget({ purgeState }: Props) {
    return (
        <Card>
            <Card.Content>
                <Title>Account</Title>
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => purgeState()}>Log Off</Button>
            </Card.Actions>
        </Card>
    );
}

export default connect(undefined, dispatchProps)(LogOffWidget);
