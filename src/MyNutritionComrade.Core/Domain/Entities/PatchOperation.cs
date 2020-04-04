using Newtonsoft.Json.Linq;

namespace MyNutritionComrade.Core.Domain.Entities
{
    public abstract class PatchOperation
    {
        public abstract PatchOperationType Type { get; }
        public abstract string Path { get; }
    }

    public class OpSetProperty : PatchOperation
    {
        public OpSetProperty(string path, JToken value)
        {
            Path = path;
            Value = value;
        }

        public override PatchOperationType Type => PatchOperationType.Set;
        public override string Path { get; }
        public JToken Value { get; }
    }

    public class OpUnsetProperty : PatchOperation
    {
        public OpUnsetProperty(string path)
        {
            Path = path;
        }

        public override PatchOperationType Type => PatchOperationType.Unset;
        public override string Path { get; }
    }

    public class OpAddItem : PatchOperation
    {
        public OpAddItem(string path, JToken item)
        {
            Path = path;
            Item = item;
        }

        public override PatchOperationType Type => PatchOperationType.Add;
        public override string Path { get; }
        public JToken Item { get; }
    }

    public class OpRemoveItem : PatchOperation
    {
        public OpRemoveItem(string path, JToken item)
        {
            Path = path;
            Item = item;
        }

        public override PatchOperationType Type => PatchOperationType.Remove;
        public override string Path { get; }
        public JToken Item { get; }
    }

    public enum PatchOperationType
    {
        Set,
        Unset,
        Add,
        Remove
    }
}
