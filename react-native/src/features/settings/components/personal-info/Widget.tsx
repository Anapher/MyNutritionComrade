import { StackNavigationProp } from '@react-navigation/stack';
import * as jsonPatch from 'fast-json-patch';
import { DateTime } from 'luxon';
import { UserPersonalInfo } from 'Models';
import React from 'react';
import { Button, Card, Paragraph, Title } from 'react-native-paper';
import useAsyncFunction from 'src/hooks/use-async-function';
import * as actions from '../../actions';
import Highlight from '../Highlight';
import { SettingsStackParamList } from '../Settings';

type Props = {
    navigation: StackNavigationProp<SettingsStackParamList>;
    data: UserPersonalInfo;
};

function Widget({ data, navigation }: Props) {
    const patchAction = useAsyncFunction(
        actions.patchPersonalInfo.request,
        actions.patchPersonalInfo.success,
        actions.patchPersonalInfo.failure,
    );

    const age = data.birthday ? (-DateTime.fromISO(data.birthday).diffNow('years').years).toFixed(0) : 'unknown';

    return (
        <Card>
            <Card.Content>
                <Title>Personal Info</Title>
                <Paragraph>
                    Height: <Highlight>{!!data.height ? data.height + ' cm' : 'unknown'}</Highlight>
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
                            onSubmit: (newValue) => {
                                const ops = jsonPatch.compare(data, newValue);

                                return patchAction!(ops);
                            },
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
