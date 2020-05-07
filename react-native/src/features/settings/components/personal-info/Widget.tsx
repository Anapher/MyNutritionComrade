import { StackNavigationProp } from '@react-navigation/stack';
import { DateTime } from 'luxon';
import { UserPersonalInfo } from 'Models';
import React from 'react';
import { Button, Card, Paragraph, Title } from 'react-native-paper';
import Highlight from '../Highlight';
import { SettingsStackParamList } from '../Settings';

type Props = {
    navigation: StackNavigationProp<SettingsStackParamList>;
    data: UserPersonalInfo;
    onChange: (newValue: UserPersonalInfo) => Promise<any>;
};

function Widget({ data, navigation, onChange }: Props) {
    const age = data.birthday ? (-DateTime.fromISO(data.birthday).diffNow('years').years).toFixed(0) : 'unknown';

    return (
        <Card>
            <Card.Content>
                <Title>Personal Info</Title>
                <Paragraph>
                    Height: <Highlight>{!!data.height ? data.height * 100 + ' cm' : 'unknown'}</Highlight>
                </Paragraph>
                <Paragraph>
                    Gender: <Highlight>{data.gender || 'unknown'}</Highlight>
                </Paragraph>
                <Paragraph>
                    Age (+/- 1 year): <Highlight>{age}</Highlight>
                </Paragraph>
            </Card.Content>
            <Card.Actions>
                <Button
                    onPress={() =>
                        navigation.navigate('ConfigurePersonalInfo', {
                            initialValue: data,
                            onSubmit: onChange,
                        })
                    }
                >
                    Adjust
                </Button>
            </Card.Actions>
        </Card>
    );
}

export default Widget;
