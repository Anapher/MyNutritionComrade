import React, { useEffect, useRef, useState } from 'react';
import { Animated, SectionList, StyleSheet, SectionListData, SectionListProps } from 'react-native';
import _ from 'lodash';

type AnimationProps = {
    duration?: number;
    rowHeight: number;
};

type Props<SectionT> = SectionListProps<SectionT> & AnimationProps;

type SectionStateInfo = {
    previousItems: ItemInfo[];
    removing: RemovedItem[];
    key: string;
};

function AnimatedSectionList<T>({ renderItem, duration = 600, sections, keyExtractor, rowHeight, ...props }: Props<T>) {
    const [displaySections, setDisplaySections] = useState(sections);
    const [sectionStates, setSectionStates] = useState<SectionStateInfo[]>([]);

    useEffect(() => {
        if (keyExtractor === undefined) throw 'The key extractor is required';

        const result: SectionStateInfo[] = [];
        const display: SectionListData<T>[] = [];
        for (const s of sections) {
            if (s.key === undefined) throw 'The sections must have keys';

            const currentState = sectionStates.find((x) => x.key === s.key);
            const items = s.data.map((item, i) => ({ item, key: keyExtractor(item, i) }));

            const asd = mapSection(items, currentState?.previousItems || [], currentState?.removing || []);

            const { nowRemoved, previousItems, removing, view } = asd;
            result.push({ previousItems, removing, key: s.key! });

            display.push({ ...s, data: view.map((x) => x.item) as any });

            if (nowRemoved.length > 0) {
                const sectionKey = s.key;
                const removedItems = nowRemoved.map((x) => x.key);

                setTimeout(() => {
                    setSectionStates((x) =>
                        x.map((x) =>
                            x.key === sectionKey
                                ? {
                                      ...x,
                                      removing: x.removing.filter((removed) => !removedItems.includes(removed.key)),
                                  }
                                : x,
                        ),
                    );
                    setDisplaySections((x) =>
                        x.map((x) =>
                            x.key === sectionKey
                                ? {
                                      ...x,
                                      data: x.data.filter((d, i) => !removedItems.includes(keyExtractor!(d, i))),
                                  }
                                : x,
                        ),
                    );
                }, duration + 100);
            }
        }

        setSectionStates(result);
        setDisplaySections(display);
    }, [sections]);

    return (
        <SectionList
            {...props}
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
    nowRemoved: ItemInfo[];
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

    return { removing: newRemoving, previousItems: items, view: result, nowRemoved: removed };
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
                opacity: animation,
            }}
        >
            {children}
        </Animated.View>
    );
}

export default AnimatedSectionList;
