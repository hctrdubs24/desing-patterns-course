// behavioral

// Observer
// 1->n
interface Observer {
  update(orderId: string): void;
}

class Kitchen implements Observer {
  update(orderId: string): void {
    console.log(`Cocina: preparando pedido ${orderId}`);
  }
}

class Delivery implements Observer {
  update(orderId: string): void {
    console.log(`Delivery: esperando pedido ${orderId}`);
  }
}

class OrderSubject {
  private observers: Observer[] = [];

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  notify(orderId: string) {
    this.observers.forEach((o) => o.update(orderId));
  }
}

const subject = new OrderSubject();
subject.addObserver(new Kitchen());
subject.addObserver(new Delivery());

subject.notify("7264526");

// Strategy

interface ShippingStrategy {
  calculate(amount: number): number;
}

class DistanceShipping implements ShippingStrategy {
  calculate(amount: number): number {
    return amount * 1.2;
  }
}

class FreeShipping implements ShippingStrategy {
  calculate(_amount: number): number {
    return 0;
  }
}

class ShippingContext {
  constructor(private strategy: ShippingStrategy) {}

  getShippingCost(amount: number) {
    return this.strategy.calculate(amount);
  }
}

const context = new ShippingContext(new DistanceShipping());
console.log(context.getShippingCost(100));

const freeContext = new ShippingContext(new FreeShipping());
console.log(freeContext.getShippingCost(100));

// Command

interface Command {
  execute(): void;
  undo(): void;
}

class AddItemCommand implements Command {
  constructor(
    private order: string[],
    private item: string,
    private logs: string[] = [],
  ) {}

  execute(): void {
    this.order.push(this.item);
    this.logs.push(`Agregado ${this.item}`);
  }

  undo(): void {
    this.order.pop();
    this.logs.push(`Eliminado ${this.item}`);
  }
}

const order: string[] = [];

const addPizza = new AddItemCommand(order, "Pizza");
addPizza.execute();
console.log(order);
addPizza.undo();
console.log(order);

//State

interface OrderState {
  next(order: OrderContext): void;
  getStatus(): string;
}

class NewOrder implements OrderState {
  next(order: OrderContext): void {
    order.setState(new CookingOrder());
  }

  getStatus(): string {
    return "nuevo";
  }
}

class CookingOrder implements OrderState {
  next(order: OrderContext): void {
    order.setState(new DeliveryOrder());
  }

  getStatus(): string {
    return "En cocina";
  }
}

class DeliveryOrder implements OrderState {
  next(order: OrderContext): void {
    order.setState(new DeliveredOrder());
  }
  getStatus(): string {
    return "En entrega";
  }
}

class DeliveredOrder implements OrderState {
  next(order: OrderContext): void {
    console.log("El pedido ya fue entregado");
  }
  getStatus(): string {
    return "Entregado";
  }
}

class OrderContext {
  private state: OrderState;

  constructor() {
    this.state = new NewOrder();
  }

  setState(state: OrderState) {
    this.state = state;
  }

  next() {
    this.state.next(this);
  }

  getStatus() {
    return this.state.getStatus();
  }
}

const orderContext = new OrderContext();
console.log(orderContext.getStatus());
orderContext.next();
console.log(orderContext.getStatus());
orderContext.next();
console.log(orderContext.getStatus());
orderContext.next();
console.log(orderContext.getStatus());
orderContext.next();

// Chain of responsability

interface OrderChain {
  inStock: boolean;
  paid: boolean;
}

abstract class ValidationHandler {
  protected next?: ValidationHandler;

  setNext(handler: ValidationHandler): ValidationHandler {
    this.next = handler;
    return handler;
  }

  handler(order: OrderChain): boolean {
    if (this.next) return this.next.handler(order);
    return true;
  }
}

class StockValidator extends ValidationHandler {
  handler(order: OrderChain): boolean {
    if (!order.inStock) {
      console.log("Sin stock");
      return false;
    }

    return super.handler(order);
  }
}

class PaymentValidation extends ValidationHandler {
  handler(order: OrderChain): boolean {
    if (!order.paid) {
      console.log("No pagado");
      return false;
    }

    return super.handler(order);
  }
}

const stockValidation = new StockValidator();
const paymentValidation = new PaymentValidation();

stockValidation.setNext(paymentValidation);

const orderChain: OrderChain = { inStock: true, paid: false };
stockValidation.handler(orderChain);
