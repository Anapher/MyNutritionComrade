import React from 'react';
import { Button, Card, Title } from 'react-native-paper';
import { rootPersistor } from 'src/store';
import * as actions from 'src/features/auth/actions';
import { connect } from 'react-redux';

const dispatchProps = {
    signOut: actions.signOut,
};

type Props = typeof dispatchProps;

function LogOffWidget({ signOut }: Props) {
    return (
        <Card>
            <Card.Content>
                <Title>Account</Title>
            </Card.Content>
            <Card.Actions>
                <Button
                    onPress={() => {
                        rootPersistor.purge();
                        signOut();
                    }}
                >
                    Log Off
                </Button>
            </Card.Actions>
        </Card>
    );
}

export default connect(undefined, dispatchProps)(LogOffWidget);
