// FoodieApp
//

// Factory Method
interface Food {
  prepare(): void;
}

class Pizza implements Food {
  prepare(): void {
    console.log("prepare pizza");
  }
}

class Empanada implements Food {
  prepare(): void {
    console.log("prepare empanada");
  }
}

const FoodType = {
  pizza: Pizza,
  empanada: Empanada,
} as const;

class FoodFactory {
  static createFood(type: keyof typeof FoodType): Food {
    return new FoodType[type]();
  }
}

const factory = FoodFactory.createFood("pizza");

factory.prepare();

// Abstract Factory
class ArgentinianPizza extends Pizza {
  prepare(): void {
    console.log("prepare argentinian pizza");
  }
}

class ArgentinianEmpanada extends Empanada {
  prepare(): void {
    console.log("prepare argentinian empanada");
  }
}

class JapanesePizza extends Pizza {
  prepare(): void {
    console.log("prepare japanese pizza");
  }
}

interface FoodFactory {
  createPizza(): Pizza;
  createEmpanada(): Empanada;
}

class ArgentinianFoodFactory implements FoodFactory {
  createPizza(): Pizza {
    return new ArgentinianPizza();
  }
  createEmpanada(): Empanada {
    return new ArgentinianEmpanada();
  }
}

//Builder

class Lasaña {
  private size: string;
  private cheese: string;

  constructor(builder: LasañaBuilder) {
    this.size = builder.size;
    this.cheese = builder.cheese;
  }

  describe() {
    console.log(
      `La lasaña es de tamaño ${this.size} y tiene queso ${this.cheese}`,
    );
  }
}

class LasañaBuilder {
  size: string = "Large";
  cheese: string = "mozzarella";

  setSize(size: string) {
    this.size = size;
    return this;
  }

  setCheese(cheese: string) {
    this.cheese = cheese;
    return this;
  }

  build(): Lasaña {
    return new Lasaña(this);
  }
}

const lasaña = new LasañaBuilder()
  .setSize("grande")
  .setCheese("cheddar")
  .build();

const lasañita = new LasañaBuilder().setSize("pequeña").build();

//Singleton

class ConfigManager {
  private static instance: ConfigManager;
  private config: Record<string, any> = {};

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) ConfigManager.instance = new ConfigManager();
    return ConfigManager.instance;
  }

  set(key: string, value: any) {
    this.config[key] = value;
  }

  get(key: string) {
    return this.config[key];
  }
}

const config1 = ConfigManager.getInstance();
const config2 = ConfigManager.getInstance();

config1.set("apiUrl", "https://api.foodieapp.com");
console.info("TEST SINGLETON");
console.log(config2.get("apiUrl"));
console.log(config1 === config2);

// Proptotype

interface Clonable<T> {
  clone(): T;
}

class Order implements Clonable<Order> {
  items: string[];
  address: string;

  constructor(items: string[], address: string) {
    this.address = address;
    this.items = items;
  }

  clone(): Order {
    return new Order([...this.items], this.address);
  }
}

const originalOrder: Order = new Order(
  ["pizza", "empanada"],
  "calle la mentira",
);
const clonedOrder: Order = originalOrder.clone();

clonedOrder.items.push("sushi");

console.log(`Original Order ${originalOrder.items.toString()}`);
console.log(`Cloned Order ${clonedOrder.items.toString()}`);
