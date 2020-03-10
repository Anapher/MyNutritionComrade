namespace MyNutritionComrade.Core.Domain.Entities
{
    public class ServingType
    {
        protected bool Equals(ServingType other) => Name == other.Name;

        public override bool Equals(object? obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((ServingType) obj);
        }

        public override int GetHashCode() => Name.GetHashCode();

        public ServingType(string name)
        {
            Name = name;
        }

        public string Name { get; }

        public static ServingType Gram = new ServingType("g");
        public static ServingType Gram100 = new ServingType("100g");
        public static ServingType Slice = new ServingType("slice");
        public static ServingType Piece = new ServingType("piece");
        public static ServingType Bread = new ServingType("bread");
        public static ServingType Package = new ServingType("package");
    }
}