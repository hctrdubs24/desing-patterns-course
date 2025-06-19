// Adapter
// Interface external for

interface Payment {
  pay(amount: number): void;
}

// External service

class StripeService {
  makePayment(value: number) {
    console.log(`Paying $${value} with Stripe`);
  }
}

// Adapter
class StripeAdapter implements Payment {
  constructor(private stripe: StripeService) {}

  pay(amount: number): void {
    this.stripe.makePayment(amount);
  }
}

const payment: Payment = new StripeAdapter(new StripeService());
payment.pay(100);

//Decorator

interface Food {
  getDescription(): string;
  getCost(): number;
}

class BasicFood implements Food {
  getCost(): number {
    return 100;
  }

  getDescription(): string {
    return "Comida";
  }
}

class CheeseDecorator implements Food {
  constructor(private food: Food) {}

  getDescription(): string {
    return `${this.food.getDescription()} with extra cheese`;
  }

  getCost(): number {
    return this.food.getCost() + 20;
  }
}

class BaconDecorator implements Food {
  constructor(private food: Food) {}

  getDescription(): string {
    return `${this.food.getDescription()} with extra bacon`;
  }

  getCost(): number {
    return this.food.getCost() + 30;
  }
}

let pizza = new BasicFood();
pizza = new CheeseDecorator(pizza);
pizza = new BaconDecorator(pizza);
console.log(`${pizza.getDescription()} ${pizza.getCost()}`);

//Facade

class OrderService {
  createOrder() {
    console.log("Orden creada");
  }
}

class PaymentService {
  processPayment() {
    console.log("Pago procesado");
  }
}

class DeliveryService {
  dispatchOrder() {
    console.log("Pedido despachado");
  }
}

class OrderFacade {
  constructor(
    private order: OrderService,
    private payment: PaymentService,
    private delivery: DeliveryService,
  ) {}

  placeOrder() {
    this.order.createOrder();
    this.payment.processPayment();
    this.delivery.dispatchOrder();
  }
}

const facade = new OrderFacade(
  new OrderService(),
  new PaymentService(),
  new DeliveryService(),
);

facade.placeOrder();

//Composite

interface FoodItem {
  getName(): string;
  getPrice(): number;
}

class SimpleFood implements FoodItem {
  constructor(
    private name: string,
    private price: number,
  ) {}

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }
}

class Combo implements FoodItem {
  private items: FoodItem[] = [];

  add(item: FoodItem) {
    this.items.push(item);
  }

  getName(): string {
    return `Combo ${this.items.map((i) => i.getName()).join(", ")}`;
  }

  getPrice(): number {
    return this.items.reduce((sum, i) => sum + i.getPrice(), 0);
  }
}

const pizza2 = new SimpleFood("Pizza", 100);
const empanada = new SimpleFood("Empanada", 50);
const combo = new Combo();

combo.add(pizza2);
combo.add(empanada);

console.log(combo.getName());
console.log(combo.getPrice());

//Proxy

interface OrderHistory {
  getOrders(userId: string): string[];
}

class RealOrderHistory implements OrderHistory {
  getOrders(userId: string): string[] {
    console.log(`Consultando DB ${userId}`);
    return ["pedido1", "pedido2"];
  }
}

class OrderHistoryProxy implements OrderHistory {
  private cache: Record<string, string[]> = {};

  constructor(private realHistory: RealOrderHistory) {}

  getOrders(userId: string): string[] {
    if (!this.cache[userId])
      this.cache[userId] = this.realHistory.getOrders(userId);

    return this.cache[userId];
  }
}

const historys = new OrderHistoryProxy(new RealOrderHistory());
console.log(historys.getOrders("user1"));
console.log(historys.getOrders("user1")); //Mismo output pero sin consultar a la base de datos
