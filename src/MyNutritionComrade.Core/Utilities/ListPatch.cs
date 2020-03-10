using System;
using System.Collections.Generic;
using System.Linq;

namespace MyNutritionComrade.Core.Utilities
{
    public static class ListPatch
    {
        public static void PatchStrings<TSource, TTarget>(IEnumerable<TSource> source, IEnumerable<TTarget> target, Func<TSource, TTarget, bool> compareItems,
            Func<TSource, TTarget, IEnumerable<(string, string)>> getKeys, Action<TTarget> removeItem, Action<TSource> addItem,
            Action<TTarget, TSource>? updateItem, double maxRelativeDistance = 0.4)
        {
            var removedItems = new List<TTarget>();
            var addedItems = new List<TSource>();

            PatchList(source, target, (sourceItem, targetItem) =>
            {
                if (!compareItems(sourceItem, targetItem))
                    return false;

                var keys = getKeys(sourceItem, targetItem);
                return keys.All(x => x.Item1 == x.Item2);
            }, removedItems.Add, addedItems.Add, updateItem);

            if (addedItems.Count > 0 && removedItems.Count > 0)
            {
                var relations = addedItems.Select(addedItem => (addedItem,
                    removedItems
                        .Where(x => compareItems(addedItem, x))
                        .Select(removedItem => (removedItem,
                            getKeys(addedItem, removedItem).Select(keys => CompareWords(keys.Item1, keys.Item2, maxRelativeDistance))))
                        .Where(x => x.Item2.All(z => z != null)).Select(x => (x.removedItem, x.Item2.Cast<int>().Sum())).OrderBy(x => x.Item2)));

                foreach (var (addedItem, similarRemovedItems) in relations.OrderBy(x => x.Item2.First()))
                {
                    foreach (var similarRemovedItem in similarRemovedItems)
                    {
                        if (removedItems.Contains(similarRemovedItem.removedItem))
                        {
                            updateItem?.Invoke(similarRemovedItem.removedItem, addedItem);
                            addedItems.Remove(addedItem);
                            removedItems.Remove(similarRemovedItem.removedItem);
                        }
                    }
                }
            }

            foreach (var addedItem in addedItems)
            {
                addItem(addedItem);
            }

            foreach (var removedItem in removedItems)
            {
                removeItem(removedItem);
            }
        }

        private static int? CompareWords(string word1, string word2, double maxRelativeDistance)
        {
            var maxAbsDistance = (int) Math.Ceiling(Math.Min(word1.Length, word2.Length) * maxRelativeDistance);
            var result = LevenshteinDistance.DamerauLevenshteinDistance(word1.ToCharArray(), word2.ToCharArray(), maxAbsDistance);
            if (result == int.MaxValue)
                return null;

            return result;
        }

        public static void PatchList<TSource, TTarget>(IEnumerable<TSource> source, IEnumerable<TTarget> target, Func<TSource, TTarget, bool> compareItems,
            Action<TTarget> removeItem, Action<TSource> addItem, Action<TTarget, TSource>? updateItem = null)
        {
            foreach (var targetItem in target)
            {
                var sourceItem = source.FirstOrDefault(x => compareItems(x, targetItem));
                if (sourceItem == null)
                    removeItem(targetItem);
                else
                {
                    updateItem?.Invoke(targetItem, sourceItem);
                }
            }

            foreach (var sourceItem in source)
            {
                var targetItem = target.FirstOrDefault(x => compareItems(sourceItem, x));
                if (targetItem == null)
                    addItem(sourceItem);
            }
        }
    }
}
