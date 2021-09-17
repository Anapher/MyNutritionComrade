export class Vector2 {
   constructor(public x: number, public y: number) {}

   add(v: Vector2): Vector2 {
      return new Vector2(this.x + v.x, this.y + v.y);
   }

   subtract(v: Vector2): Vector2 {
      return new Vector2(this.x - v.x, this.y - v.y);
   }

   multiply(v: Vector2 | number): Vector2 {
      if (v instanceof Vector2) return new Vector2(this.x * v.x, this.y * v.y);
      else return new Vector2(this.x * v, this.y * v);
   }

   divide(v: Vector2 | number) {
      if (v instanceof Vector2) return new Vector2(this.x / v.x, this.y / v.y);
      else return new Vector2(this.x / v, this.y / v);
   }

   dot(v: Vector2) {
      return this.x * v.x + this.y * v.y;
   }

   length() {
      return Math.sqrt(this.dot(this));
   }

   unit() {
      return this.divide(this.length());
   }
}
