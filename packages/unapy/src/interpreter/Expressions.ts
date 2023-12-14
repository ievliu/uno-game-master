
abstract class Expression {
    operands: Component
    interpret(context: Context) {
        const stringOperands = context.command.split(" ");
        stringOperands.forEach(element => {
            this.operands.addItem(element)
        });
    }
}

class NonTerminalExpression extends Expression {

    expressions: Expression

    interpret(context: Context) {
        super.interpret(context)
        this.expressions.operands = this.operands
    }
    
}

class Command extends Expression {
    interpret(context: Context) {
        super.interpret(context)
        this.operands.execute(this.operands[0])
    }

}


