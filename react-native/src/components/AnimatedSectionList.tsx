import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, SectionList, SectionListData, SectionListProps, View } from 'react-native';

type AnimationProps = {
    duration?: number;
    rowHeight: number;
};

type Props<SectionT> = SectionListProps<SectionT> & AnimationProps;

type SectionStateInfo = {
    previousItems: ItemInfo[];
    removing: FadingRemovedItem[];
    key: string;
};

type FadingRemovedItem = RemovedItem & {
    timestamp: number;
};

function isFadingRemovedItem(item: RemovedItem): item is FadingRemovedItem {
    return (item as FadingRemovedItem).timestamp !== undefined;
}

function AnimatedSectionList<T>({ renderItem, duration = 600, sections, keyExtractor, rowHeight, ...props }: Props<T>) {
    const [displaySections, setDisplaySections] = useState(sections);
    const [sectionStates, setSectionStates] = useState<SectionStateInfo[]>([]);
    const [refreshCounter, setRefreshCounter] = useState(0);

    // sections changed
    useEffect(() => {
        if (keyExtractor === undefined) throw 'The key extractor is required';

        const newState: SectionStateInfo[] = [];
        const display: SectionListData<T>[] = [];
        const now = Date.now();
        let refreshTimer = false;

        for (const s of sections) {
            if (s.key === undefined) throw 'The sections must have keys';

            // map data of section with key
            const items = s.data.map((item, i) => ({ item, key: keyExtractor(item, i) }));

            // find the current state of this section (memorized)
            const currentState = sectionStates.find((x) => x.key === s.key);

            // filter removing items that have their animation finished
            const removingItems = (currentState?.removing || []).filter((x) => x.timestamp > now - duration);

            // generate a new state
            const { previousItems, removing, view } = mapSection(
                items,
                currentState?.previousItems || [],
                removingItems,
            );

            // push to new state, set timestamp for newly removed items
            newState.push({
                previousItems,
                removing: removing.map((x) => {
                    if (isFadingRemovedItem(x)) return x;

                    refreshTimer = true;
                    return { ...x, timestamp: now };
                }),
                key: s.key!,
            });

            // push view to display
            display.push({ ...s, data: view.map((x) => x.item) as any });
        }
        if (refreshTimer) setTimeout(() => setRefreshCounter((x) => x + 1), duration);

        setSectionStates(newState);
        setDisplaySections(display);
    }, [sections, refreshCounter]);

    return (
        <SectionList
            {...props}
            keyExtractor={keyExtractor}
            sections={displaySections}
            renderItem={(item) => {
                const k = keyExtractor!(item.item, item.index);
                return (
                    <AnimatedItem
                        rowHeight={rowHeight}
                        removing={
                            !!sectionStates.find((x) => x.key === item.section.key)?.removing.find((x) => x.key === k)
                        }
                        duration={duration}
                    >
                        {renderItem && renderItem(item)}
                    </AnimatedItem>
                );
            }}
        />
    );
}

type ItemInfo = {
    key: string;
    item: unknown;
};

type RemovedItem = ItemInfo & {
    previous: string[];
};

type SectionInfo = {
    previousItems: ItemInfo[];
    removing: RemovedItem[];
    view: ItemInfo[];
};

export function mapSection(
    items: ItemInfo[],
    statePreviousItems: ItemInfo[],
    stateRemoving: RemovedItem[],
): SectionInfo {
    const removed = statePreviousItems.filter((x) => !items.find((y) => x.key === y.key));
    const newRemoving = [
        ...stateRemoving,
        ...removed.map((x) => ({
            ...x,
            previous: statePreviousItems.slice(0, statePreviousItems.indexOf(x)).map((x) => x.key),
        })),
    ];

    const itemsLeft = [...items];
    const removingLeft = [...newRemoving];
    const result: ItemInfo[] = [];

    // merge both lists
    while (true) {
        while (true) {
            let count = removingLeft.length;

            for (const removedItem of removingLeft) {
                if (
                    _.some(itemsLeft, (x) => removedItem.previous.includes(x.key)) ||
                    _.some(removingLeft, (x) => removedItem.previous.includes(x.key))
                )
                    continue;

                result.push(removedItem);
                removingLeft.splice(removingLeft.indexOf(removedItem), 1);
            }

            if (count == removingLeft.length) break; // we cannot add new removed items
        }

        if (itemsLeft.length === 0) {
            result.push(...removingLeft);
            break;
        }
        if (removingLeft.length === 0) {
            result.push(...itemsLeft);
            break;
        }

        const item = itemsLeft.splice(0, 1);
        result.push(...item);
    }

    return { removing: newRemoving, previousItems: items, view: result };
}

type ItemProps = {
    children?: any;
    duration?: number;
    removing: boolean;
    rowHeight: number;
};

function AnimatedItem({ children, duration, removing, rowHeight }: ItemProps) {
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animation, { toValue: 1, duration }).start();
    }, []);

    useEffect(() => {
        if (removing) {
            Animated.timing(animation, { toValue: 0, duration }).start();
        }
    }, [removing]);

    return (
        <Animated.View
            style={{
                height: animation.interpolate({ inputRange: [0, 1], outputRange: [0, rowHeight] }),
                opacity: animation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 1] }),
            }}
        >
            {children}
        </Animated.View>
    );
}

export default AnimatedSectionList;
